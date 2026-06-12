import { z } from 'zod';
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

function createHabitFormSchema({ currentHabitId, existingHabits = [] } = {}) {
  return z
    .object({
      color: z.enum([...HABIT_COLOR_OPTIONS], { message: 'Choose one of the approved habit colors' }),
      description: z
        .string()
        .trim()
        .max(
          HABIT_DESCRIPTION_MAX_LENGTH,
          `Description must be ${HABIT_DESCRIPTION_MAX_LENGTH} characters or fewer`,
        ),
      name: z
        .string()
        .trim()
        .min(1, 'Habit name is required')
        .max(HABIT_NAME_MAX_LENGTH, `Habit name must be ${HABIT_NAME_MAX_LENGTH} characters or fewer`),
    })
    .superRefine((values, context) => {
      const normalizedName = values.name.toLocaleLowerCase();
      const hasDuplicateName = existingHabits.some((habit) => {
        const habitId = habit._id || habit.id;

        if (currentHabitId && habitId === currentHabitId) {
          return false;
        }

        return habit.name.trim().toLocaleLowerCase() === normalizedName;
      });

      if (hasDuplicateName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A habit with this exact name already exists',
          path: ['name'],
        });
      }
    });
}

function issuesToFieldMessages(issues) {
  return issues.reduce((errors, issue) => {
    const field = issue.path[0];

    return field ? { ...errors, [field]: issue.message } : errors;
  }, {});
}

function issuesToResolverErrors(issues) {
  return issues.reduce((errors, issue) => {
    const field = issue.path[0];

    if (!field || errors[field]) {
      return errors;
    }

    return {
      ...errors,
      [field]: {
        message: issue.message,
        type: 'validation',
      },
    };
  }, {});
}

export function validateHabitForm(values, options = {}) {
  const result = createHabitFormSchema(options).safeParse(values);

  return result.success ? {} : issuesToFieldMessages(result.error.issues);
}

export function resolveHabitFormValues(options = {}) {
  return (values) => {
    const result = createHabitFormSchema(options).safeParse(values);

    if (result.success) {
      return {
        errors: {},
        values: result.data,
      };
    }

    return {
      errors: issuesToResolverErrors(result.error.issues),
      values: {},
    };
  };
}

export function serializeHabitForm(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    color: values.color,
  };
}
