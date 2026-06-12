import { apiRequest, ApiError } from '../../lib/apiClient.js';

function normalizeNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeScore(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeAnalyticsDay(day) {
  const source = day && typeof day === 'object' ? day : {};

  return {
    date: typeof source.date === 'string' ? source.date : '',
    label: typeof source.label === 'string' ? source.label : '',
    taskCompleted: normalizeNumber(source.taskCompleted),
    taskTotal: normalizeNumber(source.taskTotal),
    habitCompleted: normalizeNumber(source.habitCompleted),
    habitTotal: normalizeNumber(source.habitTotal),
    taskCompletionRate: normalizeNumber(source.taskCompletionRate),
    habitCompletionRate: normalizeNumber(source.habitCompletionRate),
    productivityScore: normalizeScore(source.productivityScore),
  };
}

function normalizeHabitInsight(habit) {
  const source = habit && typeof habit === 'object' ? habit : {};

  return {
    _id: typeof source._id === 'string' ? source._id : '',
    name: typeof source.name === 'string' ? source.name : 'Habit',
    currentStreak: normalizeNumber(source.currentStreak),
    longestStreak: normalizeNumber(source.longestStreak),
    missedDaysInARow: normalizeNumber(source.missedDaysInARow),
  };
}

export function getAnalyticsErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return error?.message || 'Analytics request failed';
}

export function normalizeWeeklyAnalytics(payload) {
  const days = Array.isArray(payload?.days) ? payload.days : [];
  const previousDays = Array.isArray(payload?.previousDays) ? payload.previousDays : [];
  const habitInsights = Array.isArray(payload?.habitInsights) ? payload.habitInsights : [];

  return {
    days: days.map(normalizeAnalyticsDay),
    previousDays: previousDays.map(normalizeAnalyticsDay),
    habitInsights: habitInsights.map(normalizeHabitInsight),
  };
}

export function mapWeeklyAnalyticsToChartData(days, key = 'productivityScore') {
  return days.map((day) => ({
    date: day.date,
    label: day.label || day.date,
    score: key === 'productivityScore' ? normalizeScore(day[key]) : normalizeNumber(day[key]),
  }));
}

export function getLatestAnalyticsDay(days) {
  return days.length > 0 ? days[days.length - 1] : null;
}

export function averageAnalyticsValue(days, key) {
  const values = days
    .map((day) => day[key])
    .filter((value) => typeof value === 'number' && Number.isFinite(value));

  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export async function getWeeklyAnalytics() {
  const payload = await apiRequest('/analytics/weekly');

  return normalizeWeeklyAnalytics(payload?.data);
}
