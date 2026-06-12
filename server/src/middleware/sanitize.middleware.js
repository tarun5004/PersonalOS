import xss from 'xss';

const XSS_OPTIONS = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
};

export function sanitizeObject(value) {
  if (typeof value === 'string') {
    return xss(value, XSS_OPTIONS);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nextValue]) => [key, sanitizeObject(nextValue)]),
    );
  }

  return value;
}

export function sanitizeBody(request, response, next) {
  if (request.body) {
    request.body = sanitizeObject(request.body);
  }

  next();
}
