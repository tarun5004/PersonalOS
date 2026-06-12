export class ApiError extends Error {
  constructor({ status, message, errors = [] }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

let accessToken = '';
let refreshSessionHandler = null;
let unauthorizedHandler = null;

export function setApiAccessToken(nextAccessToken) {
  accessToken = nextAccessToken || '';
}

export function clearApiAccessToken() {
  accessToken = '';
}

export function setAuthRefreshHandler(handler) {
  refreshSessionHandler = handler;
}

export function setAuthUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';
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
  const {
    auth = true,
    skipAuthRefresh = false,
    hasRetriedAfterRefresh = false,
    ...fetchOptions
  } = options;
  const requestHeaders = {
    Accept: 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  if (auth && accessToken && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(buildApiUrl(path), {
    credentials: 'include',
    headers: requestHeaders,
    ...fetchOptions,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    const requestError = new ApiError({
      status: response.status,
      message: payload?.message || 'Request failed',
      errors: payload?.errors || [],
    });

    if (
      response.status === 401 &&
      !skipAuthRefresh &&
      !hasRetriedAfterRefresh &&
      refreshSessionHandler
    ) {
      try {
        await refreshSessionHandler();

        return apiRequest(path, {
          body,
          headers,
          ...fetchOptions,
          auth,
          skipAuthRefresh,
          hasRetriedAfterRefresh: true,
        });
      } catch {
        clearApiAccessToken();
        unauthorizedHandler?.();
      }
    }

    throw requestError;
  }

  return payload;
}
