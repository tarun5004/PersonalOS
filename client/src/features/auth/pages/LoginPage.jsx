import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
      toast.warning('Please fix the highlighted fields.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError('');

    try {
      await login(nextValues);
      toast.success('Welcome back. Your workspace is ready.');
    } catch (error) {
      const serverFieldErrors = mapServerValidationErrors(error.errors);
      setFieldErrors(serverFieldErrors);
      const nextFormError =
        Object.keys(serverFieldErrors).length > 0
          ? ''
          : error.message || 'Could not sign in';
      setFormError(nextFormError);
      toast.error(nextFormError || 'Please check the highlighted fields.');
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
      <Card
        animate={{ opacity: 1, y: 0 }}
        as={motion.div}
        className="auth-form-card bg-surface p-5 sm:p-7"
        initial={{ opacity: 0, y: 16 }}
        transition={{ delay: 0.28, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
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
              placeholder="you@example.com"
              type="email"
              value={values.email}
            />

            <Input
              autoComplete="current-password"
              description="Use the password for your Personal OS account."
              error={fieldErrors.password}
              id="login-password"
              label="Password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={values.password}
            />
            <button
              className="-mt-2 justify-self-start text-sm font-semibold text-accent-strong underline-offset-4 hover:underline focus-visible:outline-none focus-visible:shadow-focus"
              onClick={() => setIsPasswordVisible((current) => !current)}
              type="button"
            >
              {isPasswordVisible ? 'Hide password' : 'Show password'}
            </button>

            <Button className="mt-1 w-full auth-submit-button" disabled={isBusy} size="lg" type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            New here?{' '}
            <Link
              className="font-bold text-accent-strong underline-offset-4 hover:underline"
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
