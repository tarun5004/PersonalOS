export class ApiError extends Error {
  constructor({ status, message, errors = [] }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || '/api';
}

function buildApiUrl(path) {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json();
}

export async function apiRequest(path, { body, headers = {}, ...options } = {}) {
  const response = await fetch(buildApiUrl(path), {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...options,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      message: payload?.message || 'Request failed',
      errors: payload?.errors || [],
    });
  }

  return payload;
}
