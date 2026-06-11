import { AppError, NotFoundError } from '../errors/AppError.js';
import { env } from '../config/env.js';

export function notFoundHandler(request, response, next) {
  next(new NotFoundError(`Route not found: ${request.method} ${request.originalUrl}`));
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  const isKnownError = error instanceof AppError;
  const statusCode = isKnownError ? error.statusCode : 500;
  const message =
    isKnownError || env.NODE_ENV !== 'production'
      ? error.message
      : 'Internal server error';

  const body = {
    success: false,
    message,
    errors: isKnownError ? error.errors : [],
  };

  if (env.NODE_ENV !== 'production') {
    body.stack = error.stack;
  }

  response.status(statusCode).json(body);
}

