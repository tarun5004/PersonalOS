import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { analyticsRoutes } from './modules/analytics/analytics.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js';
import { habitRoutes } from './modules/habits/habit.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';

const GLOBAL_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const GLOBAL_RATE_LIMIT_MAX_REQUESTS = 200;

export function createApp() {
  const app = express();
  const globalApiRateLimit = rateLimit({
    windowMs: GLOBAL_RATE_LIMIT_WINDOW_MS,
    max: GLOBAL_RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  });

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.get('/health', (request, response) => {
    response.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use(['/api/tasks', '/api/habits', '/api/dashboard', '/api/analytics'], globalApiRateLimit);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/habits', habitRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
