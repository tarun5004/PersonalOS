import { jest } from '@jest/globals';
import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import { AuthError, ConflictError } from '../../errors/AppError.js';
import { errorHandler } from '../../middleware/error.middleware.js';
import { AuthController } from './auth.controller.js';
import { createAuthRoutes } from './auth.routes.js';

const user = {
  _id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
};

function createApp({ service, requireAuthMiddleware } = {}) {
  const app = express();
  const controller = new AuthController(service);

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    '/api/auth',
    createAuthRoutes({
      controller,
      rateLimiter: (request, response, next) => next(),
      requireAuthMiddleware,
    }),
  );
  app.use(errorHandler);

  return app;
}

describe('auth routes', () => {
  test('register returns user and sets HttpOnly cookie', async () => {
    const app = createApp({
      service: {
        registerUser: jest.fn().mockResolvedValue({
          user,
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        }),
      },
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: { user, accessToken: 'access-token' },
    });
    expect(response.body.data.user.passwordHash).toBeUndefined();
    expect(response.body.data.user.role).toBeUndefined();
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(response.headers['set-cookie'][0]).toContain('personal_os_refresh=');
  });

  test('register validation failure returns 400', async () => {
    const app = createApp({
      service: {
        registerUser: jest.fn(),
      },
    });

    const response = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('duplicate register returns 409', async () => {
    const app = createApp({
      service: {
        registerUser: jest.fn().mockRejectedValue(new ConflictError('Email already exists')),
      },
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already exists');
  });

  test('login returns user and sets HttpOnly cookie', async () => {
    const app = createApp({
      service: {
        loginUser: jest.fn().mockResolvedValue({
          user,
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        }),
      },
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'secret',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { user, accessToken: 'access-token' },
    });
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
  });

  test('refresh rotates refresh cookie and returns user with access token', async () => {
    const refreshSession = jest.fn().mockResolvedValue({
      user,
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    const app = createApp({
      service: {
        refreshSession,
      },
    });

    const response = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', ['personal_os_refresh=old-refresh-token']);

    expect(response.status).toBe(200);
    expect(refreshSession).toHaveBeenCalledWith(
      'old-refresh-token',
      expect.objectContaining({ userAgent: expect.any(String) }),
    );
    expect(response.body).toEqual({
      success: true,
      data: { user, accessToken: 'new-access-token' },
    });
    expect(response.headers['set-cookie'][0]).toContain('personal_os_refresh=');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
  });

  test('invalid login returns 401', async () => {
    const app = createApp({
      service: {
        loginUser: jest.fn().mockRejectedValue(new AuthError('Invalid credentials')),
      },
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrong',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  test('logout returns 200 without requiring a cookie', async () => {
    const logout = jest.fn();
    const app = createApp({
      service: { logout },
    });

    const response = await request(app).post('/api/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Logged out successfully',
    });
    expect(logout).toHaveBeenCalledWith(undefined);
    expect(response.headers['set-cookie'][0]).toContain('personal_os_refresh=');
    expect(response.headers['set-cookie'][0]).toContain('Expires=Thu, 01 Jan 1970');
  });

  test('me returns authenticated user from middleware', async () => {
    const app = createApp({
      service: {},
      requireAuthMiddleware: (request, response, next) => {
        request.user = user;
        next();
      },
    });

    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { user },
    });
  });
});
