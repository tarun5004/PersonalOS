import { TASK_LIST_LIMIT } from '../tasks/taskConstants.js';

export const DASHBOARD_ALERT_KEY = 'pos-dashboard-alert-dismissals';
export const DASHBOARD_QUERY_LIMIT = Math.min(100, TASK_LIST_LIMIT);
export const HABIT_RISK_HOUR = 18;
export const FOCUS_WINDOWS = [
  { start: 9, end: 12 },
  { start: 14, end: 17 },
];

/** Returns the first word of a user's display name for compact dashboard copy. */
export function getFirstName(name) {
  return name?.split(' ')[0] || 'there';
}

/** Returns a local YYYY-MM-DD key for dashboard date comparisons. */
export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { end, start };
}

function getTaskDueTime(task) {
  const dueTime = new Date(task.dueDate).getTime();
  return Number.isFinite(dueTime) ? dueTime : Number.POSITIVE_INFINITY;
}

function isOpenTask(task) {
  return task.status !== 'Completed';
}

/** Returns open tasks whose due date is before the local start of today. */
export function getOverdueTasks(tasks) {
  const { start } = getDayRange();

  return tasks
    .filter((task) => task.dueDate && isOpenTask(task) && getTaskDueTime(task) < start.getTime())
    .sort((a, b) => getTaskDueTime(a) - getTaskDueTime(b));
}

/** Returns the next task the dashboard should point the user toward. */
export function getMostUrgentTask(tasks) {
  const priorityWeight = { High: 0, Medium: 1, Low: 2 };
  const openTasks = tasks.filter(isOpenTask);

  return [...openTasks].sort((a, b) => {
    const dueDelta = getTaskDueTime(a) - getTaskDueTime(b);
    return dueDelta || (priorityWeight[a.priority] ?? 3) - (priorityWeight[b.priority] ?? 3);
  })[0];
}

/** Returns habits that still need today's check-in. */
export function getAtRiskHabits(habits) {
  return habits
    .filter((habit) => !habit.todayCompleted)
    .sort((a, b) => (a.currentStreak || 0) - (b.currentStreak || 0));
}

/** Formats nullable dashboard score values. */
export function formatScore(score) {
  return score === null || score === undefined ? '--' : `${Math.round(score)}%`;
}

/** Returns the stat tone that matches today's productivity score. */
export function getScoreTone(score) {
  if (score === null || score === undefined) {
    return 'primary';
  }

  if (score < 40) {
    return 'danger';
  }

  return score <= 70 ? 'warning' : 'success';
}

/** Formats singular or plural count labels. */
export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Returns true when the current hour is a good focus window and no focus has happened. */
export function isFocusOpportunity(hour, dailyCount) {
  return dailyCount === 0 && FOCUS_WINDOWS.some((window) => hour >= window.start && hour < window.end);
}

/** Reads dashboard alert dismissals scoped to the current browser session. */
export function readDismissedAlerts() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    return JSON.parse(window.sessionStorage.getItem(DASHBOARD_ALERT_KEY)) || {};
  } catch {
    return {};
  }
}

/** Writes dashboard alert dismissals scoped to the current browser session. */
export function writeDismissedAlerts(value) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(DASHBOARD_ALERT_KEY, JSON.stringify(value));
  }
}

/** Returns the dynamic command header copy for the dashboard. */
export function getCommandCopy({ atRiskHabits, habits, hour, overdueTasks, summary, tasks }) {
  if (overdueTasks.length > 0) {
    return {
      headline: `${pluralize(overdueTasks.length, 'task')} overdue - address them first`,
      subtext: `${overdueTasks.slice(0, 2).map((task) => task.title).join(', ')} needs attention before new work.`,
      tone: 'danger',
    };
  }

  if (hour >= HABIT_RISK_HOUR && atRiskHabits.length > 0) {
    return {
      headline: `${pluralize(atRiskHabits.length, 'habit')} unchecked - streak ends at midnight`,
      subtext: `${atRiskHabits.slice(0, 3).map((habit) => habit.name).join(', ')} still needs a check-in.`,
      tone: 'warning',
    };
  }

  if (tasks.length === 0 && habits.length === 0) {
    return {
      headline: 'Start your day - pick one task and one habit',
      subtext: 'A tiny plan is enough to make the system useful today.',
      tone: 'primary',
    };
  }

  if (habits.length > 0 && atRiskHabits.length === 0) {
    return {
      headline: "You're on track today",
      subtext: `${summary.habits.completedToday}/${summary.habits.total} habits are checked in and no overdue tasks are visible.`,
      tone: 'success',
    };
  }

  return {
    headline: 'Choose the next visible action',
    subtext: `${summary.tasks.incomplete} due-today tasks and ${atRiskHabits.length} unchecked habits remain in view.`,
    tone: 'primary',
  };
}

/** Returns compact weekly task and habit progress copy. */
export function getWeeklyProgressText(days) {
  const trackedDays = days.filter((day) => day.productivityScore !== null);

  if (trackedDays.length === 0) {
    return 'Track tasks and habits to unlock this week.';
  }

  const taskAverage = Math.round(
    trackedDays.reduce((sum, day) => sum + day.taskCompletionRate, 0) / trackedDays.length,
  );
  const habitAverage = Math.round(
    trackedDays.reduce((sum, day) => sum + day.habitCompletionRate, 0) / trackedDays.length,
  );

  return `This week: ${taskAverage}% tasks complete - ${habitAverage}% habit consistency`;
}

/** Builds the seven-day dashboard calendar model from habit completion dates. */
export function buildWeekDays(habits) {
  const today = new Date();
  const days = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const key = getTodayKey(date);
    const doneCount = habits.filter((habit) =>
      (habit.completedDates || []).some((completedDate) => getTodayKey(new Date(completedDate)) === key),
    ).length;
    const isToday = key === getTodayKey(today);
    const status =
      habits.length === 0 || isToday
        ? 'none'
        : doneCount === habits.length
          ? 'done'
          : 'missed';

    days.push({
      date,
      doneCount,
      isToday,
      key,
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      status,
    });
  }

  return days;
}
