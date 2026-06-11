import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  mapServerValidationErrors,
  normalizeRegisterValues,
  validateRegisterForm,
} from '../auth.validation.js';
import { useAuth } from '../useAuth.js';
import './AuthPages.css';

const initialValues = {
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
    <section className="auth-page">
      <p className="auth-eyebrow">Authentication</p>
      <h1>Create account</h1>
      <p className="auth-summary">Start your Personal OS workspace.</p>

      <div className="auth-panel">
        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          {formError ? (
            <p className="auth-alert" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="auth-field">
            <label htmlFor="register-name">Name</label>
            <input
              aria-describedby={fieldErrors.name ? 'register-name-error' : undefined}
              aria-invalid={Boolean(fieldErrors.name)}
              autoComplete="name"
              className="auth-input"
              id="register-name"
              name="name"
              onChange={handleChange}
              type="text"
              value={values.name}
            />
            {fieldErrors.name ? (
              <p className="auth-error" id="register-name-error">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              aria-describedby={
                fieldErrors.email ? 'register-email-error' : undefined
              }
              aria-invalid={Boolean(fieldErrors.email)}
              autoComplete="email"
              className="auth-input"
              id="register-email"
              name="email"
              onChange={handleChange}
              type="email"
              value={values.email}
            />
            {fieldErrors.email ? (
              <p className="auth-error" id="register-email-error">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              aria-describedby={
                fieldErrors.password ? 'register-password-error' : undefined
              }
              aria-invalid={Boolean(fieldErrors.password)}
              autoComplete="new-password"
              className="auth-input"
              id="register-password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {fieldErrors.password ? (
              <p className="auth-error" id="register-password-error">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button className="auth-submit" disabled={isBusy} type="submit">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}
