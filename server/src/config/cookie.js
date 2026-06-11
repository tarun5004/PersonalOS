import { env } from './env.js';

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: env.COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

export function setAuthCookie(response, token) {
  response.cookie(env.COOKIE_NAME, token, getAuthCookieOptions());
}

export function clearAuthCookie(response) {
  const { maxAge, ...options } = getAuthCookieOptions();
  response.clearCookie(env.COOKIE_NAME, options);
}

