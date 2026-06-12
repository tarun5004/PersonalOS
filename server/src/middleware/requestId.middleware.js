import { randomUUID } from 'crypto';

export function requestId(request, response, next) {
  request.id = request.get('x-request-id') || randomUUID();
  response.setHeader('X-Request-Id', request.id);
  next();
}
