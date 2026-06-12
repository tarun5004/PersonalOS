export class AppError extends Error {
  constructor(message, statusCode = 500, errors = [], code = 'APP_ERROR', fields = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    this.fields = fields;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = [], fields = {}) {
    super(message, 400, errors, 'VALIDATION_ERROR', fields);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, [], 'AUTH_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, [], 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, [], 'CONFLICT');
  }
}
