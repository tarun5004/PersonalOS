import { apiRequest, ApiError } from '../../lib/apiClient.js';

function getTaskFromPayload(payload) {
  return payload?.data?.task || null;
}

function getTasksFromPayload(payload) {
  return {
    tasks: payload?.data?.tasks || [],
    pagination: payload?.data?.pagination || {
      limit: 50,
      offset: 0,
      total: 0,
    },
  };
}

function buildQueryString(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : '';
}

export function getTaskErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return error?.message || 'Task request failed';
}

export async function listTasks(params) {
  const payload = await apiRequest(`/tasks${buildQueryString(params)}`);

  return getTasksFromPayload(payload);
}

export async function createTask(values) {
  const payload = await apiRequest('/tasks', {
    method: 'POST',
    body: values,
  });

  return getTaskFromPayload(payload);
}

export async function updateTask(taskId, values) {
  const payload = await apiRequest(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: values,
  });

  return getTaskFromPayload(payload);
}

export async function completeTask(taskId) {
  return updateTask(taskId, { status: 'Completed' });
}

export async function deleteTask(taskId) {
  await apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
