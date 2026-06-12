import { jest } from '@jest/globals';
import { calculateProductivityScore } from '../../domain/analytics/scoring.js';
import { DashboardService } from './dashboard.service.js';

const userId = '507f1f77bcf86cd799439011';
const otherUserId = '507f1f77bcf86cd799439099';
const today = new Date('2026-06-12T14:30:00.000Z');
const todayStart = new Date('2026-06-12T00:00:00.000Z');
const tomorrowStart = new Date('2026-06-13T00:00:00.000Z');

function createLeanQuery(result) {
  return {
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  };
}

function toId(value) {
  return value.toString();
}

function matchesDateRange(value, range) {
  if (!range) {
    return true;
  }

  return value >= range.$gte && value < range.$lt;
}

function matchesTaskFilter(task, filter) {
  return (
    toId(task.userId) === toId(filter.userId) &&
    matchesDateRange(task.dueDate, filter.dueDate) &&
    (!filter.status || task.status === filter.status)
  );
}

function matchesCheckInFilter(checkIn, filter) {
  const allowedHabitIds = new Set((filter.habitId?.$in || []).map(toId));

  return (
    toId(checkIn.userId) === toId(filter.userId) &&
    allowedHabitIds.has(toId(checkIn.habitId)) &&
    matchesDateRange(checkIn.date, filter.date)
  );
}

function createService({
  tasks,
  taskTotal = 0,
  taskCompleted = 0,
  habits = [],
  checkIns = [],
} = {}) {
  const TaskModel = {
    countDocuments: jest.fn((filter) => {
      if (tasks) {
        return Promise.resolve(tasks.filter((task) => matchesTaskFilter(task, filter)).length);
      }

      if (filter.status === 'Completed') {
        return Promise.resolve(taskCompleted);
      }

      return Promise.resolve(taskTotal);
    }),
  };
  const HabitModel = {
    find: jest.fn().mockReturnValue(createLeanQuery(habits)),
  };
  const HabitCheckInModel = {
    find: jest.fn((filter) =>
      createLeanQuery(checkIns.filter((checkIn) => matchesCheckInFilter(checkIn, filter))),
    ),
  };
  const service = new DashboardService({
    TaskModel,
    HabitModel,
    HabitCheckInModel,
    clock: () => today,
  });

  return {
    service,
    TaskModel,
    HabitModel,
    HabitCheckInModel,
  };
}

describe('calculateProductivityScore', () => {
  test('returns null when neither tasks nor habits exist', () => {
    expect(
      calculateProductivityScore({
        taskCompletionRate: 0,
        taskTotal: 0,
        habitCompletionRate: 0,
        habitTotal: 0,
      }),
    ).toBeNull();
  });

  test('uses task rate when only tasks exist', () => {
    expect(
      calculateProductivityScore({
        taskCompletionRate: 66.67,
        taskTotal: 3,
        habitCompletionRate: 0,
        habitTotal: 0,
      }),
    ).toBe(66.67);
  });

  test('uses habit rate when only habits exist', () => {
    expect(
      calculateProductivityScore({
        taskCompletionRate: 0,
        taskTotal: 0,
        habitCompletionRate: 50,
        habitTotal: 2,
      }),
    ).toBe(50);
  });

  test('uses the weighted average when tasks and habits exist', () => {
    expect(
      calculateProductivityScore({
        taskCompletionRate: 66.67,
        taskTotal: 3,
        habitCompletionRate: 50,
        habitTotal: 2,
      }),
    ).toBe(58.34);
  });
});

