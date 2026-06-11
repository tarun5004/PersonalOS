import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { AuthError, ConflictError, NotFoundError } from '../../errors/AppError.js';
import { errorHandler } from '../../middleware/error.middleware.js';
import { HabitController } from './habit.controller.js';
import { createHabitRoutes } from './habit.routes.js';

const user = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Habit User',
  email: 'habit@example.com',
};

const habitId = '507f1f77bcf86cd799439021';
const habit = {
  _id: habitId,
  name: 'Read',
  todayCompleted: false,
  currentStreak: 0,
  longestStreak: 2,
  completionPercentage: 6.67,
  completedDates: ['2026-06-11', '2026-06-12'],
  month: {
    key: '2026-06',
    totalDays: 30,
  },
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

const pagination = {
  limit: 50,
  offset: 0,
  total: 1,
};

const checkIn = {
  _id: '507f1f77bcf86cd799439031',
  habitId,
  date: '2026-06-12T00:00:00.000Z',
  month: '2026-06',
  createdAt: '2026-06-12T10:30:00.000Z',
  updatedAt: '2026-06-12T10:30:00.000Z',
};

function authenticated(request, response, next) {
  request.user = user;
  next();
}

function createApp({ service, requireAuthMiddleware = authenticated } = {}) {
  const app = express();
  const controller = new HabitController(service);

  app.use(express.json());
  app.use(
    '/api/habits',
    createHabitRoutes({
      controller,
      requireAuthMiddleware,
    }),
  );
  app.use(errorHandler);

  return app;
}

describe('habit routes', () => {
  test('creates a habit for the authenticated user', async () => {
    const createHabit = jest.fn().mockResolvedValue(habit);
    const app = createApp({
      service: {
        createHabit,
      },
    });

    const response = await request(app).post('/api/habits').send({
      name: 'Read',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: { habit },
    });
    expect(createHabit).toHaveBeenCalledWith(user._id, { name: 'Read' });
  });

  test('lists habits with an optional selected month', async () => {
    const listHabits = jest.fn().mockResolvedValue({
      habits: [habit],
      month: {
        key: '2026-06',
        totalDays: 30,
      },
      pagination,
    });
    const app = createApp({
      service: {
        listHabits,
      },
    });

    const response = await request(app).get('/api/habits?month=2026-06');

    expect(response.status).toBe(200);
    expect(response.body.data.habits).toHaveLength(1);
    expect(response.body.data.month).toEqual({ key: '2026-06', totalDays: 30 });
    expect(response.body.data.pagination).toEqual(pagination);
    expect(listHabits).toHaveBeenCalledWith(user._id, {
      month: '2026-06',
      limit: 50,
      offset: 0,
    });
  });

  test('passes validated pagination to the service', async () => {
    const listHabits = jest.fn().mockResolvedValue({
      habits: [habit],
      month: {
        key: '2026-06',
        totalDays: 30,
      },
      pagination: {
        limit: 10,
        offset: 20,
        total: 42,
      },
    });
    const app = createApp({
      service: {
        listHabits,
      },
    });

    const response = await request(app).get('/api/habits?month=2026-06&limit=10&offset=20');

    expect(response.status).toBe(200);
    expect(response.body.data.pagination).toEqual({
      limit: 10,
      offset: 20,
      total: 42,
    });
    expect(listHabits).toHaveBeenCalledWith(user._id, {
      month: '2026-06',
      limit: 10,
      offset: 20,
    });
  });

  test('lists an empty habit collection', async () => {
    const listHabits = jest.fn().mockResolvedValue({
      habits: [],
      month: {
        key: '2026-06',
        totalDays: 30,
      },
      pagination: {
        limit: 50,
        offset: 0,
        total: 0,
      },
    });
    const app = createApp({
      service: {
        listHabits,
      },
    });

    const response = await request(app).get('/api/habits?month=2026-06');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      habits: [],
      month: {
        key: '2026-06',
        totalDays: 30,
      },
      pagination: {
        limit: 50,
        offset: 0,
        total: 0,
      },
    });
  });


  test('gets a habit by id', async () => {
    const getHabitById = jest.fn().mockResolvedValue(habit);
    const app = createApp({
      service: {
        getHabitById,
      },
    });

    const response = await request(app).get(`/api/habits/${habitId}?month=2026-06`);

    expect(response.status).toBe(200);
    expect(response.body.data.habit).toEqual(habit);
    expect(getHabitById).toHaveBeenCalledWith(user._id, habitId, { month: '2026-06' });
  });

  test('updates a habit', async () => {
    const updatedHabit = { ...habit, name: 'Journal' };
    const updateHabit = jest.fn().mockResolvedValue(updatedHabit);
    const app = createApp({
      service: {
        updateHabit,
      },
    });

    const response = await request(app).patch(`/api/habits/${habitId}`).send({
      name: 'Journal',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.habit).toEqual(updatedHabit);
    expect(updateHabit).toHaveBeenCalledWith(user._id, habitId, { name: 'Journal' }, {});
  });

  test('deletes a habit', async () => {
    const deleteHabit = jest.fn().mockResolvedValue(undefined);
    const app = createApp({
      service: {
        deleteHabit,
      },
    });

    const response = await request(app).delete(`/api/habits/${habitId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Habit deleted successfully',
    });
    expect(deleteHabit).toHaveBeenCalledWith(user._id, habitId);
  });

  test('checks in a habit for the current UTC day', async () => {
    const checkInHabit = jest.fn().mockResolvedValue({
      checkIn,
      habit: {
        ...habit,
        todayCompleted: true,
        currentStreak: 2,
      },
    });
    const app = createApp({
      service: {
        checkInHabit,
      },
    });

    const response = await request(app).post(`/api/habits/${habitId}/check-in`);

    expect(response.status).toBe(201);
    expect(response.body.data.checkIn).toEqual(checkIn);
    expect(response.body.data.habit.todayCompleted).toBe(true);
    expect(checkInHabit).toHaveBeenCalledWith(user._id, habitId);
  });

  test('rejects unauthenticated requests', async () => {
    const createHabit = jest.fn();
    const app = createApp({
      service: {
        createHabit,
      },
      requireAuthMiddleware: (request, response, next) => {
        next(new AuthError('Authentication required'));
      },
    });

    const response = await request(app).post('/api/habits').send({
      name: 'Read',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
    expect(createHabit).not.toHaveBeenCalled();
  });

  test('returns 404 for habits outside the authenticated owner scope', async () => {
    const getHabitById = jest.fn().mockRejectedValue(new NotFoundError('Habit not found'));
    const app = createApp({
      service: {
        getHabitById,
      },
    });

    const response = await request(app).get(`/api/habits/${habitId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Habit not found');
  });

  test('returns 404 when updating a habit outside the authenticated owner scope', async () => {
    const updateHabit = jest.fn().mockRejectedValue(new NotFoundError('Habit not found'));
    const app = createApp({
      service: {
        updateHabit,
      },
    });

    const response = await request(app).patch(`/api/habits/${habitId}`).send({
      name: 'Journal',
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Habit not found');
  });

  test('returns 404 when deleting a habit outside the authenticated owner scope', async () => {
    const deleteHabit = jest.fn().mockRejectedValue(new NotFoundError('Habit not found'));
    const app = createApp({
      service: {
        deleteHabit,
      },
    });

    const response = await request(app).delete(`/api/habits/${habitId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Habit not found');
  });

  test('returns 404 when checking in a habit outside the authenticated owner scope', async () => {
    const checkInHabit = jest.fn().mockRejectedValue(new NotFoundError('Habit not found'));
    const app = createApp({
      service: {
        checkInHabit,
      },
    });

    const response = await request(app).post(`/api/habits/${habitId}/check-in`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Habit not found');
  });

  test('returns 409 for duplicate daily check-ins', async () => {
    const checkInHabit = jest
      .fn()
      .mockRejectedValue(new ConflictError('Habit already checked in for today'));
    const app = createApp({
      service: {
        checkInHabit,
      },
    });

    const response = await request(app).post(`/api/habits/${habitId}/check-in`);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Habit already checked in for today');
  });

  test('rejects invalid create payloads', async () => {
    const createHabit = jest.fn();
    const app = createApp({
      service: {
        createHabit,
      },
    });

    const response = await request(app).post('/api/habits').send({
      name: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(createHabit).not.toHaveBeenCalled();
  });

  test('rejects oversized habit names on create', async () => {
    const createHabit = jest.fn();
    const app = createApp({
      service: {
        createHabit,
      },
    });

    const response = await request(app).post('/api/habits').send({
      name: 'a'.repeat(121),
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(createHabit).not.toHaveBeenCalled();
  });

  test('rejects invalid update payloads', async () => {
    const updateHabit = jest.fn();
    const app = createApp({
      service: {
        updateHabit,
      },
    });

    const response = await request(app).patch(`/api/habits/${habitId}`).send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(updateHabit).not.toHaveBeenCalled();
  });

  test('rejects oversized habit names on update', async () => {
    const updateHabit = jest.fn();
    const app = createApp({
      service: {
        updateHabit,
      },
    });

    const response = await request(app).patch(`/api/habits/${habitId}`).send({
      name: 'a'.repeat(121),
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(updateHabit).not.toHaveBeenCalled();
  });

  test('rejects invalid month params', async () => {
    const listHabits = jest.fn();
    const app = createApp({
      service: {
        listHabits,
      },
    });

    const response = await request(app).get('/api/habits?month=2026-13');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(listHabits).not.toHaveBeenCalled();
  });

  test('rejects unsupported month years', async () => {
    const listHabits = jest.fn();
    const app = createApp({
      service: {
        listHabits,
      },
    });

    const response = await request(app).get('/api/habits?month=0000-01');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(listHabits).not.toHaveBeenCalled();
  });

  test('rejects invalid pagination params', async () => {
    const listHabits = jest.fn();
    const app = createApp({
      service: {
        listHabits,
      },
    });

    const response = await request(app).get('/api/habits?limit=101&offset=-1');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(listHabits).not.toHaveBeenCalled();
  });

  test('rejects invalid habit ids', async () => {
    const getHabitById = jest.fn();
    const app = createApp({
      service: {
        getHabitById,
      },
    });

    const response = await request(app).get('/api/habits/not-a-valid-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(getHabitById).not.toHaveBeenCalled();
  });

  test('rejects unsupported check-in request bodies', async () => {
    const checkInHabit = jest.fn();
    const app = createApp({
      service: {
        checkInHabit,
      },
    });

    const response = await request(app).post(`/api/habits/${habitId}/check-in`).send({
      date: '2026-06-12',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(checkInHabit).not.toHaveBeenCalled();
  });

  test('rejects explicit empty check-in bodies', async () => {
    const checkInHabit = jest.fn();
    const app = createApp({
      service: {
        checkInHabit,
      },
    });

    const response = await request(app).post(`/api/habits/${habitId}/check-in`).send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(checkInHabit).not.toHaveBeenCalled();
  });
});
