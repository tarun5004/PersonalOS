import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  apiRequest,
  ApiError,
  clearApiAccessToken,
  setApiAccessToken,
  setAuthRefreshHandler,
  setAuthUnauthorizedHandler,
} from './apiClient.js';

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });
}

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearApiAccessToken();
    setAuthRefreshHandler(null);
    setAuthUnauthorizedHandler(null);
  });

  test('sends credentials with API requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          ok: true,
        },
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    await apiRequest('/auth/me');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        credentials: 'include',
      }),
    );
  });

  test('attaches access token from memory when present', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          ok: true,
        },
      }),
    );

    vi.stubGlobal('fetch', fetchMock);
    setApiAccessToken('access-token');

    await apiRequest('/auth/me');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  test('refreshes once and retries the original request after a 401', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: false,
            message: 'Invalid or expired token',
          },
          { status: 401 },
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          data: {
            ok: true,
          },
        }),
      );
    const refreshHandler = vi.fn().mockImplementation(() => {
      setApiAccessToken('next-access-token');
    });

    vi.stubGlobal('fetch', fetchMock);
    setApiAccessToken('old-access-token');
    setAuthRefreshHandler(refreshHandler);

    await apiRequest('/tasks');

    expect(refreshHandler).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/tasks',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer next-access-token',
        }),
      }),
    );
  });

  test('normalizes backend errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            success: false,
            message: 'Validation failed',
            errors: [{ path: 'body.email', message: 'Valid email is required' }],
          },
          { status: 400 },
        ),
      ),
    );

    let requestError;

    try {
      await apiRequest('/auth/login');
    } catch (error) {
      requestError = error;
    }

    expect(requestError).toBeInstanceOf(ApiError);
    expect(requestError).toMatchObject({
      name: 'ApiError',
      status: 400,
      message: 'Validation failed',
      errors: [{ path: 'body.email', message: 'Valid email is required' }],
    });
  });
});
