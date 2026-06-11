import { apiRequest, ApiError } from '../../lib/apiClient.js';

export function getDashboardErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return error?.message || 'Dashboard request failed';
}

function normalizeNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeTasks(tasks) {
  const source = tasks && typeof tasks === 'object' ? tasks : {};
  const total = normalizeNumber(source.total);
  const completed = normalizeNumber(source.completed);
  const incomplete = normalizeNumber(source.incomplete, Math.max(total - completed, 0));

  return {
    total,
    completed,
    incomplete,
    completionRate: normalizeNumber(source.completionRate),
  };
}

function normalizeHabits(habits) {
  const source = habits && typeof habits === 'object' ? habits : {};
  const total = normalizeNumber(source.total);
  const completedToday = normalizeNumber(source.completedToday);
  const incompleteToday = normalizeNumber(source.incompleteToday, Math.max(total - completedToday, 0));

  return {
    total,
    completedToday,
    incompleteToday,
    completionRate: normalizeNumber(source.completionRate),
  };
}

function normalizeProductivityScore(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function normalizeDashboardSummary(summary) {
  const source = summary && typeof summary === 'object' ? summary : {};

  return {
    date: typeof source.date === 'string' ? source.date : '',
    tasks: normalizeTasks(source.tasks),
    habits: normalizeHabits(source.habits),
    productivityScore: normalizeProductivityScore(source.productivityScore),
    currentStreak: normalizeNumber(source.currentStreak),
  };
}

export async function getDashboardSummary() {
  const payload = await apiRequest('/dashboard/summary');

  return normalizeDashboardSummary(payload?.data);
}
