# Security

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Authentication Policy

V1 will use access-token + refresh-token authentication.

- Access tokens are short-lived bearer JWTs.
- Refresh tokens are long-lived, opaque, rotated, and stored only as hashed values in MongoDB.
- Refresh tokens are sent to the browser only through a secure HttpOnly cookie.
- Frontend JavaScript may keep the access token in memory only.
- Access tokens and refresh tokens must never be stored in localStorage or sessionStorage.
- Backend protected APIs validate the `Authorization: Bearer <accessToken>` header.
- Frontend restores sessions by calling the refresh endpoint with credentials included.
- Logout revokes the current refresh token when present and clears the refresh cookie.

## 2. Token Lifetime

Default V1 lifetimes:

```text
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_MAX_AGE_MS=604800000
```

The refresh token cookie max age should match the stored refresh token expiry. The server must fail fast when required token or cookie configuration is missing or invalid.

## 3. Refresh Token Rotation

Refresh token rotation is required in V1.

On register, login, and refresh:

1. The backend issues a new short-lived access token.
2. The backend creates a new opaque refresh token.
3. The backend stores only a hash of the refresh token.
4. The backend sends the refresh token in an HttpOnly cookie.
5. On refresh, the previous refresh token is revoked or marked as replaced.

If refresh token reuse is detected, the backend should revoke the related token family where practical and require the user to log in again.

## 4. Cookie Configuration

Required refresh cookie options:

- `httpOnly: true`
- `secure: true` in production
- `sameSite` controlled by `COOKIE_SAME_SITE`
- `maxAge` controlled by `REFRESH_TOKEN_MAX_AGE_MS`

The refresh cookie is the only authentication token stored in a browser cookie.

## 5. CSRF Decision

Most protected API mutations use the access token in the `Authorization` header and are not authenticated by cookies alone.

Refresh and logout endpoints rely on the refresh cookie. Recommended V1 deployment is same-domain or same-site with:

```text
COOKIE_SAME_SITE=lax
COOKIE_SECURE=true in production
```

Cross-domain cookie deployment using `sameSite: "none"` requires `secure: true`, exact credentialed CORS, and should add CSRF protection before production use. Cross-domain refresh-cookie deployment without CSRF protection is not recommended.

## 6. CORS

CORS must use:

- `credentials: true` for refresh and logout requests
- Exact allowed origin from `CORS_ORIGIN`
- No wildcard origin when credentials are enabled

Frontend API calls must include credentials when calling refresh-cookie endpoints.

## 7. Passwords

- Passwords will be hashed with bcrypt.
- `BCRYPT_SALT_ROUNDS` will come from environment variables.
- API responses must not include password hashes.
- Logs must not include passwords or password hashes.

## 8. Rate Limiting

`POST /api/auth/login`, `POST /api/auth/register`, and `POST /api/auth/refresh` must be rate-limited.

V1 will use `express-rate-limit`. Redis is not required for V1.

## 9. Request Validation

Zod is preferred for:

- Auth request validation
- Task create and update validation
- Habit create and update validation
- Habit check-in validation where needed
- Query param validation
- Environment variable validation at startup

## 10. Error Handling

Backend error handling will use:

- `AppError`
- `ValidationError`
- `AuthError`
- `NotFoundError`
- `ConflictError`
- Async handler wrapper
- Global error middleware

Production responses must not include stack traces.

## 11. Protected Routes

Protected backend routes must verify a valid access token and authenticated user.

Protected frontend routes must depend on restored auth state and redirect unauthenticated users to `/login`.

## 12. Known Limitations

### UTC Day Boundary

Habit streaks, habit check-ins, dashboard daily summaries, and weekly analytics will use UTC day boundaries in V1.

Local timezone day boundaries are not implemented in V1.

### Habit Completion Percentage

Habit completion percentage uses total days in the selected month as the denominator. Habits created mid-month do not receive a reduced denominator in V1.

### Deleted Data and Analytics

Deleted tasks and habits are removed permanently. Analytics are calculated from live data, so deleted records will no longer appear in historical scores.

### Refresh Token Storage

V1 stores hashed refresh tokens in MongoDB. Global logout from all devices may be added later if not completed during the auth migration chunk.

## 13. Secrets

Real `.env` files must not be committed.

Required secrets and configuration values must be documented through `.env.example`.

## 14. Responsible Security Reporting

Security issues should be reported privately through the responsible security reporting process documented in root `SECURITY.md`.

Contributors should not open public issues for suspected vulnerabilities until maintainers have reviewed them.
