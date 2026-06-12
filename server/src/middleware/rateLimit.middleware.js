import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

function rateLimitMessage(message, code) {
  return {
    success: false,
    error: message,
    message,
    code,
    errors: [],
  };
}

export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage('Too many auth attempts. Try again later.', 'AUTH_RATE_LIMITED'),
});

export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage('Too many requests', 'RATE_LIMITED'),
});

export const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage('Too many requests', 'RATE_LIMITED'),
});
