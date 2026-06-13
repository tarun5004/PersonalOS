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
      toast.warning('Please fix the highlighted fields.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError('');

    try {
      await register(nextValues);
      toast.success('Account created. Welcome to Personal OS.');
    } catch (error) {
      const serverFieldErrors = mapServerValidationErrors(error.errors);
      setFieldErrors(serverFieldErrors);
      const nextFormError =
        Object.keys(serverFieldErrors).length > 0
          ? ''
          : error.message || 'Could not create account';
      setFormError(nextFormError);
      toast.error(nextFormError || 'Please check the highlighted fields.');
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
      <Card
        animate={{ opacity: 1, y: 0 }}
        as={motion.div}
        className="auth-form-card bg-surface p-5 sm:p-7"
        initial={{ opacity: 0, y: 16 }}
        transition={{ delay: 0.28, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
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
              placeholder="Tarun Raj Gaur"
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
              placeholder="you@example.com"
              type="email"
              value={values.email}
            />

            <Input
              autoComplete="new-password"
              description="Use at least 8 characters so your workspace stays protected."
              error={fieldErrors.password}
              id="register-password"
              label="Password"
              name="password"
              onChange={handleChange}
              placeholder="Create a strong password"
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

            <AvatarPicker onChange={handleAvatarChange} value={values.avatarId} />
            {fieldErrors.avatarId ? (
              <p className="m-0 text-sm text-danger">{fieldErrors.avatarId}</p>
            ) : null}

            <Button className="mt-1 w-full auth-submit-button" disabled={isBusy} size="lg" type="submit">
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
