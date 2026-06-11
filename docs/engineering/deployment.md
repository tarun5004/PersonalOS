# Deployment

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Deployment Targets

V1 deployment options:

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or Fly.io
- Database: MongoDB Atlas
- Self-hosting: Docker Compose stub in Phase 1

No deployment provider is mandatory for V1.

## 2. Local Development

The frontend will run through Vite.

The backend will run through Node.js and Express.

During development, Vite will proxy `/api` requests to the backend. This avoids cross-origin issues during local development and keeps the frontend API client from hardcoding localhost.

Local development may use either MongoDB Atlas or a local MongoDB instance.

Recommended local fallback:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/personal-os
```

When using MongoDB Atlas, the URI must include an application database path, such as `/personal-os`, and the developer's current IP/network must be allowed by Atlas. If Atlas closes the connection during startup, switch the ignored local `server/.env` to the local MongoDB URI above until the Atlas network allowlist is fixed.

Real Atlas credentials must remain only in ignored local `.env` files.

## 3. Production API Base URL

In production, the frontend will read:

```text
VITE_API_BASE_URL
```

The API client must not hardcode `localhost`.

## 4. Server Environment Variables

Required server variables:

```text
NODE_ENV
PORT
MONGODB_URI
ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_COOKIE_NAME
REFRESH_TOKEN_MAX_AGE_MS=604800000
CLIENT_URL
CORS_ORIGIN
BCRYPT_SALT_ROUNDS
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX_REQUESTS
COOKIE_SECURE
COOKIE_SAME_SITE
```

`JWT_SECRET`, `JWT_EXPIRES_IN`, `COOKIE_NAME`, and `COOKIE_MAX_AGE_MS` are replaced by access-token and refresh-token-specific variables during the auth migration.

## 5. Client Environment Variables

Required client variable:

```text
VITE_API_BASE_URL
```

No auth token values belong in client environment variables.

## 6. Cookie and CORS Deployment Modes

### Same-Domain Deployment

Recommended V1 mode:

- `COOKIE_SAME_SITE=lax`
- `COOKIE_SECURE=true` in production
- `CORS_ORIGIN` set to exact frontend origin
- Refresh requests include credentials

### Cross-Domain Deployment

Allowed only with documented tradeoffs:

- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`
- `CORS_ORIGIN` set to exact frontend origin
- Frontend refresh/logout requests include credentials
- CSRF protection should be added before production use

## 7. Tailwind Build

V1 will use Tailwind CSS v4 through the frontend build.

The frontend will keep a single required global Tailwind CSS entry file. Component-level CSS files should be removed during the Tailwind migration unless an exception is documented.

## 8. Docker Compose Stub

Phase 1 will include a Docker Compose stub for self-hosting direction. It will not need to be a complete production orchestration system in V1.

## 9. Release Readiness

Before first open-source release:

- Root docs must describe setup scripts.
- `.env.example` must include all required variables.
- Real `.env` files must be ignored.
- Tests and build checks must pass according to the final release prep phase.
