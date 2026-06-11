import { jest } from '@jest/globals';
import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import { errorHandler } from './error.middleware.js';
import { createRequireAuth } from './auth.middleware.js';

function createTestApp(service) {
  const app = express();
  app.use(cookieParser());
  app.get('/private', createRequireAuth(service), (request, response) => {
    response.status(200).json({
      success: true,
      data: {
        user: request.user,
      },
    });
  });
  app.use(errorHandler);
  return app;
}

describe('requireAuth middleware', () => {
  test('rejects requests without auth cookie', async () => {
    const app = createTestApp({
      getUserFromToken: jest.fn(),
    });

    const response = await request(app).get('/private');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('accepts requests with valid auth cookie', async () => {
    const app = createTestApp({
      getUserFromToken: jest.fn().mockResolvedValue({
        _id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    });

    const response = await request(app)
      .get('/private')
      .set('Cookie', ['personal_os_token=valid-token']);

    expect(response.status).toBe(200);
    expect(response.body.data.user).toEqual({
      _id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });
});
