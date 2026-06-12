import {
  DEFAULT_HABIT_COLOR,
  HABIT_COLOR_OPTIONS,
  HABIT_DESCRIPTION_MAX_LENGTH,
  HABIT_NAME_MAX_LENGTH,
} from './habitConstants.js';

function pad(value) {
  return String(value).padStart(2, '0');
}

export function getCurrentUtcMonthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

export function getCurrentUtcDateKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function getLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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
    description: habit?.description || '',
    color: habit?.color || DEFAULT_HABIT_COLOR,
  };
}

export function validateHabitForm(values, { currentHabitId, existingHabits = [] } = {}) {
  const errors = {};
  const name = values.name.trim();
  const description = values.description.trim();
  const normalizedName = name.toLocaleLowerCase();
  const hasDuplicateName = existingHabits.some((habit) => {
    const habitId = habit._id || habit.id;

    if (currentHabitId && habitId === currentHabitId) {
      return false;
    }

    return habit.name.trim().toLocaleLowerCase() === normalizedName;
  });

  if (!name) {
    errors.name = 'Habit name is required';
  } else if (name.length > HABIT_NAME_MAX_LENGTH) {
    errors.name = `Habit name must be ${HABIT_NAME_MAX_LENGTH} characters or fewer`;
  } else if (hasDuplicateName) {
    errors.name = 'A habit with this exact name already exists';
  }

  if (description.length > HABIT_DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${HABIT_DESCRIPTION_MAX_LENGTH} characters or fewer`;
  }

  if (!HABIT_COLOR_OPTIONS.includes(values.color)) {
    errors.color = 'Choose one of the approved habit colors';
  }

  return errors;
}

export function serializeHabitForm(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    color: values.color,
  };
}
