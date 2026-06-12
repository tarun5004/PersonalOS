import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { AvatarPicker } from '../../../components/shared/AvatarPicker.jsx';
import { DEFAULT_AVATAR_ID } from '../../../utils/avatars.js';
import {
  mapServerValidationErrors,
  normalizeRegisterValues,
  validateRegisterForm,
} from '../auth.validation.js';
import { AuthShell } from '../components/AuthShell.jsx';
import { useAuth } from '../useAuth.js';

const initialValues = {
  avatarId: DEFAULT_AVATAR_ID,
  email: '',
  name: '',
  password: '',
};

export default function RegisterPage() {
  const { isRestoring, register } = useAuth();
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isBusy = isSubmitting || isRestoring;

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
    setFormError('');
  }

  function handleAvatarChange(avatarId) {
    setValues((currentValues) => ({
      ...currentValues,
      avatarId,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      avatarId: '',
    }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextValues = normalizeRegisterValues(values);
    const nextErrors = validateRegisterForm(nextValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError('');

    try {
      await register(nextValues);
    } catch (error) {
      const serverFieldErrors = mapServerValidationErrors(error.errors);
      setFieldErrors(serverFieldErrors);
      setFormError(
        Object.keys(serverFieldErrors).length > 0
          ? ''
          : error.message || 'Could not create account',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Start here"
      summary="Create your workspace for tasks, habits, and weekly progress without adding noise to your day."
      title="Make a personal dashboard that feels easy to return to."
    >
      <Card className="bg-surface p-6 sm:p-7">
        <CardHeader>
          <CardDescription>New workspace</CardDescription>
          <CardTitle>Create account</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
            {formError ? <Alert variant="error">{formError}</Alert> : null}

            <Input
              autoComplete="name"
              error={fieldErrors.name}
              id="register-name"
              label="Name"
              name="name"
              onChange={handleChange}
              type="text"
              value={values.name}
            />

            <Input
              autoComplete="email"
              error={fieldErrors.email}
              id="register-email"
              label="Email"
              name="email"
              onChange={handleChange}
              type="email"
              value={values.email}
            />

            <Input
              autoComplete="new-password"
              error={fieldErrors.password}
              id="register-password"
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />

            <AvatarPicker onChange={handleAvatarChange} value={values.avatarId} />
            {fieldErrors.avatarId ? (
              <p className="m-0 text-sm text-danger">{fieldErrors.avatarId}</p>
            ) : null}

            <Button className="mt-1 w-full" disabled={isBusy} size="lg" type="submit">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link
              className="font-bold text-accent-strong underline-offset-4 hover:underline"
              to="/login"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
