import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { setApiAccessToken } from '../../../lib/apiClient.js';
import { ThemeProvider } from '../../theme/ThemeProvider.jsx';
import HabitsPage from './HabitsPage.jsx';

const baseHabit = {
  _id: 'habit-1',
  name: 'Read',
  todayCompleted: false,
  currentStreak: 2,
  longestStreak: 5,
  completionPercentage: 6.67,
  completedDates: ['2026-06-11', '2026-06-12'],
  month: { key: '2026-06', totalDays: 30 },
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

function createHabit(overrides = {}) {
  return {
    ...baseHabit,
    ...overrides,
  };
}

function createPayload(data, status = 200) {
  return Promise.resolve({
    headers: new Headers({ 'content-type': 'application/json' }),
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

function setupFetch({ initialHabits = [], failList = false } = {}) {
  let habits = [...initialHabits];
  const requests = [];

  vi.stubGlobal('fetch', vi.fn(async (url, options = {}) => {
    const parsedUrl = new URL(url, 'http://127.0.0.1');
    requests.push({ body: options.body, method: options.method || 'GET', path: parsedUrl.pathname });

    if (parsedUrl.pathname === '/api/habits' && (!options.method || options.method === 'GET')) {
      if (failList) {
        return createPayload({ success: false, message: 'Habit list failed' }, 500);
      }

      return createPayload({
        success: true,
        data: {
          habits,
          month: { key: parsedUrl.searchParams.get('month') || '2026-06', totalDays: 30 },
          pagination: {
            limit: 50,
            offset: 0,
            total: habits.length,
          },
        },
      });
    }

    if (parsedUrl.pathname === '/api/habits' && options.method === 'POST') {
      const values = JSON.parse(options.body);
      const habit = createHabit({
        _id: `habit-${habits.length + 1}`,
        name: values.name,
        completedDates: [],
        currentStreak: 0,
        longestStreak: 0,
        todayCompleted: false,
        completionPercentage: 0,
      });
      habits = [habit, ...habits];

      return createPayload({ success: true, data: { habit } }, 201);
    }

    if (parsedUrl.pathname === '/api/habits/habit-1' && options.method === 'PATCH') {
      const values = JSON.parse(options.body);
      habits = habits.map((habit) =>
        habit._id === 'habit-1' ? { ...habit, ...values } : habit,
      );

      return createPayload({
        success: true,
        data: { habit: habits.find((habit) => habit._id === 'habit-1') },
      });
    }

    if (parsedUrl.pathname === '/api/habits/habit-1/check-in' && options.method === 'POST') {
      habits = habits.map((habit) =>
        habit._id === 'habit-1'
          ? { ...habit, todayCompleted: true, currentStreak: habit.currentStreak + 1 }
          : habit,
      );

      return createPayload({
        success: true,
        data: {
          checkIn: {
            _id: 'check-in-1',
            habitId: 'habit-1',
            date: '2026-06-12T00:00:00.000Z',
            month: '2026-06',
          },
          habit: habits.find((habit) => habit._id === 'habit-1'),
        },
      }, 201);
    }

    if (parsedUrl.pathname === '/api/habits/habit-1' && options.method === 'DELETE') {
      habits = habits.filter((habit) => habit._id !== 'habit-1');

      return createPayload({ success: true, message: 'Habit deleted successfully' });
    }

    return createPayload({ success: false, message: 'Not found' }, 404);
  }));

  return { requests };
}

function renderHabitsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <HabitsPage />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('HabitsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setApiAccessToken('test-access-token');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('shows loading then empty state', async () => {
    setupFetch();
    renderHabitsPage();

    expect(screen.getByText(/loading habits/i)).toBeInTheDocument();
    expect(await screen.findByText(/create your first habit/i)).toBeInTheDocument();
  });

  test('creates a habit', async () => {
    const user = userEvent.setup();
    setupFetch();
    renderHabitsPage();

    await user.click(await screen.findByRole('button', { name: /add habit/i }));
    await user.type(screen.getByLabelText(/habit name/i), 'Journal');
    await user.click(screen.getByRole('button', { name: /create habit/i }));

    expect(await screen.findByText(/habit created successfully/i)).toBeInTheDocument();
    expect(await screen.findAllByText('Journal')).toHaveLength(2);
  });

  test('validates required and oversized names', async () => {
    const user = userEvent.setup();
    setupFetch();
    renderHabitsPage();

    await user.click(await screen.findByRole('button', { name: /add habit/i }));
    await user.click(screen.getByRole('button', { name: /create habit/i }));
    expect(screen.getByText(/habit name is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/habit name/i), {
      target: { value: 'a'.repeat(121) },
    });
    await user.click(screen.getByRole('button', { name: /create habit/i }));
    expect(screen.getByText(/120 characters or fewer/i)).toBeInTheDocument();
  });

  test('edits, checks in, and deletes a habit', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    setupFetch({ initialHabits: [createHabit()] });
    renderHabitsPage();

    expect(await screen.findAllByText('Read')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/habit name/i));
    await user.type(screen.getByLabelText(/habit name/i), 'Read nightly');
    await user.click(screen.getByRole('button', { name: /save habit/i }));
    expect(await screen.findByText(/habit updated successfully/i)).toBeInTheDocument();
    expect(await screen.findAllByText('Read nightly')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: /check in/i }));
    expect(await screen.findByText(/habit checked in for today/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /completed/i })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(await screen.findByText(/habit deleted successfully/i)).toBeInTheDocument();
    expect(await screen.findByText(/create your first habit/i)).toBeInTheDocument();
  });

  test('sends check-in requests with no body', async () => {
    const user = userEvent.setup();
    const { requests } = setupFetch({ initialHabits: [createHabit()] });
    renderHabitsPage();

    await user.click(await screen.findByRole('button', { name: /check in/i }));
    await screen.findByText(/habit checked in for today/i);

    const checkInRequest = requests.find((request) => request.path.endsWith('/check-in'));

    expect(checkInRequest).toEqual({
      body: undefined,
      method: 'POST',
      path: '/api/habits/habit-1/check-in',
    });
  });

  test('renders grid cells from completed dates', async () => {
    setupFetch({ initialHabits: [createHabit()] });
    renderHabitsPage();

    const grid = await screen.findByText('Monthly habit tracker');
    const section = grid.closest('article') || document.body;

    expect(within(section).getByLabelText('2026-06-11 completed')).toBeInTheDocument();
    expect(within(section).getByLabelText('2026-06-10 not completed')).toBeInTheDocument();
  });

  test('shows error state when habits fail to load', async () => {
    setupFetch({ failList: true });
    renderHabitsPage();

    expect(await screen.findByText(/could not load habits/i)).toBeInTheDocument();
    expect(screen.getByText(/habit list failed/i)).toBeInTheDocument();
  });
});
