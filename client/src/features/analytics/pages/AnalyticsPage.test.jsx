import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ThemeProvider } from '../../theme/ThemeProvider.jsx';
import { clearApiAccessToken, setApiAccessToken } from '../../../lib/apiClient.js';
import AnalyticsPage from './AnalyticsPage.jsx';

vi.mock('../../../components/shared/DeferredScoreChart.jsx', () => ({
  DeferredScoreChart: ({ data = [], emptyTitle, valueLabel = emptyTitle || 'Chart' }) => (
    <div data-testid={`chart-${valueLabel}`}>{JSON.stringify(data)}</div>
  ),
}));

function createAnalyticsDay(overrides = {}) {
  return {
    date: '2026-06-12',
    label: 'Jun 12',
    taskCompletionRate: 50,
    habitCompletionRate: 100,
    productivityScore: 75,
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

function renderAnalytics(fetchMock) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  vi.stubGlobal('fetch', fetchMock);
  setApiAccessToken('test-access-token');

  render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AnalyticsPage />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('AnalyticsPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    clearApiAccessToken();
  });

  test('shows loading state while weekly analytics load', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));

    renderAnalytics(fetchMock);

    expect(screen.getByText('Loading analytics...')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/weekly',
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-access-token',
        }),
      }),
    );
  });

  test('renders weekly analytics values from the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          days: [
            createAnalyticsDay({
              date: '2026-06-10',
              label: 'Jun 10',
              taskCompletionRate: 0,
              habitCompletionRate: 50,
              productivityScore: 25,
            }),
            createAnalyticsDay({
              date: '2026-06-11',
              label: 'Jun 11',
              taskCompletionRate: 100,
              habitCompletionRate: 100,
              productivityScore: 100,
            }),
            createAnalyticsDay(),
          ],
        },
      }),
    );

    renderAnalytics(fetchMock);

    expect(await screen.findByText('3/7 days')).toBeInTheDocument();
    expect(screen.getByText('Task completion')).toBeInTheDocument();
    expect(screen.getByText('Habit consistency')).toBeInTheDocument();
    expect(screen.getByText('Productivity score')).toBeInTheDocument();
    expect(screen.getByText('Today productivity score')).toBeInTheDocument();
    expect(screen.getByText('Jun 12')).toBeInTheDocument();
    expect(screen.getByText('Tasks 50% · Habits 100%')).toBeInTheDocument();
    expect(screen.getByTestId('chart-Productivity score')).toHaveTextContent('"score":75');
  });

  test('keeps null productivity scores as chart gaps', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          days: [
            createAnalyticsDay({
              date: '2026-06-10',
              label: 'Jun 10',
              taskCompletionRate: 0,
              habitCompletionRate: 0,
              productivityScore: null,
            }),
            createAnalyticsDay({
              date: '2026-06-11',
              label: 'Jun 11',
              taskCompletionRate: 100,
              habitCompletionRate: 0,
              productivityScore: 100,
            }),
          ],
        },
      }),
    );

    renderAnalytics(fetchMock);

    const scoreChart = await screen.findByTestId('chart-Productivity score');

    expect(scoreChart).toHaveTextContent('"score":null');
    expect(scoreChart).not.toHaveTextContent('"score":0');
    expect(screen.getByText('1/7 days')).toBeInTheDocument();
  });

  test('renders no-activity state when all productivity scores are null', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          days: [
            createAnalyticsDay({ productivityScore: null, taskCompletionRate: 0, habitCompletionRate: 0 }),
            createAnalyticsDay({
              date: '2026-06-11',
              label: 'Jun 11',
              productivityScore: null,
              taskCompletionRate: 0,
              habitCompletionRate: 0,
            }),
          ],
        },
      }),
    );

    renderAnalytics(fetchMock);

    expect(await screen.findByText('No weekly activity yet')).toBeInTheDocument();
    expect(screen.getByText('No activity recorded')).toBeInTheDocument();
    expect(screen.getAllByText('--')).toHaveLength(3);
    expect(screen.getByTestId('chart-Productivity score')).toHaveTextContent('[]');
  });

  test('shows error state and retries weekly analytics', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: false,
            message: 'Analytics unavailable',
          },
          { status: 500 },
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          data: {
            days: [createAnalyticsDay()],
          },
        }),
      );

    renderAnalytics(fetchMock);

    expect(await screen.findByText('Could not load analytics')).toBeInTheDocument();
    expect(screen.getByText('Analytics unavailable')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('1/7 days')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
