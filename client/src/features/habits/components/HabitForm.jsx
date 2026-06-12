import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { mergeClassNames } from '../../../lib/classNames.js';
import {
  HABIT_COLOR_CHOICES,
  HABIT_DESCRIPTION_MAX_LENGTH,
  HABIT_NAME_MAX_LENGTH,
} from '../habitConstants.js';
import {
  getDefaultHabitFormValues,
  resolveHabitFormValues,
  serializeHabitForm,
} from '../habitFormUtils.js';

export function HabitForm({
  existingHabits = [],
  initialHabit,
  isSubmitting,
  onCancel,
  onSubmit,
  serverError,
}) {
  const resolver = useMemo(
    () => resolveHabitFormValues({ currentHabitId: initialHabit?._id, existingHabits }),
    [existingHabits, initialHabit?._id],
  );
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: getDefaultHabitFormValues(initialHabit),
    resolver,
  });
  const name = watch('name') || '';
  const description = watch('description') || '';
  const selectedColor = watch('color');
  const nameRemaining = HABIT_NAME_MAX_LENGTH - name.trim().length;
  const descriptionRemaining = HABIT_DESCRIPTION_MAX_LENGTH - description.trim().length;

  useEffect(() => {
    reset(getDefaultHabitFormValues(initialHabit));
  }, [initialHabit, reset]);

  function handleColorSelect(color) {
    setValue('color', color, { shouldDirty: true, shouldValidate: true });
  }

  function handleValidSubmit(values) {
    onSubmit(serializeHabitForm(values));
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      {serverError ? <Alert variant="error">{serverError}</Alert> : null}

      <Input
        autoComplete="off"
        autoFocus
        error={errors.name?.message}
        label="Habit name"
        placeholder="Read 20 minutes"
        {...register('name')}
      />

      <p
        className={mergeClassNames(
          'm-0 text-xs font-semibold text-muted',
          nameRemaining < 0 && 'text-danger',
        )}
      >
        {nameRemaining} characters remaining
      </p>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-body">Description</span>
        <textarea
          aria-invalid={Boolean(errors.description) || undefined}
          className="min-h-24 w-full resize-y rounded-card border border-border bg-surface px-3.5 py-3 text-body outline-none transition duration-200 placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:shadow-focus aria-[invalid=true]:border-danger"
          placeholder="Why this habit matters"
          {...register('description')}
        />
        {errors.description ? (
          <span className="text-sm text-danger">{errors.description.message}</span>
        ) : null}
      </label>

      <p
        className={mergeClassNames(
          'm-0 text-xs font-semibold text-muted',
          descriptionRemaining < 0 && 'text-danger',
        )}
      >
        {descriptionRemaining} characters remaining
      </p>

      <div className="grid gap-2">
        <span className="text-sm font-semibold text-body">Streak color</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Habit streak color">
          {HABIT_COLOR_CHOICES.map(({ label, value }) => {
            const isSelected = selectedColor === value;

            return (
              <button
                aria-checked={isSelected}
                aria-label={`Use ${label.toLowerCase()} habit color`}
                className={mergeClassNames(
                  'grid size-9 place-items-center rounded-full border-2 border-border outline-none transition hover:scale-105 focus-visible:shadow-focus',
                  isSelected && 'border-body ring-2 ring-accent ring-offset-2 ring-offset-surface',
                )}
                key={value}
                onClick={() => handleColorSelect(value)}
                role="radio"
                style={{ backgroundColor: value }}
                type="button"
              >
                {isSelected ? (
                  <span className="size-2.5 rounded-full bg-[var(--text-inverse)] shadow-card" />
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.color ? <p className="m-0 text-sm text-danger">{errors.color.message}</p> : null}
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button disabled={isSubmitting} onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : initialHabit ? 'Save habit' : 'Create habit'}
        </Button>
      </div>
    </form>
  );
}
