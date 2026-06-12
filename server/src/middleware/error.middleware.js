import { AppError, NotFoundError } from '../errors/AppError.js';
import { env } from '../config/env.js';
import logger from '../config/logger.js';

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
    error: message,
    message,
    code: isKnownError ? error.code : 'INTERNAL_SERVER_ERROR',
    errors: isKnownError ? error.errors : [],
  };

  if (isKnownError && Object.keys(error.fields || {}).length > 0) {
    body.fields = error.fields;
  }

  if (env.NODE_ENV !== 'production') {
    body.stack = error.stack;
  }

  if (!isKnownError || statusCode >= 500) {
    logger.error({ err: error, reqId: request.id, path: request.path }, 'Unhandled route error');
  }

  response.status(statusCode).json(body);
}
