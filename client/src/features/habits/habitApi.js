import { apiRequest, ApiError } from '../../lib/apiClient.js';

function getHabitFromPayload(payload) {
  return payload?.data?.habit || null;
}

function getHabitsFromPayload(payload) {
  return {
    habits: payload?.data?.habits || [],
    month: payload?.data?.month || null,
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

export function getHabitErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return error?.message || 'Habit request failed';
}

export async function listHabits(params) {
  const payload = await apiRequest(`/habits${buildQueryString(params)}`);

  return getHabitsFromPayload(payload);
}

export async function createHabit(values) {
  const payload = await apiRequest('/habits', {
    method: 'POST',
    body: values,
  });

  return getHabitFromPayload(payload);
}

export async function updateHabit(habitId, values) {
  const payload = await apiRequest(`/habits/${habitId}`, {
    method: 'PATCH',
    body: values,
  });

  return getHabitFromPayload(payload);
}

export async function checkInHabit(habitId) {
  const payload = await apiRequest(`/habits/${habitId}/check-in`, {
    method: 'POST',
  });

  return payload?.data || null;
}

export async function deleteHabit(habitId) {
  await apiRequest(`/habits/${habitId}`, {
    method: 'DELETE',
  });
}
