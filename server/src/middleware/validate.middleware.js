import { ValidationError } from '../errors/AppError.js';

function formatIssues(issues) {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

function formatFields(issues) {
  return issues.reduce((fields, issue) => {
    const [scope, ...pathParts] = issue.path;
    const key = pathParts.join('.') || String(scope || 'request');

    fields[key] = fields[key] || [];
    fields[key].push(issue.message);

    return fields;
  }, {});
}

export function validate(schema) {
  return (request, response, next) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      next(
        new ValidationError(
          'Validation failed',
          formatIssues(result.error.issues),
          formatFields(result.error.issues),
        ),
      );
      return;
    }

    request.validated = result.data;
    request.body = result.data.body ?? request.body;
    request.params = result.data.params ?? request.params;
    request.query = result.data.query ?? request.query;
    next();
  };
}

export function validateQuery(schema) {
  return (request, response, next) => {
    const result = schema.safeParse(request.query);

    if (!result.success) {
      next(
        new ValidationError(
          'Validation failed',
          formatIssues(result.error.issues),
          formatFields(result.error.issues),
        ),
      );
      return;
    }

    request.validated = {
      ...(request.validated || {}),
      query: result.data,
    };
    request.query = result.data;
    next();
  };
}
