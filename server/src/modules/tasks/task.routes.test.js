import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { AuthError, NotFoundError } from '../../errors/AppError.js';
import { errorHandler } from '../../middleware/error.middleware.js';
import { TaskController } from './task.controller.js';
import { createTaskRoutes } from './task.routes.js';

const user = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Task User',
  email: 'task@example.com',
};

const taskId = '507f1f77bcf86cd799439012';
const task = {
  _id: taskId,
  title: 'Write task backend',
  description: 'Implement Phase 8',
  priority: 'High',
  dueDate: '2026-06-12T00:00:00.000Z',
  status: 'Todo',
  createdAt: '2026-06-12T01:00:00.000Z',
  updatedAt: '2026-06-12T01:00:00.000Z',
};

function authenticated(request, response, next) {
  request.user = user;
  next();
}

function createApp({ service, requireAuthMiddleware = authenticated } = {}) {
  const app = express();
  const controller = new TaskController(service);

  app.use(express.json());
  app.use(
    '/api/tasks',
    createTaskRoutes({
      controller,
      requireAuthMiddleware,
    }),
  );
  app.use(errorHandler);

  return app;
}

describe('task routes', () => {
  test('creates a task for the authenticated user', async () => {
    const createTask = jest.fn().mockResolvedValue(task);
    const app = createApp({
      service: {
        createTask,
      },
    });

    const response = await request(app).post('/api/tasks').send({
      title: 'Write task backend',
      description: 'Implement Phase 8',
      priority: 'High',
      dueDate: '2026-06-12T00:00:00.000Z',
      status: 'Todo',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: { task },
    });
    expect(createTask).toHaveBeenCalledWith(
      user._id,
      expect.objectContaining({
        title: 'Write task backend',
        description: 'Implement Phase 8',
        priority: 'High',
        dueDate: expect.any(Date),
        status: 'Todo',
      }),
    );
  });

  test('lists tasks with default pagination', async () => {
    const listTasks = jest.fn().mockResolvedValue({
      tasks: [task],
      pagination: {
        limit: 50,
        offset: 0,
        total: 1,
      },
    });
    const app = createApp({
      service: {
        listTasks,
      },
    });

    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body.data.pagination).toEqual({
      limit: 50,
      offset: 0,
      total: 1,
    });
    expect(response.body.data.tasks).toHaveLength(1);
    expect(listTasks).toHaveBeenCalledWith(user._id, { limit: 50, offset: 0 });
  });

  test('passes validated pagination to the service', async () => {
    const listTasks = jest.fn().mockResolvedValue({
      tasks: [],
      pagination: {
        limit: 2,
        offset: 4,
        total: 10,
      },
    });
    const app = createApp({
      service: {
        listTasks,
      },
    });

    const response = await request(app).get('/api/tasks?limit=2&offset=4');

    expect(response.status).toBe(200);
    expect(listTasks).toHaveBeenCalledWith(user._id, { limit: 2, offset: 4 });
  });

  test('gets a task by id', async () => {
    const getTaskById = jest.fn().mockResolvedValue(task);
    const app = createApp({
      service: {
        getTaskById,
      },
    });

    const response = await request(app).get(`/api/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.data.task).toEqual(task);
    expect(getTaskById).toHaveBeenCalledWith(user._id, taskId);
  });

  test('updates a task', async () => {
    const updatedTask = { ...task, title: 'Updated task' };
    const updateTask = jest.fn().mockResolvedValue(updatedTask);
    const app = createApp({
      service: {
        updateTask,
      },
    });

    const response = await request(app).patch(`/api/tasks/${taskId}`).send({
      title: 'Updated task',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.task).toEqual(updatedTask);
    expect(updateTask).toHaveBeenCalledWith(user._id, taskId, { title: 'Updated task' });
  });

  test('completes a task through the documented status update path', async () => {
    const completedTask = { ...task, status: 'Completed' };
    const updateTask = jest.fn().mockResolvedValue(completedTask);
    const app = createApp({
      service: {
        updateTask,
      },
    });

    const response = await request(app).patch(`/api/tasks/${taskId}`).send({
      status: 'Completed',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.task.status).toBe('Completed');
    expect(updateTask).toHaveBeenCalledWith(user._id, taskId, { status: 'Completed' });
  });

  test('deletes a task', async () => {
    const deleteTask = jest.fn().mockResolvedValue(undefined);
    const app = createApp({
      service: {
        deleteTask,
      },
    });

    const response = await request(app).delete(`/api/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Task deleted successfully',
    });
    expect(deleteTask).toHaveBeenCalledWith(user._id, taskId);
  });

  test('rejects unauthenticated requests', async () => {
    const createTask = jest.fn();
    const app = createApp({
      service: {
        createTask,
      },
      requireAuthMiddleware: (request, response, next) => {
        next(new AuthError('Authentication required'));
      },
    });

    const response = await request(app).post('/api/tasks').send({
      title: 'Write task backend',
      dueDate: '2026-06-12T00:00:00.000Z',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
    expect(createTask).not.toHaveBeenCalled();
  });

  test('returns 404 for tasks outside the authenticated owner scope', async () => {
    const getTaskById = jest.fn().mockRejectedValue(new NotFoundError('Task not found'));
    const app = createApp({
      service: {
        getTaskById,
      },
    });

    const response = await request(app).get(`/api/tasks/${taskId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Task not found');
  });

  test('rejects invalid create payloads', async () => {
    const createTask = jest.fn();
    const app = createApp({
      service: {
        createTask,
      },
    });

    const response = await request(app).post('/api/tasks').send({
      title: '',
      dueDate: 'not-a-date',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(createTask).not.toHaveBeenCalled();
  });

  test('rejects invalid pagination params', async () => {
    const listTasks = jest.fn();
    const app = createApp({
      service: {
        listTasks,
      },
    });

    const response = await request(app).get('/api/tasks?limit=101&offset=-1');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(listTasks).not.toHaveBeenCalled();
  });

  test('rejects invalid task ids', async () => {
    const getTaskById = jest.fn();
    const app = createApp({
      service: {
        getTaskById,
      },
    });

    const response = await request(app).get('/api/tasks/not-a-valid-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(getTaskById).not.toHaveBeenCalled();
  });
});
