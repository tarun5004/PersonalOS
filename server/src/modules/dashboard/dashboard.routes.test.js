import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { AuthError } from '../../errors/AppError.js';
import { errorHandler } from '../../middleware/error.middleware.js';
import { DashboardController } from './dashboard.controller.js';
import { createDashboardRoutes } from './dashboard.routes.js';

const user = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Dashboard User',
  email: 'dashboard@example.com',
};

const summary = {
  date: '2026-06-12',
  tasks: {
    total: 2,
    completed: 1,
    incomplete: 1,
    completionRate: 50,
  },
  habits: {
    total: 2,
    completedToday: 1,
    incompleteToday: 1,
    completionRate: 50,
  },
  productivityScore: 50,
  currentStreak: 3,
};

function authenticated(request, response, next) {
  request.user = user;
  next();
}

function createApp({ service, requireAuthMiddleware = authenticated } = {}) {
  const app = express();
  const controller = new DashboardController(service);

  app.use(express.json());
  app.use(
    '/api/dashboard',
    createDashboardRoutes({
      controller,
      requireAuthMiddleware,
    }),
  );
  app.use(errorHandler);

  return app;
}

describe('dashboard routes', () => {
  test('returns dashboard summary for the authenticated user', async () => {
    const getSummary = jest.fn().mockResolvedValue(summary);
    const app = createApp({
      service: {
        getSummary,
      },
    });

    const response = await request(app).get('/api/dashboard/summary');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: summary,
    });
    expect(getSummary).toHaveBeenCalledWith(user._id);
  });

  test('rejects unauthenticated summary requests', async () => {
    const getSummary = jest.fn();
    const app = createApp({
      service: {
        getSummary,
      },
      requireAuthMiddleware: (request, response, next) => {
        next(new AuthError('Authentication required'));
      },
    });

    const response = await request(app).get('/api/dashboard/summary');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
    expect(getSummary).not.toHaveBeenCalled();
  });
});
