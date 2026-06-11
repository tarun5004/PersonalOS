import { StrictMode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ApiError } from '../../lib/apiClient.js';
import { getCurrentUser } from './authApi.js';
import { AuthProvider } from './AuthProvider.jsx';
import { useAuth } from './useAuth.js';

vi.mock('./authApi.js', () => ({
  getCurrentUser: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
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
    getCurrentUser.mockResolvedValue({
      _id: 'user-1',
      email: 'varun@example.com',
      name: 'Varun',
    });

    renderAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
    expect(screen.getByText('varun@example.com')).toBeInTheDocument();
  });

  test('silently redirects expired sessions to login', async () => {
    getCurrentUser.mockRejectedValue(
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

  test('leaves restoring state when session restore fails in StrictMode', async () => {
    getCurrentUser.mockRejectedValue(
      new ApiError({
        status: 502,
        message: 'Request failed',
      }),
    );

    renderAuthProvider('/dashboard', { strict: true });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });
  });
});
