import { ConflictError, NotFoundError } from '../../errors/AppError.js';
import {
  buildHabitStats,
  startOfUtcDay,
  toUtcMonthKey,
} from '../../domain/habits/habitStats.js';
import { Habit } from './habit.model.js';
import { HabitCheckIn } from './habitCheckIn.model.js';

function toPlainObject(document) {
  return typeof document?.toObject === 'function' ? document.toObject() : document;
}

function toHabitResponse(habit, checkIns = [], statsContext = {}, monthCheckIns = checkIns) {
  const source = toPlainObject(habit);
  const stats = buildHabitStats(
    checkIns.map((checkIn) => toPlainObject(checkIn).date),
    {
      ...statsContext,
      monthCheckInDates: monthCheckIns.map((checkIn) => toPlainObject(checkIn).date),
    },
  );

  return {
    _id: source._id.toString(),
    name: source.name,
    todayCompleted: stats.todayCompleted,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    completionPercentage: stats.completionPercentage,
    completedDates: stats.completedDates,
    month: stats.month,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

function toCheckInResponse(checkIn) {
  const source = toPlainObject(checkIn);

  return {
    _id: source._id.toString(),
    habitId: source.habitId.toString(),
    date: source.date,
    month: source.month,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

function isDuplicateKeyError(error) {
  return error?.code === 11000;
}

export class HabitService {
  constructor({
    HabitModel = Habit,
    HabitCheckInModel = HabitCheckIn,
    clock = () => new Date(),
  } = {}) {
    this.HabitModel = HabitModel;
    this.HabitCheckInModel = HabitCheckInModel;
    this.clock = clock;
    this.habitMutationLocks = new Map();
  }

  async createHabit(userId, habitInput) {
    const habit = await this.HabitModel.create({
      ...habitInput,
      userId,
    });

    return toHabitResponse(habit, [], this.getStatsContext());
  }

  async listHabits(userId, { month, limit = 50, offset = 0 } = {}) {
    const filter = { userId };
    const [habits, total] = await Promise.all([
      this.HabitModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.HabitModel.countDocuments(filter),
    ]);
    const statsContext = this.getStatsContext(month);
    const checkIns = await this.findCheckInsForHabits(userId, habits);
    const monthCheckIns = await this.findMonthCheckInsForHabits(userId, habits, statsContext.month.key);
    const checkInsByHabitId = this.groupCheckInsByHabitId(checkIns);
    const monthCheckInsByHabitId = this.groupCheckInsByHabitId(monthCheckIns);

    return {
      habits: habits.map((habit) =>
        toHabitResponse(
          habit,
          checkInsByHabitId.get(habit._id.toString()) || [],
          statsContext,
          monthCheckInsByHabitId.get(habit._id.toString()) || [],
        ),
      ),
      month: statsContext.month,
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }

  async getHabitById(userId, habitId, { month } = {}) {
    const habit = await this.HabitModel.findOne({ _id: habitId, userId }).lean();

    if (!habit) {
      throw new NotFoundError('Habit not found');
    }

    const statsContext = this.getStatsContext(month);
    const checkIns = await this.findCheckInsForHabit(userId, habitId);
    const monthCheckIns = await this.findMonthCheckInsForHabit(userId, habitId, statsContext.month.key);

    return toHabitResponse(habit, checkIns, statsContext, monthCheckIns);
  }

  async updateHabit(userId, habitId, updates, { month } = {}) {
    const habit = await this.HabitModel.findOneAndUpdate(
      { _id: habitId, userId },
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!habit) {
      throw new NotFoundError('Habit not found');
    }

    const statsContext = this.getStatsContext(month);
    const checkIns = await this.findCheckInsForHabit(userId, habitId);
    const monthCheckIns = await this.findMonthCheckInsForHabit(userId, habitId, statsContext.month.key);

    return toHabitResponse(habit, checkIns, statsContext, monthCheckIns);
  }

  async deleteHabit(userId, habitId) {
    return this.withHabitMutationLock(userId, habitId, async () => {
      const habit = await this.HabitModel.findOne({ _id: habitId, userId }).lean();

      if (!habit) {
        throw new NotFoundError('Habit not found');
      }

      await this.HabitCheckInModel.deleteMany({ userId, habitId: habit._id });
      const deleteResult = await this.HabitModel.deleteOne({ _id: habit._id, userId });

      if (deleteResult.deletedCount === 0) {
        throw new NotFoundError('Habit not found');
      }
    });
  }

  async checkInHabit(userId, habitId) {
    return this.withHabitMutationLock(userId, habitId, async () => {
      const habit = await this.HabitModel.findOne({ _id: habitId, userId }).lean();

      if (!habit) {
        throw new NotFoundError('Habit not found');
      }

      const now = this.clock();
      const date = startOfUtcDay(now);
      const month = toUtcMonthKey(date);
      let checkIn;

      try {
        checkIn = await this.HabitCheckInModel.create({
          userId,
          habitId,
          date,
          month,
        });
      } catch (error) {
        if (isDuplicateKeyError(error)) {
          throw new ConflictError('Habit already checked in for today');
        }

        throw error;
      }

      const currentHabit = await this.HabitModel.findOne({ _id: habitId, userId }).lean();

      if (!currentHabit) {
        await this.HabitCheckInModel.deleteOne({ _id: checkIn._id, userId, habitId });
        throw new NotFoundError('Habit not found');
      }

      const statsContext = this.getStatsContext(month, now);
      const checkIns = await this.findCheckInsForHabit(userId, habitId);
      const monthCheckIns = await this.findMonthCheckInsForHabit(
        userId,
        habitId,
        statsContext.month.key,
      );

      return {
        checkIn: toCheckInResponse(checkIn),
        habit: toHabitResponse(currentHabit, checkIns, statsContext, monthCheckIns),
      };
    });
  }

  async findCheckInsForHabits(userId, habits) {
    if (habits.length === 0) {
      return [];
    }

    return this.HabitCheckInModel.find({
      userId,
      habitId: { $in: habits.map((habit) => habit._id) },
    })
      .sort({ date: 1 })
      .lean();
  }

  async findMonthCheckInsForHabits(userId, habits, month) {
    if (habits.length === 0) {
      return [];
    }

    return this.HabitCheckInModel.find({
      userId,
      month,
      habitId: { $in: habits.map((habit) => habit._id) },
    })
      .sort({ date: 1 })
      .lean();
  }

  async findCheckInsForHabit(userId, habitId) {
    return this.HabitCheckInModel.find({ userId, habitId }).sort({ date: 1 }).lean();
  }

  async findMonthCheckInsForHabit(userId, habitId, month) {
    return this.HabitCheckInModel.find({ userId, habitId, month }).sort({ date: 1 }).lean();
  }

  groupCheckInsByHabitId(checkIns) {
    return checkIns.reduce((grouped, checkIn) => {
      const source = toPlainObject(checkIn);
      const habitId = source.habitId.toString();
      const habitCheckIns = grouped.get(habitId) || [];

      habitCheckIns.push(source);
      grouped.set(habitId, habitCheckIns);

      return grouped;
    }, new Map());
  }

  getStatsContext(monthKey, now = this.clock()) {
    const today = now;
    const selectedMonth = monthKey || toUtcMonthKey(today);
    const stats = buildHabitStats([], { monthKey: selectedMonth, today });

    return {
      today,
      monthKey: selectedMonth,
      month: stats.month,
    };
  }

  async withHabitMutationLock(userId, habitId, operation) {
    const key = `${userId.toString()}:${habitId.toString()}`;
    const previousLock = this.habitMutationLocks.get(key) || Promise.resolve();
    let releaseCurrentLock;
    const currentLock = new Promise((resolve) => {
      releaseCurrentLock = resolve;
    });
    const lockChain = previousLock.catch(() => undefined).then(() => currentLock);

    this.habitMutationLocks.set(key, lockChain);
    await previousLock.catch(() => undefined);

    try {
      return await operation();
    } finally {
      releaseCurrentLock();

      if (this.habitMutationLocks.get(key) === lockChain) {
        this.habitMutationLocks.delete(key);
      }
    }
  }
}

export const habitService = new HabitService();
