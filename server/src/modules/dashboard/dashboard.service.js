import {
  addUtcDays,
  startOfUtcDay,
  toUtcDateKey,
} from '../../domain/habits/habitStats.js';
import { HabitCheckIn } from '../habits/habitCheckIn.model.js';
import { Habit } from '../habits/habit.model.js';
import { Task } from '../tasks/task.model.js';

function roundPercentage(value) {
  return Number(value.toFixed(2));
}

function calculateCompletionRate(completed, total) {
  if (total === 0) {
    return 0;
  }

  return roundPercentage((completed / total) * 100);
}

export function calculateProductivityScore({
  taskCompletionRate,
  taskTotal,
  habitCompletionRate,
  habitTotal,
}) {
  const hasTasks = taskTotal > 0;
  const hasHabits = habitTotal > 0;

  if (!hasTasks && !hasHabits) {
    return null;
  }

  if (hasTasks && !hasHabits) {
    return taskCompletionRate;
  }

  if (!hasTasks && hasHabits) {
    return habitCompletionRate;
  }

  return roundPercentage(taskCompletionRate * 0.5 + habitCompletionRate * 0.5);
}

function getUniqueHabitIdSet(checkIns) {
  return new Set(checkIns.map((checkIn) => checkIn.habitId.toString()));
}

export class DashboardService {
  constructor({
    TaskModel = Task,
    HabitModel = Habit,
    HabitCheckInModel = HabitCheckIn,
    clock = () => new Date(),
  } = {}) {
    this.TaskModel = TaskModel;
    this.HabitModel = HabitModel;
    this.HabitCheckInModel = HabitCheckInModel;
    this.clock = clock;
  }

  async getSummary(userId) {
    const now = this.clock();
    const todayStart = startOfUtcDay(now);
    const tomorrowStart = addUtcDays(todayStart, 1);
    const todayTaskFilter = {
      userId,
      dueDate: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    };
    const habits = await this.HabitModel.find({ userId }).select('_id').lean();
    const habitIds = habits.map((habit) => habit._id);

    const [taskTotal, taskCompleted, todayCheckIns] = await Promise.all([
      this.TaskModel.countDocuments(todayTaskFilter),
      this.TaskModel.countDocuments({
        ...todayTaskFilter,
        status: 'Completed',
      }),
      habitIds.length > 0
        ? this.HabitCheckInModel.find({
            userId,
            habitId: { $in: habitIds },
            date: {
              $gte: todayStart,
              $lt: tomorrowStart,
            },
          })
            .select('habitId')
            .lean()
        : [],
    ]);

    const habitTotal = habitIds.length;
    const todayKey = toUtcDateKey(todayStart);
    const completedHabitIds = getUniqueHabitIdSet(todayCheckIns);
    const taskCompletionRate = calculateCompletionRate(taskCompleted, taskTotal);
    const habitCompletedToday = completedHabitIds.size;
    const habitCompletionRate = calculateCompletionRate(habitCompletedToday, habitTotal);
    const currentStreak = await this.calculateMaxCurrentStreak(
      userId,
      [...completedHabitIds],
      todayStart,
    );

    return {
      date: todayKey,
      tasks: {
        total: taskTotal,
        completed: taskCompleted,
        incomplete: Math.max(taskTotal - taskCompleted, 0),
        completionRate: taskCompletionRate,
      },
      habits: {
        total: habitTotal,
        completedToday: habitCompletedToday,
        incompleteToday: Math.max(habitTotal - habitCompletedToday, 0),
        completionRate: habitCompletionRate,
      },
      productivityScore: calculateProductivityScore({
        taskCompletionRate,
        taskTotal,
        habitCompletionRate,
        habitTotal,
      }),
      currentStreak,
    };
  }

  async calculateMaxCurrentStreak(userId, todayCompletedHabitIds, todayStart) {
    let activeHabitIds = todayCompletedHabitIds;
    let currentStreak = activeHabitIds.length > 0 ? 1 : 0;
    let dayStart = addUtcDays(todayStart, -1);

    while (activeHabitIds.length > 0) {
      const nextDayStart = addUtcDays(dayStart, 1);
      const checkIns = await this.HabitCheckInModel.find({
        userId,
        habitId: { $in: activeHabitIds },
        date: {
          $gte: dayStart,
          $lt: nextDayStart,
        },
      })
        .select('habitId')
        .lean();
      const completedHabitIds = getUniqueHabitIdSet(checkIns);

      if (completedHabitIds.size === 0) {
        break;
      }

      currentStreak += 1;
      activeHabitIds = activeHabitIds.filter((habitId) => completedHabitIds.has(habitId));
      dayStart = addUtcDays(dayStart, -1);
    }

    return currentStreak;
  }
}

export const dashboardService = new DashboardService();
