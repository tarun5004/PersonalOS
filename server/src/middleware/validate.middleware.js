import { ValidationError } from '../errors/AppError.js';

function formatIssues(issues) {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

export function validate(schema) {
  return (request, response, next) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      next(new ValidationError('Validation failed', formatIssues(result.error.issues)));
      return;
    }

    request.validated = result.data;
    next();
  };
}

