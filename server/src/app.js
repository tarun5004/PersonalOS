import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { readLimiter, writeLimiter } from './middleware/rateLimit.middleware.js';
import { requestId } from './middleware/requestId.middleware.js';
import { sanitizeBody } from './middleware/sanitize.middleware.js';
import { analyticsRoutes } from './modules/analytics/analytics.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js';
import { habitRoutes } from './modules/habits/habit.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';

const corsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

function apiMethodLimiter(request, response, next) {
  if (request.method === 'GET') {
    readLimiter(request, response, next);
    return;
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    writeLimiter(request, response, next);
    return;
  }

  next();
}

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestId);
  app.use(helmet());
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
  app.use(cors(corsOptions));
  app.options(/.*/, cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(sanitizeBody);
  app.use(cookieParser());

  app.get('/health', (request, response) => {
    response.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use(['/api/tasks', '/api/habits', '/api/dashboard', '/api/analytics'], apiMethodLimiter);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/habits', habitRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
