import { StrictMode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ApiError } from '../../lib/apiClient.js';
import { refreshAuthSession } from './authApi.js';
import { AuthProvider } from './AuthProvider.jsx';
import { useAuth } from './useAuth.js';

vi.mock('./authApi.js', () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  refreshAuthSession: vi.fn(),
  registerUser: vi.fn(),
}));

function AuthProbe() {
  const { status, user } = useAuth();

  return (
    <div>
      <span data-testid="auth-status">{status}</span>
      <span>{user?.email || 'No user'}</span>
    </div>
  );
}

function renderAuthProvider(initialPath = '/dashboard', { strict = false } = {}) {
  const authTree = (
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route element={<AuthProbe />} path="/dashboard" />
          <Route
            element={
              <>
                <AuthProbe />
                <span>Login route</span>
              </>
            }
            path="/login"
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

  render(strict ? <StrictMode>{authTree}</StrictMode> : authTree);
}

describe('AuthProvider', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('restores an authenticated session from the backend', async () => {
    refreshAuthSession.mockResolvedValue({
      user: {
        _id: 'user-1',
        email: 'varun@example.com',
        name: 'Varun',
      },
      accessToken: 'access-token',
    });

    renderAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
    expect(screen.getByText('varun@example.com')).toBeInTheDocument();
  });

  test('silently redirects expired sessions to login', async () => {
    refreshAuthSession.mockRejectedValue(
      new ApiError({
        status: 401,
        message: 'Authentication required',
      }),
    );

    renderAuthProvider('/dashboard');

    await waitFor(() => {
      expect(screen.getByText('Login route')).toBeInTheDocument();
    });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
  });

  test('does not duplicate session restore in StrictMode', async () => {
    refreshAuthSession.mockRejectedValue(
      new ApiError({
        status: 502,
        message: 'Request failed',
      }),
    );

    renderAuthProvider('/dashboard', { strict: true });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });
    expect(refreshAuthSession).toHaveBeenCalledTimes(1);
  });
});
