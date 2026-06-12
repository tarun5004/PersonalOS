import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { analyticsRoutes } from './modules/analytics/analytics.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js';
import { habitRoutes } from './modules/habits/habit.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.get('/health', (request, response) => {
    response.status(200).json({
      success: true,
      data: {
        status: 'ok',
        service: 'personal-os-api',
        environment: env.NODE_ENV,
      },
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/habits', habitRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
