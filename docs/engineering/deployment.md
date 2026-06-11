# Deployment

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved Phase 0-A docs

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
JWT_SECRET
JWT_EXPIRES_IN=7d
CLIENT_URL
CORS_ORIGIN
BCRYPT_SALT_ROUNDS
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX_REQUESTS
COOKIE_NAME
COOKIE_MAX_AGE_MS=604800000
COOKIE_SECURE
COOKIE_SAME_SITE
```

## 5. Client Environment Variables

Required client variable:

```text
VITE_API_BASE_URL
```

## 6. Cookie and CORS Deployment Modes

### Same-Domain Deployment

Recommended V1 mode:

- `COOKIE_SAME_SITE=lax`
- `COOKIE_SECURE=true` in production
- `CORS_ORIGIN` set to exact frontend origin

### Cross-Domain Deployment

Allowed with documented tradeoffs:

- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`
- `CORS_ORIGIN` set to exact frontend origin
- Frontend requests include credentials

## 7. Docker Compose Stub

Phase 1 will include a Docker Compose stub for self-hosting direction. It will not need to be a complete production orchestration system in V1.

## 8. Release Readiness

Before first open-source release:

- Root docs must describe setup scripts.
- `.env.example` must include all required variables.
- Real `.env` files must be ignored.
- Tests and build checks must pass according to the final release prep phase.
