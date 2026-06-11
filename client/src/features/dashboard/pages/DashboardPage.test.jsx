import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ThemeProvider } from '../../theme/ThemeProvider.jsx';
import { AuthContext } from '../../auth/AuthProvider.jsx';
import { clearApiAccessToken, setApiAccessToken } from '../../../lib/apiClient.js';
import DashboardPage from './DashboardPage.jsx';

function createSummary(overrides = {}) {
  return {
    date: '2026-06-12',
    tasks: {
      total: 3,
      completed: 1,
      incomplete: 2,
      completionRate: 33.33,
    },
    habits: {
      total: 2,
      completedToday: 1,
      incompleteToday: 1,
      completionRate: 50,
    },
    productivityScore: 41.67,
    currentStreak: 4,
    ...overrides,
  };
}

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });
}

function renderDashboard(fetchMock) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const authValue = {
    user: {
      _id: 'user-1',
      name: 'Dashboard User',
      email: 'dashboard@example.com',
    },
  };

  vi.stubGlobal('fetch', fetchMock);
  setApiAccessToken('test-access-token');

  render(
    <ThemeProvider>
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </QueryClientProvider>
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('DashboardPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    clearApiAccessToken();
  });

  test('shows loading state while summary loads', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));

    renderDashboard(fetchMock);

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/dashboard/summary',
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-access-token',
        }),
      }),
    );
  });

  test('renders empty dashboard summary state', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: createSummary({
          tasks: {
            total: 0,
            completed: 0,
            incomplete: 0,
            completionRate: 0,
          },
          habits: {
            total: 0,
            completedToday: 0,
            incompleteToday: 0,
            completionRate: 0,
          },
          productivityScore: null,
          currentStreak: 0,
        }),
      }),
    );

    renderDashboard(fetchMock);

    expect(await screen.findByText('Create your first task')).toBeInTheDocument();
    expect(screen.getByText('No due-today tasks')).toBeInTheDocument();
    expect(screen.getByText('No habit activity yet')).toBeInTheDocument();
    expect(screen.getByText('No activity tracked today')).toBeInTheDocument();
    expect(screen.queryByText('Daily planning')).not.toBeInTheDocument();
    expect(screen.queryByText('No recent task movement')).not.toBeInTheDocument();
    expect(screen.queryByText('Phase 14')).not.toBeInTheDocument();
  });

  test('renders successful dashboard summary values', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: createSummary(),
      }),
    );

    renderDashboard(fetchMock);

    expect(await screen.findByText('Review today tasks')).toBeInTheDocument();
    expect(screen.getByText('2 tasks still open today.')).toBeInTheDocument();
    expect(screen.getByText('1/2 habits checked in.')).toBeInTheDocument();
    expect(screen.getByText('1 complete · 2 open')).toBeInTheDocument();
    expect(screen.getByText('4d')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByText('1 of 3 due-today tasks are complete.')).toBeInTheDocument();
    expect(screen.getByText('1 of 2 habits checked in for the UTC day.')).toBeInTheDocument();
    expect(screen.getByText('Weekly score')).toBeInTheDocument();
    expect(screen.queryByText('Phase 14')).not.toBeInTheDocument();
  });

  test('shows error state and retries summary load', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: false,
            message: 'Dashboard unavailable',
          },
          { status: 500 },
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          data: createSummary(),
        }),
      );

    renderDashboard(fetchMock);

    expect(await screen.findByText('Could not load dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard unavailable')).toBeInTheDocument();
    expect(screen.queryByText('No recent task movement')).not.toBeInTheDocument();
    expect(screen.queryByText('Weekly score')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('Review today tasks')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('renders safe defaults for partial successful summary payloads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          tasks: null,
          habits: null,
          productivityScore: null,
        },
      }),
    );

    renderDashboard(fetchMock);

    expect(await screen.findByText('Create your first task')).toBeInTheDocument();
    expect(screen.getByText('No due-today tasks')).toBeInTheDocument();
    expect(screen.getByText('No habit activity yet')).toBeInTheDocument();
    expect(screen.getByText('0d')).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument();
  });
});
