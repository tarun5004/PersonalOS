import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  mapServerValidationErrors,
  normalizeLoginValues,
  validateLoginForm,
} from '../auth.validation.js';
import { useAuth } from '../useAuth.js';
import './AuthPages.css';

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
    <section className="auth-page">
      <p className="auth-eyebrow">Authentication</p>
      <h1>Log in</h1>
      <p className="auth-summary">Continue to your Personal OS workspace.</p>

      <div className="auth-panel">
        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          {formError ? (
            <p className="auth-alert" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
              aria-invalid={Boolean(fieldErrors.email)}
              autoComplete="email"
              className="auth-input"
              id="login-email"
              name="email"
              onChange={handleChange}
              type="email"
              value={values.email}
            />
            {fieldErrors.email ? (
              <p className="auth-error" id="login-email-error">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              aria-describedby={
                fieldErrors.password ? 'login-password-error' : undefined
              }
              aria-invalid={Boolean(fieldErrors.password)}
              autoComplete="current-password"
              className="auth-input"
              id="login-password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {fieldErrors.password ? (
              <p className="auth-error" id="login-password-error">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button className="auth-submit" disabled={isBusy} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