describe('DashboardService', () => {
  test('returns an empty today snapshot', async () => {
    const { service, HabitCheckInModel } = createService();

    const result = await service.getSummary(userId);

    expect(result).toEqual({
      date: '2026-06-12',
      tasks: {
        total: 0,
        completed: 0,
        incomplete: 0,
        completionRate: 0,
      },
      habits: {
        total: 0,
        completedToday: 0,
        incompleteToday: 0,
        completionRate: 0,
      },
      productivityScore: null,
      currentStreak: 0,
    });
    expect(HabitCheckInModel.find).not.toHaveBeenCalled();
  });

  test('queries tasks within the current UTC day and excludes other days through the filter', async () => {
    const { service, TaskModel } = createService({
      taskTotal: 3,
      taskCompleted: 1,
    });

    const result = await service.getSummary(userId);

    expect(TaskModel.countDocuments).toHaveBeenNthCalledWith(1, {
      userId,
      dueDate: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    });
    expect(TaskModel.countDocuments).toHaveBeenNthCalledWith(2, {
      userId,
      dueDate: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
      status: 'Completed',
    });
    expect(result.tasks).toEqual({
      total: 3,
      completed: 1,
      incomplete: 2,
      completionRate: 33.33,
    });
    expect(result.productivityScore).toBe(33.33);
  });

  test('counts only boundary-inclusive today tasks in the UTC day window', async () => {
    const { service } = createService({
      tasks: [
        {
          userId,
          dueDate: new Date('2026-06-11T23:59:59.999Z'),
          status: 'Completed',
        },
        {
          userId,
          dueDate: new Date('2026-06-12T00:00:00.000Z'),
          status: 'Completed',
        },
        {
          userId,
          dueDate: new Date('2026-06-12T23:59:59.999Z'),
          status: 'Todo',
        },
        {
          userId,
          dueDate: new Date('2026-06-13T00:00:00.000Z'),
          status: 'Completed',
        },
      ],
    });

    const result = await service.getSummary(userId);

    expect(result.tasks).toEqual({
      total: 2,
      completed: 1,
      incomplete: 1,
      completionRate: 50,
    });
  });

  test('summarizes habits, today check-ins, and max current streak for the authenticated user', async () => {
    const habitOne = { _id: 'habit-1' };
    const habitTwo = { _id: 'habit-2' };
    const { service, HabitModel, HabitCheckInModel } = createService({
      habits: [habitOne, habitTwo],
      checkIns: [
        { userId, habitId: 'habit-1', date: new Date('2026-06-10T00:00:00.000Z') },
        { userId, habitId: 'habit-1', date: new Date('2026-06-11T00:00:00.000Z') },
        { userId, habitId: 'habit-1', date: new Date('2026-06-12T00:00:00.000Z') },
        { userId, habitId: 'habit-2', date: new Date('2026-06-12T00:00:00.000Z') },
      ],
    });

    const result = await service.getSummary(userId);

    expect(HabitModel.find).toHaveBeenCalledWith({ userId });
    expect(HabitCheckInModel.find).toHaveBeenCalledWith({
      userId,
      habitId: {
        $in: ['habit-1', 'habit-2'],
      },
      date: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    });
    expect(result.habits).toEqual({
      total: 2,
      completedToday: 2,
      incompleteToday: 0,
      completionRate: 100,
    });
    expect(result.currentStreak).toBe(3);
    expect(result.productivityScore).toBe(100);
  });

  test('uses mixed task and habit weighted productivity scoring', async () => {
    const { service } = createService({
      taskTotal: 2,
      taskCompleted: 1,
      habits: [{ _id: 'habit-1' }, { _id: 'habit-2' }],
      checkIns: [{ userId, habitId: 'habit-1', date: todayStart }],
    });

    const result = await service.getSummary(userId);

    expect(result.tasks.completionRate).toBe(50);
    expect(result.habits.completionRate).toBe(50);
    expect(result.productivityScore).toBe(50);
  });

  test('deduplicates duplicate same-day check-ins for habit completion', async () => {
    const { service } = createService({
      habits: [{ _id: 'habit-1' }, { _id: 'habit-2' }],
      checkIns: [
        { userId, habitId: 'habit-1', date: todayStart },
        { userId, habitId: 'habit-1', date: new Date('2026-06-12T12:00:00.000Z') },
      ],
    });

    const result = await service.getSummary(userId);

    expect(result.habits).toEqual({
      total: 2,
      completedToday: 1,
      incompleteToday: 1,
      completionRate: 50,
    });
    expect(result.currentStreak).toBe(1);
  });

  test('scopes every query by owner', async () => {
    const { service, TaskModel, HabitModel, HabitCheckInModel } = createService({
      taskTotal: 1,
      taskCompleted: 1,
      habits: [{ _id: 'habit-1' }],
      checkIns: [
        { userId, habitId: 'habit-1', date: todayStart },
        { userId: otherUserId, habitId: 'habit-9', date: todayStart },
      ],
    });

    await service.getSummary(userId);

    expect(TaskModel.countDocuments.mock.calls[0][0].userId).toBe(userId);
    expect(TaskModel.countDocuments.mock.calls[1][0].userId).toBe(userId);
    expect(HabitModel.find).toHaveBeenCalledWith({ userId });
    expect(HabitCheckInModel.find).toHaveBeenCalledWith({
      userId,
      habitId: {
        $in: ['habit-1'],
      },
      date: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    });
  });
});
