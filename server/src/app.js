import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

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

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

