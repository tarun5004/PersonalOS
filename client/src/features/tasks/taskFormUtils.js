import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from './taskConstants.js';

const DEFAULT_TIME = '09:00';

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().trim().max(2000, 'Description is too long'),
  priority: z.enum([...TASK_PRIORITIES], { message: 'Choose a valid priority' }),
  dueDate: z
    .string()
    .min(1, 'Valid due date is required')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Valid due date is required'),
  status: z.enum([...TASK_STATUSES], { message: 'Choose a valid status' }),
});

function pad(value) {
  return String(value).padStart(2, '0');
}

export function toDateTimeLocalValue(value) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function createDefaultTaskFormValues() {
  const today = new Date();

  return {
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T${DEFAULT_TIME}`,
    status: 'Todo',
  };
}

export function taskToFormValues(task) {
  return {
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    dueDate: toDateTimeLocalValue(task?.dueDate),
    status: task?.status || 'Todo',
  };
}

export function validateTaskForm(values) {
  const result = taskFormSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce((errors, issue) => {
    const field = issue.path[0];

    return field ? { ...errors, [field]: issue.message } : errors;
  }, {});
}

export function resolveTaskFormValues(values) {
  const result = taskFormSchema.safeParse(values);

  if (result.success) {
    return {
      errors: {},
      values: result.data,
    };
  }

  const errors = result.error.issues.reduce((fieldErrors, issue) => {
    const field = issue.path[0];

    if (!field || fieldErrors[field]) {
      return fieldErrors;
    }

    return {
      ...fieldErrors,
      [field]: {
        message: issue.message,
        type: 'validation',
      },
    };
  }, {});

  return {
    errors,
    values: {},
  };
}

export function serializeTaskFormValues(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    priority: values.priority,
    dueDate: new Date(values.dueDate).toISOString(),
    status: values.status,
  };
}

export function formatTaskDueDate(value) {
  if (!value) {
    return 'No due date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid due date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
