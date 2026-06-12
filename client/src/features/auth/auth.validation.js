import { DEFAULT_AVATAR_ID, isAvatarId, resolveAvatarId } from '../../utils/avatars.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value) {
  return !String(value || '').trim();
}

export function normalizeLoginValues(values) {
  return {
    email: String(values.email || '').trim().toLowerCase(),
    password: values.password || '',
  };
}

export function normalizeRegisterValues(values) {
  return {
    name: String(values.name || '').trim(),
    email: String(values.email || '').trim().toLowerCase(),
    password: values.password || '',
    avatarId: resolveAvatarId(values.avatarId || DEFAULT_AVATAR_ID),
  };
}

export function validateLoginForm(values) {
  const errors = {};

  if (isBlank(values.email) || !EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Valid email is required';
  }

  if (isBlank(values.password)) {
    errors.password = 'Password is required';
  }

  return errors;
}

export function validateRegisterForm(values) {
  const errors = {};

  if (isBlank(values.name)) {
    errors.name = 'Name is required';
  }

  if (!isAvatarId(values.avatarId)) {
    errors.avatarId = 'Choose an avatar';
  }

  return {
    ...errors,
    ...validateLoginForm(values),
  };
}

export function mapServerValidationErrors(errors = []) {
  return errors.reduce((fieldErrors, issue) => {
    const path = String(issue.path || '').replace(/^body\./, '');

    if (path && issue.message) {
      fieldErrors[path] = issue.message;
    }

    return fieldErrors;
  }, {});
}
