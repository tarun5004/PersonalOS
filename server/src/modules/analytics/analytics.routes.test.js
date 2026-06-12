import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { AuthError } from '../../errors/AppError.js';
import { errorHandler } from '../../middleware/error.middleware.js';
import { AnalyticsController } from './analytics.controller.js';
import { createAnalyticsRoutes } from './analytics.routes.js';

const user = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Analytics User',
  email: 'analytics@example.com',
};

const weeklyAnalytics = {
  days: [
    {
      date: '2026-06-12',
      label: 'Jun 12',
      taskCompletionRate: 50,
      habitCompletionRate: 100,
      productivityScore: 75,
    },
  ],
};

function authenticated(request, response, next) {
  request.user = user;
  next();
}

function createApp({ service, requireAuthMiddleware = authenticated } = {}) {
  const app = express();
  const controller = new AnalyticsController(service);

  app.use(express.json());
  app.use(
    '/api/analytics',
    createAnalyticsRoutes({
      controller,
      requireAuthMiddleware,
    }),
  );
  app.use(errorHandler);

  return app;
}

describe('analytics routes', () => {
  test('returns weekly analytics for the authenticated user', async () => {
    const getWeeklyAnalytics = jest.fn().mockResolvedValue(weeklyAnalytics);
    const app = createApp({
      service: {
        getWeeklyAnalytics,
      },
    });

    const response = await request(app).get('/api/analytics/weekly');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: weeklyAnalytics,
    });
    expect(getWeeklyAnalytics).toHaveBeenCalledWith(user._id);
  });

  test('rejects unauthenticated weekly analytics requests', async () => {
    const getWeeklyAnalytics = jest.fn();
    const app = createApp({
      service: {
        getWeeklyAnalytics,
      },
      requireAuthMiddleware: (request, response, next) => {
        next(new AuthError('Authentication required'));
      },
    });

    const response = await request(app).get('/api/analytics/weekly');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
    expect(getWeeklyAnalytics).not.toHaveBeenCalled();
  });

  test('rejects unsupported query params', async () => {
    const getWeeklyAnalytics = jest.fn();
    const app = createApp({
      service: {
        getWeeklyAnalytics,
      },
    });

    const response = await request(app).get('/api/analytics/weekly?range=30');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(getWeeklyAnalytics).not.toHaveBeenCalled();
  });
});
