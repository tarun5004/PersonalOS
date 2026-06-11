const DEFAULT_TIME = '09:00';

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
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!values.dueDate || Number.isNaN(new Date(values.dueDate).getTime())) {
    errors.dueDate = 'Valid due date is required';
  }

  return errors;
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
