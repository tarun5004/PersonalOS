import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { TASK_PRIORITIES, TASK_STATUSES } from '../taskConstants.js';
import {
  createDefaultTaskFormValues,
  resolveTaskFormValues,
  serializeTaskFormValues,
  taskToFormValues,
} from '../taskFormUtils.js';

export function TaskForm({ initialTask, isSubmitting, onCancel, onSubmit, serverError }) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: initialTask ? taskToFormValues(initialTask) : createDefaultTaskFormValues(),
    resolver: resolveTaskFormValues,
  });

  useEffect(() => {
    reset(initialTask ? taskToFormValues(initialTask) : createDefaultTaskFormValues());
  }, [initialTask, reset]);

  function handleValidSubmit(values) {
    onSubmit(serializeTaskFormValues(values));
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(handleValidSubmit)}>
      {serverError ? <Alert variant="error">{serverError}</Alert> : null}

      <Input
        autoFocus
        className="gap-1"
        error={errors.title?.message}
        inputClassName="min-h-14 border-transparent bg-transparent px-0 text-xl font-semibold leading-tight placeholder:text-muted/70 focus:border-transparent focus:bg-transparent focus:shadow-focus"
        label="Task title"
        placeholder="Untitled task"
        {...register('title')}
      />

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-body" htmlFor="task-description">
          Description
        </label>
        <textarea
          className="min-h-24 w-full resize-y rounded-card border border-border bg-surface px-3.5 py-3 text-body outline-none transition duration-200 placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-65"
          id="task-description"
          placeholder="Optional notes or context"
          {...register('description')}
        />
        {errors.description?.message ? (
          <p className="m-0 text-sm text-danger">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          error={errors.priority?.message}
          label="Priority"
          {...register('priority')}
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Select>

        <Select
          error={errors.status?.message}
          label="Status"
          {...register('status')}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      </div>

      <Input
        error={errors.dueDate?.message}
        label="Due date"
        type="datetime-local"
        {...register('dueDate')}
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
