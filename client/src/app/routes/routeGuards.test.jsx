import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { useAuth } from '../../features/auth/useAuth.js';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicRoute } from './PublicRoute.jsx';

vi.mock('../../features/auth/useAuth.js', () => ({
  useAuth: vi.fn(),
}));

function renderWithRoutes(routeElement, initialPath = '/dashboard') {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={routeElement} path="/dashboard" />
        <Route element={<span>Login page</span>} path="/login" />
      </Routes>
    </MemoryRouter>,
  );
}

describe('route guards', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('ProtectedRoute renders a loading state while auth is restoring', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isRestoring: true,
    });

    renderWithRoutes(
      <ProtectedRoute>
        <span>Dashboard page</span>
      </ProtectedRoute>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  test('ProtectedRoute redirects unauthenticated users to login', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isRestoring: false,
    });

    renderWithRoutes(
      <ProtectedRoute>
        <span>Dashboard page</span>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  test('ProtectedRoute renders protected content for authenticated users', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isRestoring: false,
    });

    renderWithRoutes(
      <ProtectedRoute>
        <span>Dashboard page</span>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
  });

  test('PublicRoute redirects authenticated users to dashboard', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isRestoring: false,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            element={
              <PublicRoute>
                <span>Login page</span>
              </PublicRoute>
            }
            path="/login"
          />
          <Route element={<span>Dashboard page</span>} path="/dashboard" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
  });

  test('PublicRoute renders public content for unauthenticated users', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isRestoring: false,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            element={
              <PublicRoute>
                <span>Login page</span>
              </PublicRoute>
            }
            path="/login"
          />
          <Route element={<span>Dashboard page</span>} path="/dashboard" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
