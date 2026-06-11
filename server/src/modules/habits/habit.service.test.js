import { jest } from '@jest/globals';
import { ConflictError, NotFoundError } from '../../errors/AppError.js';
import { HabitService } from './habit.service.js';

const userId = '507f1f77bcf86cd799439011';
const habitId = '507f1f77bcf86cd799439021';
const checkInId = '507f1f77bcf86cd799439031';
const now = new Date('2026-06-12T10:30:00.000Z');
const createdAt = new Date('2026-06-01T00:00:00.000Z');
const updatedAt = new Date('2026-06-01T00:00:00.000Z');

function createHabit(overrides = {}) {
  return {
    _id: habitId,
    userId,
    name: 'Read',
    createdAt,
    updatedAt,
    ...overrides,
  };
}

function createCheckIn(overrides = {}) {
  return {
    _id: checkInId,
    userId,
    habitId,
    date: new Date('2026-06-12T00:00:00.000Z'),
    month: '2026-06',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createSortedLeanQuery(result) {
  return {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  };
}

function createLeanQuery(result) {
  return {
    lean: jest.fn().mockResolvedValue(result),
  };
}

function createService({ HabitModel, HabitCheckInModel, clock = () => now }) {
  return new HabitService({
    HabitModel,
    HabitCheckInModel,
    clock,
  });
}

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

describe('HabitService', () => {
  test('createHabit stores the authenticated user id and returns derived safe habit data', async () => {
    const storedHabit = createHabit();
    const HabitModel = {
      create: jest.fn().mockResolvedValue(storedHabit),
    };
    const HabitCheckInModel = {};
    const service = createService({ HabitModel, HabitCheckInModel });

    const result = await service.createHabit(userId, { name: 'Read' });

    expect(HabitModel.create).toHaveBeenCalledWith({
      userId,
      name: 'Read',
    });
    expect(result).toEqual({
      _id: habitId,
      name: 'Read',
      todayCompleted: false,
      currentStreak: 0,
      longestStreak: 0,
      completionPercentage: 0,
      completedDates: [],
      month: {
        key: '2026-06',
        totalDays: 30,
      },
      createdAt,
      updatedAt,
    });
    expect(result.userId).toBeUndefined();
  });

  test('listHabits scopes habit and check-in queries by owner and derives stats', async () => {
    const storedHabit = createHabit();
    const habitQuery = createSortedLeanQuery([storedHabit]);
    const historyCheckInQuery = createSortedLeanQuery([
      createCheckIn({ date: new Date('2026-06-10T00:00:00.000Z') }),
      createCheckIn({ date: new Date('2026-06-11T00:00:00.000Z') }),
      createCheckIn(),
    ]);
    const monthCheckInQuery = createSortedLeanQuery([
      createCheckIn({ date: new Date('2026-06-11T00:00:00.000Z') }),
      createCheckIn(),
    ]);
    const HabitModel = {
      find: jest.fn().mockReturnValue(habitQuery),
      countDocuments: jest.fn().mockResolvedValue(1),
    };
    const HabitCheckInModel = {
      find: jest.fn().mockReturnValueOnce(historyCheckInQuery).mockReturnValueOnce(monthCheckInQuery),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    const result = await service.listHabits(userId, { month: '2026-06', limit: 10, offset: 5 });

    expect(HabitModel.find).toHaveBeenCalledWith({ userId });
    expect(HabitModel.countDocuments).toHaveBeenCalledWith({ userId });
    expect(habitQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(habitQuery.skip).toHaveBeenCalledWith(5);
    expect(habitQuery.limit).toHaveBeenCalledWith(10);
    expect(HabitCheckInModel.find).toHaveBeenNthCalledWith(1, {
      userId,
      habitId: { $in: [habitId] },
    });
    expect(HabitCheckInModel.find).toHaveBeenNthCalledWith(2, {
      userId,
      month: '2026-06',
      habitId: { $in: [habitId] },
    });
    expect(historyCheckInQuery.sort).toHaveBeenCalledWith({ date: 1 });
    expect(monthCheckInQuery.sort).toHaveBeenCalledWith({ date: 1 });
    expect(result.month).toEqual({ key: '2026-06', totalDays: 30 });
    expect(result.pagination).toEqual({
      limit: 10,
      offset: 5,
      total: 1,
    });
    expect(result.habits[0]).toEqual(
      expect.objectContaining({
        _id: habitId,
        name: 'Read',
        todayCompleted: true,
        currentStreak: 3,
        longestStreak: 3,
        completionPercentage: 6.67,
        completedDates: ['2026-06-11', '2026-06-12'],
      }),
    );
  });

  test('getHabitById includes owner in the lookup filter', async () => {
    const historyCheckInQuery = createSortedLeanQuery([createCheckIn()]);
    const monthCheckInQuery = createSortedLeanQuery([createCheckIn()]);
    const HabitModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(createHabit())),
    };
    const HabitCheckInModel = {
      find: jest.fn().mockReturnValueOnce(historyCheckInQuery).mockReturnValueOnce(monthCheckInQuery),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    const result = await service.getHabitById(userId, habitId, { month: '2026-06' });

    expect(HabitModel.findOne).toHaveBeenCalledWith({ _id: habitId, userId });
    expect(HabitCheckInModel.find).toHaveBeenNthCalledWith(1, { userId, habitId });
    expect(HabitCheckInModel.find).toHaveBeenNthCalledWith(2, {
      userId,
      habitId,
      month: '2026-06',
    });
    expect(result._id).toBe(habitId);
    expect(result.userId).toBeUndefined();
  });

  test('getHabitById returns 404 when the habit is outside the owner scope', async () => {
    const HabitModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(null)),
    };
    const service = createService({ HabitModel, HabitCheckInModel: {} });

    await expect(service.getHabitById(userId, habitId)).rejects.toBeInstanceOf(NotFoundError);
    expect(HabitModel.findOne).toHaveBeenCalledWith({ _id: habitId, userId });
  });

  test('updateHabit includes owner in the update filter', async () => {
    const HabitModel = {
      findOneAndUpdate: jest.fn().mockReturnValue(createLeanQuery(createHabit({ name: 'Journal' }))),
    };
    const HabitCheckInModel = {
      find: jest.fn()
        .mockReturnValueOnce(createSortedLeanQuery([]))
        .mockReturnValueOnce(createSortedLeanQuery([])),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    const result = await service.updateHabit(userId, habitId, { name: 'Journal' });

    expect(HabitModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: habitId, userId },
      { $set: { name: 'Journal' } },
      { new: true, runValidators: true },
    );
    expect(result.name).toBe('Journal');
  });

  test('deleteHabit includes owner in the delete filter and cascades check-ins', async () => {
    const HabitModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(createHabit())),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };
    const HabitCheckInModel = {
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 2 }),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    await service.deleteHabit(userId, habitId);

    expect(HabitModel.findOne).toHaveBeenCalledWith({ _id: habitId, userId });
    expect(HabitCheckInModel.deleteMany).toHaveBeenCalledWith({ userId, habitId });
    expect(HabitModel.deleteOne).toHaveBeenCalledWith({ _id: habitId, userId });
  });

  test('deleteHabit returns 404 before deleting check-ins when ownership fails', async () => {
    const HabitModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(null)),
      deleteOne: jest.fn(),
    };
    const HabitCheckInModel = {
      deleteMany: jest.fn(),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    await expect(service.deleteHabit(userId, habitId)).rejects.toBeInstanceOf(NotFoundError);
    expect(HabitCheckInModel.deleteMany).not.toHaveBeenCalled();
    expect(HabitModel.deleteOne).not.toHaveBeenCalled();
  });

  test('deleteHabit does not remove the habit when check-in cascade fails', async () => {
    const HabitModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(createHabit())),
      deleteOne: jest.fn(),
    };
    const HabitCheckInModel = {
      deleteMany: jest.fn().mockRejectedValue(new Error('cascade failed')),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    await expect(service.deleteHabit(userId, habitId)).rejects.toThrow('cascade failed');
    expect(HabitModel.deleteOne).not.toHaveBeenCalled();
  });

  test('deleteHabit blocks a concurrent check-in for the same habit until deletion finishes', async () => {
    const cascade = createDeferred();
    const HabitModel = {
      findOne: jest
        .fn()
        .mockReturnValueOnce(createLeanQuery(createHabit()))
        .mockReturnValueOnce(createLeanQuery(null)),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };
    const HabitCheckInModel = {
      deleteMany: jest.fn().mockReturnValue(cascade.promise),
      create: jest.fn(),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    const deletePromise = service.deleteHabit(userId, habitId);
    await Promise.resolve();
    const checkInPromise = service.checkInHabit(userId, habitId);
    await Promise.resolve();

    expect(HabitCheckInModel.create).not.toHaveBeenCalled();

    cascade.resolve({ deletedCount: 2 });

    await deletePromise;
    await expect(checkInPromise).rejects.toBeInstanceOf(NotFoundError);
    expect(HabitCheckInModel.create).not.toHaveBeenCalled();
  });

  test('checkInHabit creates one normalized UTC check-in for the authenticated owner', async () => {
    const historyCheckInQuery = createSortedLeanQuery([
      createCheckIn({ date: new Date('2026-06-11T00:00:00.000Z') }),
      createCheckIn(),
    ]);
    const monthCheckInQuery = createSortedLeanQuery([
      createCheckIn({ date: new Date('2026-06-11T00:00:00.000Z') }),
      createCheckIn(),
    ]);
    const HabitModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(createHabit())),
    };
    const HabitCheckInModel = {
      create: jest.fn().mockResolvedValue(createCheckIn()),
      find: jest.fn().mockReturnValueOnce(historyCheckInQuery).mockReturnValueOnce(monthCheckInQuery),
    };
    const clock = jest.fn().mockReturnValueOnce(now).mockReturnValueOnce(new Date('2026-06-13T00:00:00.000Z'));
    const service = createService({ HabitModel, HabitCheckInModel, clock });

    const result = await service.checkInHabit(userId, habitId);

    expect(HabitModel.findOne).toHaveBeenCalledWith({ _id: habitId, userId });
    expect(HabitModel.findOne).toHaveBeenCalledTimes(2);
    expect(HabitCheckInModel.create).toHaveBeenCalledWith({
      userId,
      habitId,
      date: new Date('2026-06-12T00:00:00.000Z'),
      month: '2026-06',
    });
    expect(clock).toHaveBeenCalledTimes(1);
    expect(HabitCheckInModel.find).toHaveBeenNthCalledWith(1, { userId, habitId });
    expect(HabitCheckInModel.find).toHaveBeenNthCalledWith(2, {
      userId,
      habitId,
      month: '2026-06',
    });
    expect(result.checkIn).toEqual({
      _id: checkInId,
      habitId,
      date: new Date('2026-06-12T00:00:00.000Z'),
      month: '2026-06',
      createdAt: now,
      updatedAt: now,
    });
    expect(result.checkIn.userId).toBeUndefined();
    expect(result.habit.currentStreak).toBe(2);
  });

  test('checkInHabit cleans up a just-created check-in if the habit disappears before revalidation', async () => {
    const HabitModel = {
      findOne: jest
        .fn()
        .mockReturnValueOnce(createLeanQuery(createHabit()))
        .mockReturnValueOnce(createLeanQuery(null)),
    };
    const HabitCheckInModel = {
      create: jest.fn().mockResolvedValue(createCheckIn()),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    await expect(service.checkInHabit(userId, habitId)).rejects.toBeInstanceOf(NotFoundError);
    expect(HabitCheckInModel.deleteOne).toHaveBeenCalledWith({
      _id: checkInId,
      userId,
      habitId,
    });
  });

  test('checkInHabit returns 404 when another user owns the habit', async () => {
    const HabitModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(null)),
    };
    const HabitCheckInModel = {
      create: jest.fn(),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    await expect(service.checkInHabit(userId, habitId)).rejects.toBeInstanceOf(NotFoundError);
    expect(HabitCheckInModel.create).not.toHaveBeenCalled();
  });

  test('checkInHabit converts duplicate key errors to a 409 conflict', async () => {
    const duplicateError = new Error('duplicate key');
    duplicateError.code = 11000;
    const HabitModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(createHabit())),
    };
    const HabitCheckInModel = {
      create: jest.fn().mockRejectedValue(duplicateError),
    };
    const service = createService({ HabitModel, HabitCheckInModel });

    await expect(service.checkInHabit(userId, habitId)).rejects.toBeInstanceOf(ConflictError);
  });
});
