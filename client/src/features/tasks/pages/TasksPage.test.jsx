import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ThemeProvider } from '../../theme/ThemeProvider.jsx';
import { clearApiAccessToken, setApiAccessToken } from '../../../lib/apiClient.js';
import TasksPage from './TasksPage.jsx';

const dueDate = '2026-06-12T09:00:00.000Z';

function createTask(overrides = {}) {
  return {
    _id: overrides._id || crypto.randomUUID(),
    title: 'Original task',
    description: 'Original notes',
    priority: 'Medium',
    dueDate,
    status: 'Todo',
    createdAt: '2026-06-12T08:00:00.000Z',
    updatedAt: '2026-06-12T08:00:00.000Z',
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

function createTasksFetchMock(initialTasks = []) {
  let tasks = [...initialTasks];

  return vi.fn(async (url, options = {}) => {
    const requestUrl = new URL(String(url), 'http://localhost');
    const method = options.method || 'GET';
    const taskId = requestUrl.pathname.split('/').at(-1);

    if (requestUrl.pathname !== '/api/tasks' && !requestUrl.pathname.startsWith('/api/tasks/')) {
      return jsonResponse({ success: false, message: 'Not found' }, { status: 404 });
    }

    if (method === 'GET' && requestUrl.pathname === '/api/tasks') {
      const limit = Number(requestUrl.searchParams.get('limit') || 50);
      const offset = Number(requestUrl.searchParams.get('offset') || 0);

      return jsonResponse({
        success: true,
        data: {
          tasks: tasks.slice(offset, offset + limit),
          pagination: {
            limit,
            offset,
            total: tasks.length,
          },
        },
      });
    }

    if (method === 'POST') {
      const body = JSON.parse(options.body);
      const nextTask = createTask({
        ...body,
        _id: `task-${tasks.length + 1}`,
      });
      tasks = [nextTask, ...tasks];

      return jsonResponse({
        success: true,
        data: {
          task: nextTask,
        },
      }, { status: 201 });
    }

    if (method === 'PATCH') {
      const body = JSON.parse(options.body);
      const task = tasks.find((item) => item._id === taskId);

      if (!task) {
        return jsonResponse({ success: false, message: 'Task not found' }, { status: 404 });
      }

      const nextTask = { ...task, ...body, updatedAt: '2026-06-12T10:00:00.000Z' };
      tasks = tasks.map((item) => (item._id === taskId ? nextTask : item));

      return jsonResponse({
        success: true,
        data: {
          task: nextTask,
        },
      });
    }

    if (method === 'DELETE') {
      tasks = tasks.filter((item) => item._id !== taskId);

      return jsonResponse({
        success: true,
        message: 'Task deleted successfully',
      });
    }

    return jsonResponse({ success: false, message: 'Unsupported method' }, { status: 405 });
  });
}

function renderTasksPage(fetchMock) {
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
        <TasksPage />
      </QueryClientProvider>
    </ThemeProvider>,
  );

  return queryClient;
}

describe('TasksPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    clearApiAccessToken();
  });

  test('shows loading and empty states', async () => {
    const fetchMock = createTasksFetchMock();

    renderTasksPage(fetchMock);

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    expect(await screen.findByText('Create your first task')).toBeInTheDocument();
  });

  test('creates a task and refreshes the task list', async () => {
    const user = userEvent.setup();
    const fetchMock = createTasksFetchMock();

    renderTasksPage(fetchMock);

    await screen.findByText('Create your first task');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    await user.type(screen.getByLabelText('Title'), 'Created from test');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    expect(await screen.findByText('Task created successfully')).toBeInTheDocument();
    expect(await screen.findByText('Created from test')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tasks',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Created from test'),
      }),
    );
  });

  test('edits an existing task', async () => {
    const user = userEvent.setup();
    const fetchMock = createTasksFetchMock([createTask({ _id: 'task-1' })]);

    renderTasksPage(fetchMock);

    await screen.findByText('Original task');
    await user.click(screen.getByRole('button', { name: /edit original task/i }));
    const dialog = screen.getByRole('dialog');
    const titleInput = within(dialog).getByLabelText('Title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Edited task');
    await user.click(within(dialog).getByRole('button', { name: /save task/i }));

    expect(await screen.findByText('Task updated successfully')).toBeInTheDocument();
    expect(await screen.findByText('Edited task')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tasks/task-1',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining('Edited task'),
      }),
    );
  });

  test('completes a task', async () => {
    const user = userEvent.setup();
    const fetchMock = createTasksFetchMock([createTask({ _id: 'task-1' })]);

    renderTasksPage(fetchMock);

    await screen.findByText('Original task');
    await user.click(screen.getByRole('button', { name: /complete original task/i }));

    expect(await screen.findByText('Task completed successfully')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tasks/task-1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'Completed' }),
      }),
    );
  });

  test('deletes a task', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fetchMock = createTasksFetchMock([createTask({ _id: 'task-1' })]);

    renderTasksPage(fetchMock);

    await screen.findByText('Original task');
    await user.click(screen.getByRole('button', { name: /delete original task/i }));

    expect(confirmSpy).toHaveBeenCalledWith('Delete "Original task"?');
    expect(await screen.findByText('Task deleted successfully')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Original task')).not.toBeInTheDocument();
    });
  });

  test('filters tasks by status', async () => {
    const user = userEvent.setup();
    const fetchMock = createTasksFetchMock([
      createTask({ _id: 'task-1', title: 'Todo task', status: 'Todo' }),
      createTask({ _id: 'task-2', title: 'Done task', status: 'Completed' }),
    ]);

    renderTasksPage(fetchMock);

    expect(await screen.findByText('Todo task')).toBeInTheDocument();
    expect(screen.getByText('Done task')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Completed' }));

    expect(screen.queryByText('Todo task')).not.toBeInTheDocument();
    expect(screen.getByText('Done task')).toBeInTheDocument();
  });

  test('shows an error state when task loading fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            success: false,
            message: 'Task service unavailable',
          },
          { status: 500 },
        ),
      ),
    );
    setApiAccessToken('test-access-token');

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TasksPage />
        </QueryClientProvider>
      </ThemeProvider>,
    );

    expect(await screen.findByText('Could not load tasks')).toBeInTheDocument();
    expect(screen.getByText('Task service unavailable')).toBeInTheDocument();
  });
});
