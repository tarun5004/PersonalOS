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
import {
  mapServerValidationErrors,
  normalizeLoginValues,
  validateLoginForm,
} from '../auth.validation.js';
import { AuthShell } from '../components/AuthShell.jsx';
import { useAuth } from '../useAuth.js';

const initialValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const { isRestoring, login } = useAuth();
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

  async function handleSubmit(event) {
    event.preventDefault();

    const nextValues = normalizeLoginValues(values);
    const nextErrors = validateLoginForm(nextValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError('');

    try {
      await login(nextValues);
    } catch (error) {
      const serverFieldErrors = mapServerValidationErrors(error.errors);
      setFieldErrors(serverFieldErrors);
      setFormError(
        Object.keys(serverFieldErrors).length > 0
          ? ''
          : error.message || 'Could not sign in',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      summary="Continue to your workspace and keep today's tasks, habits, and weekly rhythm in one place."
      title="Pick up your day where you left it."
    >
      <Card className="bg-surface p-6 sm:p-7">
        <CardHeader>
          <CardDescription>Account</CardDescription>
          <CardTitle>Log in</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
            {formError ? <Alert variant="error">{formError}</Alert> : null}

            <Input
              autoComplete="email"
              error={fieldErrors.email}
              id="login-email"
              label="Email"
              name="email"
              onChange={handleChange}
              type="email"
              value={values.email}
            />

            <Input
              autoComplete="current-password"
              error={fieldErrors.password}
              id="login-password"
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />

            <Button className="mt-1 w-full" disabled={isBusy} size="lg" type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            New here?{' '}
            <Link
              className="font-bold text-primary-strong underline-offset-4 hover:underline"
              to="/register"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
