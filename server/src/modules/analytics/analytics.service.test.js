import { jest } from '@jest/globals';
import { AnalyticsService } from './analytics.service.js';

const userId = '507f1f77bcf86cd799439011';
const otherUserId = '507f1f77bcf86cd799439099';
const today = new Date('2026-06-12T14:30:00.000Z');
const rangeStart = new Date('2026-06-06T00:00:00.000Z');
const rangeEnd = new Date('2026-06-13T00:00:00.000Z');

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
  return value >= range.$gte && value < range.$lt;
}

function matchesTaskFilter(task, filter) {
  return (
    toId(task.userId) === toId(filter.userId) &&
    matchesDateRange(task.dueDate, filter.dueDate)
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

function createService({ tasks = [], habits = [], checkIns = [] } = {}) {
  const TaskModel = {
    find: jest.fn((filter) =>
      createLeanQuery(tasks.filter((task) => matchesTaskFilter(task, filter))),
    ),
  };
  const HabitModel = {
    find: jest.fn().mockReturnValue(createLeanQuery(habits)),
  };
  const HabitCheckInModel = {
    find: jest.fn((filter) =>
      createLeanQuery(checkIns.filter((checkIn) => matchesCheckInFilter(checkIn, filter))),
    ),
  };
  const service = new AnalyticsService({
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

describe('AnalyticsService', () => {
  test('returns exactly 7 UTC days including today in oldest-to-newest order', async () => {
    const { service, TaskModel, HabitModel, HabitCheckInModel } = createService();

    const result = await service.getWeeklyAnalytics(userId);

    expect(result.days).toHaveLength(7);
    expect(result.days.map((day) => day.date)).toEqual([
      '2026-06-06',
      '2026-06-07',
      '2026-06-08',
      '2026-06-09',
      '2026-06-10',
      '2026-06-11',
      '2026-06-12',
    ]);
    expect(TaskModel.find).toHaveBeenCalledWith({
      userId,
      dueDate: {
        $gte: rangeStart,
        $lt: rangeEnd,
      },
    });
    expect(HabitModel.find).toHaveBeenCalledWith({ userId });
    expect(HabitCheckInModel.find).not.toHaveBeenCalled();
  });

  test('returns null scores for days with no tasks and no habits', async () => {
    const { service } = createService();

    const result = await service.getWeeklyAnalytics(userId);

    expect(result.days.every((day) => day.productivityScore === null)).toBe(true);
    expect(result.days.every((day) => day.taskCompletionRate === 0)).toBe(true);
    expect(result.days.every((day) => day.habitCompletionRate === 0)).toBe(true);
  });

  test('calculates tasks-only scoring and UTC boundary inclusion', async () => {
    const { service } = createService({
      tasks: [
        {
          userId,
          dueDate: new Date('2026-06-05T23:59:59.999Z'),
          status: 'Completed',
        },
        {
          userId,
          dueDate: new Date('2026-06-06T00:00:00.000Z'),
          status: 'Completed',
        },
        {
          userId,
          dueDate: new Date('2026-06-06T23:59:59.999Z'),
          status: 'Todo',
        },
        {
          userId,
          dueDate: new Date('2026-06-13T00:00:00.000Z'),
          status: 'Completed',
        },
      ],
    });

    const result = await service.getWeeklyAnalytics(userId);
    const firstDay = result.days[0];

    expect(firstDay.date).toBe('2026-06-06');
    expect(firstDay.taskCompletionRate).toBe(50);
    expect(firstDay.habitCompletionRate).toBe(0);
    expect(firstDay.productivityScore).toBe(50);
  });

  test('calculates habits-only scoring with same-day dedupe', async () => {
    const { service } = createService({
      habits: [{ _id: 'habit-1' }, { _id: 'habit-2' }],
      checkIns: [
        { userId, habitId: 'habit-1', date: new Date('2026-06-12T00:00:00.000Z') },
        { userId, habitId: 'habit-1', date: new Date('2026-06-12T10:00:00.000Z') },
      ],
    });

    const result = await service.getWeeklyAnalytics(userId);
    const todayResult = result.days.at(-1);

    expect(todayResult.habitCompletionRate).toBe(50);
    expect(todayResult.taskCompletionRate).toBe(0);
    expect(todayResult.productivityScore).toBe(50);
  });

  test('calculates mixed weighted scoring', async () => {
    const { service } = createService({
      tasks: [
        {
          userId,
          dueDate: new Date('2026-06-12T00:00:00.000Z'),
          status: 'Completed',
        },
        {
          userId,
          dueDate: new Date('2026-06-12T01:00:00.000Z'),
          status: 'Todo',
        },
      ],
      habits: [{ _id: 'habit-1' }, { _id: 'habit-2' }],
      checkIns: [{ userId, habitId: 'habit-1', date: new Date('2026-06-12T00:00:00.000Z') }],
    });

    const result = await service.getWeeklyAnalytics(userId);
    const todayResult = result.days.at(-1);

    expect(todayResult.taskCompletionRate).toBe(50);
    expect(todayResult.habitCompletionRate).toBe(50);
    expect(todayResult.productivityScore).toBe(50);
  });

  test('scopes tasks, habits, and check-ins by owner', async () => {
    const { service, TaskModel, HabitModel, HabitCheckInModel } = createService({
      tasks: [
        {
          userId,
          dueDate: new Date('2026-06-12T00:00:00.000Z'),
          status: 'Completed',
        },
        {
          userId: otherUserId,
          dueDate: new Date('2026-06-12T00:00:00.000Z'),
          status: 'Completed',
        },
      ],
      habits: [{ _id: 'habit-1' }],
      checkIns: [
        { userId, habitId: 'habit-1', date: new Date('2026-06-12T00:00:00.000Z') },
        { userId: otherUserId, habitId: 'habit-9', date: new Date('2026-06-12T00:00:00.000Z') },
      ],
    });

    const result = await service.getWeeklyAnalytics(userId);

    expect(TaskModel.find.mock.calls[0][0].userId).toBe(userId);
    expect(HabitModel.find).toHaveBeenCalledWith({ userId });
    expect(HabitCheckInModel.find).toHaveBeenCalledWith({
      userId,
      habitId: {
        $in: ['habit-1'],
      },
      date: {
        $gte: rangeStart,
        $lt: rangeEnd,
      },
    });
    expect(result.days.at(-1).productivityScore).toBe(100);
  });
});
