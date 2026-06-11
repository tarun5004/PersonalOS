import { HABIT_NAME_MAX_LENGTH } from './habitConstants.js';

function pad(value) {
  return String(value).padStart(2, '0');
}

export function getCurrentUtcMonthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

export function getCurrentUtcDateKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));

  return date.toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  });
}

export function shiftUtcMonth(monthKey, offset) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

export function getDaysForMonth(monthKey, totalDays) {
  return Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;

    return {
      day,
      dateKey: `${monthKey}-${pad(day)}`,
    };
  });
}

export function getDefaultHabitFormValues(habit) {
  return {
    name: habit?.name || '',
  };
}

export function validateHabitForm(values) {
  const errors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = 'Habit name is required';
  } else if (name.length > HABIT_NAME_MAX_LENGTH) {
    errors.name = `Habit name must be ${HABIT_NAME_MAX_LENGTH} characters or fewer`;
  }

  return errors;
}

export function serializeHabitForm(values) {
  return {
    name: values.name.trim(),
  };
}
