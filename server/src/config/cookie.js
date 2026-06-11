import { env } from './env.js';

export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: env.REFRESH_TOKEN_MAX_AGE_MS,
    path: '/',
  };
}

export function setRefreshCookie(response, token) {
  response.cookie(env.REFRESH_TOKEN_COOKIE_NAME, token, getRefreshCookieOptions());
}

export function clearRefreshCookie(response) {
  const { maxAge, ...options } = getRefreshCookieOptions();
  response.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, options);
}
