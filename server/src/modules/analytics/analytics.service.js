import {
  addUtcDays,
  calculateCurrentStreak,
  calculateLongestStreak,
  startOfUtcDay,
  toUtcDateKey,
} from '../../domain/habits/habitStats.js';
import {
  calculateCompletionRate,
  calculateProductivityScore,
} from '../../domain/analytics/scoring.js';
import { HabitCheckIn } from '../habits/habitCheckIn.model.js';
import { Habit } from '../habits/habit.model.js';
import { Task } from '../tasks/task.model.js';

const WEEK_LENGTH_DAYS = 7;

function getDayLabel(date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function groupTasksByDate(tasks) {
  return tasks.reduce((grouped, task) => {
    const dateKey = toUtcDateKey(task.dueDate);
    const dayTasks = grouped.get(dateKey) || [];

    dayTasks.push(task);
    grouped.set(dateKey, dayTasks);

    return grouped;
  }, new Map());
}

function groupCompletedHabitIdsByDate(checkIns) {
  return checkIns.reduce((grouped, checkIn) => {
    const dateKey = toUtcDateKey(checkIn.date);
    const habitIds = grouped.get(dateKey) || new Set();

    habitIds.add(checkIn.habitId.toString());
    grouped.set(dateKey, habitIds);

    return grouped;
  }, new Map());
}

function groupCheckInDatesByHabitId(checkIns) {
  return checkIns.reduce((grouped, checkIn) => {
    const habitId = checkIn.habitId.toString();
    const dates = grouped.get(habitId) || [];

    dates.push(checkIn.date);
    grouped.set(habitId, dates);

    return grouped;
  }, new Map());
}

function calculateMissedDaysInARow(checkInDates, createdAt, today) {
  const completedDays = new Set(checkInDates.map(toUtcDateKey));
  const createdDay = startOfUtcDay(createdAt || today);
  let cursor = startOfUtcDay(today);
  let missedDays = 0;

  while (cursor >= createdDay && !completedDays.has(toUtcDateKey(cursor))) {
    missedDays += 1;
    cursor = addUtcDays(cursor, -1);
  }

  return missedDays;
}

export class AnalyticsService {
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

  async getWeeklyAnalytics(userId) {
    const todayStart = startOfUtcDay(this.clock());
    const rangeStart = addUtcDays(todayStart, -(WEEK_LENGTH_DAYS - 1));
    const previousRangeStart = addUtcDays(rangeStart, -WEEK_LENGTH_DAYS);
    const rangeEnd = addUtcDays(todayStart, 1);
    const [tasks, habits] = await Promise.all([
      this.TaskModel.find({
        userId,
        dueDate: {
          $gte: previousRangeStart,
          $lt: rangeEnd,
        },
      })
        .select('dueDate status')
        .lean(),
      this.HabitModel.find({ userId }).select('_id name createdAt').lean(),
    ]);
    const habitIds = habits.map((habit) => habit._id);
    const checkIns =
      habitIds.length > 0
        ? await this.HabitCheckInModel.find({
            userId,
            habitId: { $in: habitIds },
            date: {
              $gte: previousRangeStart,
              $lt: rangeEnd,
            },
          })
            .select('habitId date')
            .lean()
        : [];
    const allCheckIns =
      habitIds.length > 0
        ? await this.HabitCheckInModel.find({
            userId,
            habitId: { $in: habitIds },
          })
            .select('habitId date')
            .lean()
        : [];

    return {
      previousDays: this.buildWeeklyDays({
        rangeStart: previousRangeStart,
        tasks,
        habitTotal: habitIds.length,
        checkIns,
      }),
      days: this.buildWeeklyDays({
        rangeStart,
        tasks,
        habitTotal: habitIds.length,
        checkIns,
      }),
      habitInsights: this.buildHabitInsights({ habits, checkIns: allCheckIns, today: todayStart }),
    };
  }

  buildWeeklyDays({ rangeStart, tasks, habitTotal, checkIns }) {
    const tasksByDate = groupTasksByDate(tasks);
    const habitIdsByDate = groupCompletedHabitIdsByDate(checkIns);

    return Array.from({ length: WEEK_LENGTH_DAYS }, (_, index) => {
      const dayStart = addUtcDays(rangeStart, index);
      const date = toUtcDateKey(dayStart);
      const dayTasks = tasksByDate.get(date) || [];
      const taskTotal = dayTasks.length;
      const taskCompleted = dayTasks.filter((task) => task.status === 'Completed').length;
      const completedHabitIds = habitIdsByDate.get(date) || new Set();
      const habitCompleted = completedHabitIds.size;
      const taskCompletionRate = calculateCompletionRate(taskCompleted, taskTotal);
      const habitCompletionRate = calculateCompletionRate(habitCompleted, habitTotal);

      return {
        date,
        label: getDayLabel(dayStart),
        taskCompleted,
        taskTotal,
        habitCompleted,
        habitTotal,
        taskCompletionRate,
        habitCompletionRate,
        productivityScore: calculateProductivityScore({
          taskCompletionRate,
          taskTotal,
          habitCompletionRate,
          habitTotal,
        }),
      };
    });
  }

  buildHabitInsights({ habits, checkIns, today }) {
    const checkInsByHabitId = groupCheckInDatesByHabitId(checkIns);

    return habits.map((habit) => {
      const habitId = habit._id.toString();
      const dates = checkInsByHabitId.get(habitId) || [];

      return {
        _id: habitId,
        name: habit.name,
        currentStreak: calculateCurrentStreak(dates, today),
        longestStreak: calculateLongestStreak(dates),
        missedDaysInARow: calculateMissedDaysInARow(dates, habit.createdAt, today),
      };
    });
  }
}

export const analyticsService = new AnalyticsService();
