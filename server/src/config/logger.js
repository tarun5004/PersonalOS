import pino from 'pino';
import { env } from './env.js';

const logger = pino({
  level: env.LOG_LEVEL,
  ...(env.NODE_ENV !== 'production' &&
    env.NODE_ENV !== 'test' && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: '{msg}',
        },
      },
    }),
  base: {
    service: 'personal-os-api',
    env: env.NODE_ENV,
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: (request) => ({
      id: request.id,
      method: request.method,
      url: request.originalUrl || request.url,
      ip: request.ip,
    }),
    res: (response) => ({
      statusCode: response.statusCode,
    }),
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.passwordHash',
      '*.token',
      '*.accessToken',
      '*.refreshToken',
    ],
    censor: '[REDACTED]',
  },
});

export default logger;
