import { useEffect, useState } from 'react';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { TASK_PRIORITIES, TASK_STATUSES } from '../taskConstants.js';
import {
  createDefaultTaskFormValues,
  serializeTaskFormValues,
  taskToFormValues,
  validateTaskForm,
} from '../taskFormUtils.js';

export function TaskForm({ initialTask, isSubmitting, onCancel, onSubmit, serverError }) {
  const [values, setValues] = useState(() =>
    initialTask ? taskToFormValues(initialTask) : createDefaultTaskFormValues(),
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialTask ? taskToFormValues(initialTask) : createDefaultTaskFormValues());
    setErrors({});
  }, [initialTask]);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateTaskForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(serializeTaskFormValues(values));
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {serverError ? <Alert variant="error">{serverError}</Alert> : null}

      <Input
        autoFocus
        error={errors.title}
        label="Title"
        onChange={(event) => updateField('title', event.target.value)}
        placeholder="e.g. Prepare tomorrow's study plan"
        value={values.title}
      />

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-body" htmlFor="task-description">
          Description
        </label>
        <textarea
          className="min-h-24 w-full resize-y rounded-ui border border-border bg-surface px-3.5 py-3 text-body outline-none transition duration-200 placeholder:text-muted/70 focus:border-focus focus:bg-surface focus:ring-[3px] focus:ring-focus/20 disabled:cursor-not-allowed disabled:opacity-65"
          id="task-description"
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Optional notes or context"
          value={values.description}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Priority"
          onChange={(event) => updateField('priority', event.target.value)}
          value={values.priority}
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Select>

        <Select
          label="Status"
          onChange={(event) => updateField('status', event.target.value)}
          value={values.status}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      </div>

      <Input
        error={errors.dueDate}
        label="Due date"
        onChange={(event) => updateField('dueDate', event.target.value)}
        type="datetime-local"
        value={values.dueDate}
      />

      <div className="flex flex-wrap justify-end gap-2">
        <Button disabled={isSubmitting} onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : initialTask ? 'Save task' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}
