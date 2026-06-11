import { useEffect, useState } from 'react';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { HABIT_NAME_MAX_LENGTH } from '../habitConstants.js';
import {
  getDefaultHabitFormValues,
  serializeHabitForm,
  validateHabitForm,
} from '../habitFormUtils.js';

export function HabitForm({ initialHabit, isSubmitting, onCancel, onSubmit, serverError }) {
  const [values, setValues] = useState(() => getDefaultHabitFormValues(initialHabit));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(getDefaultHabitFormValues(initialHabit));
    setErrors({});
  }, [initialHabit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateHabitForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(serializeHabitForm(values));
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {serverError ? <Alert variant="error">{serverError}</Alert> : null}

      <Input
        autoComplete="off"
        autoFocus
        error={errors.name}
        label="Habit name"
        name="name"
        onChange={handleChange}
        placeholder="Read 20 minutes"
        value={values.name}
      />

      <p className="m-0 text-xs font-semibold text-muted">
        {values.name.trim().length}/{HABIT_NAME_MAX_LENGTH} characters
      </p>

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
