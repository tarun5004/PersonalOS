# Security

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved Phase 0-A docs

## 1. Authentication Policy

V1 will use cookie-based JWT authentication.

- JWT expiry: 7 days
- No refresh tokens in V1
- Token stored in an HttpOnly cookie
- Token never stored in localStorage or sessionStorage
- Frontend JavaScript must not directly read the token
- Backend sets the cookie on register and login
- Backend clears the cookie on logout
- Frontend restores auth state with `GET /api/auth/me`

## 2. Cookie Configuration

Required cookie options:

- `httpOnly: true`
- `secure: true` in production
- `maxAge: 604800000`
- `sameSite` controlled by `COOKIE_SAME_SITE`

`COOKIE_MAX_AGE_MS` must match `JWT_EXPIRES_IN` converted to milliseconds. Default:

```text
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE_MS=604800000
```

The server must fail fast at startup if these values mismatch.

## 3. CSRF Decision

V1 will not implement CSRF tokens.

For same-domain deployments, `sameSite: "lax"` is the primary CSRF mitigation.

For cross-domain deployments using `sameSite: "none"`, `secure: true` is required and CORS credentials configuration must be documented. This mode has a larger CSRF tradeoff and should be used deliberately.

Cross-domain cookie deployment without CSRF tokens is a deliberate V1 tradeoff and should be avoided unless required by the deployment setup.

## 4. CORS

CORS must use:

- `credentials: true`
- Exact allowed origin from `CORS_ORIGIN`
- No wildcard origin when credentials are enabled

## 5. Passwords

- Passwords will be hashed with bcrypt.
- `BCRYPT_SALT_ROUNDS` will come from environment variables.
- API responses must not include password hashes.
- Logs must not include passwords or password hashes.

## 6. Rate Limiting

`POST /api/auth/login` and `POST /api/auth/register` must be rate-limited.

V1 will use `express-rate-limit`. Redis is not required for V1.

## 7. Request Validation

Zod is preferred for:

- Auth request validation
- Task create and update validation
- Habit create and update validation
- Habit check-in validation where needed
- Query param validation
- Environment variable validation at startup

## 8. Error Handling

Backend error handling will use:

- `AppError`
- `ValidationError`
- `AuthError`
- `NotFoundError`
- `ConflictError`
- Async handler wrapper
- Global error middleware

Production responses must not include stack traces.

## 9. Protected Routes

Protected backend routes must verify the auth cookie and authenticated user.

Protected frontend routes must depend on restored auth state and redirect unauthenticated users to `/login`.

## 10. Known Limitations

### UTC Day Boundary

Habit streaks, habit check-ins, dashboard daily summaries, and weekly analytics will use UTC day boundaries in V1.

Local timezone day boundaries are not implemented in V1.

### Habit Completion Percentage

Habit completion percentage uses total days in the selected month as the denominator. Habits created mid-month do not receive a reduced denominator in V1.

### Deleted Data and Analytics

Deleted tasks and habits are removed permanently. Analytics are calculated from live data, so deleted records will no longer appear in historical scores.

### CSRF Tokens

CSRF tokens are not implemented in V1. Same-domain deployments rely on `sameSite: "lax"`.

Cross-domain cookie deployments without CSRF tokens should be avoided unless required. If used, the project must document the tradeoff and keep CORS origins exact.

## 11. Secrets

Real `.env` files must not be committed.

Required secrets and configuration values must be documented through `.env.example` during Phase 1.

## 12. Responsible Security Reporting

Security issues should be reported privately through the responsible security reporting process documented in root `SECURITY.md`.

Contributors should not open public issues for suspected vulnerabilities until maintainers have reviewed them.
