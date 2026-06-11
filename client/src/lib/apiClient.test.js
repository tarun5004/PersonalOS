import { afterEach, describe, expect, test, vi } from 'vitest';
import { apiRequest, ApiError } from './apiClient.js';

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
