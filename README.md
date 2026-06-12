# Personal OS

A personal command center for tasks, habits, analytics, and focused work.

## What it does

- Task management: Todo, In Progress, and Completed task flow.
- Habit tracker: monthly grid, daily check-ins, streaks, and consistency score.
- Pomodoro focus timer: task-linked focus sessions and daily deep-work count.
- Dashboard: today's status, urgent attention, next actions, and weekly overview.
- Analytics: weekly productivity score, task and habit trends, and behavioral insights.
- Light and dark theme.

## Tech stack

- Frontend: React, Vite, React Router, TanStack Query, Recharts, Tailwind CSS v4.
- Backend: Node.js, Express, MongoDB, Mongoose, access-token auth, and HttpOnly refresh cookies.
- Tooling: npm, Vitest config, Jest config, Docker, Vercel, Railway-ready server Dockerfile.

## Local setup

### Requirements

- Node.js 18+
- MongoDB local or Atlas
- npm

### Steps

```bash
git clone [repo-url]
cd personal-os
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Fill `server/.env` with your MongoDB URI and strong secrets before starting the app.

## Environment variables

### Server

| Variable | Required | Default | Description |
|---|---:|---|---|
| `NODE_ENV` | yes | `development` | `development`, `test`, or `production`. |
| `PORT` | no | `5000` | Server port. |
| `MONGODB_URI` | yes | - | MongoDB connection string. |
| `ACCESS_TOKEN_SECRET` | yes | - | Minimum 32 characters. |
| `ACCESS_TOKEN_EXPIRES_IN` | yes | `15m` | Short-lived access token lifetime. |
| `CLIENT_URL` | yes | - | Frontend URL for deployment checks and CORS fallback. |
| `CORS_ORIGIN` | no | `CLIENT_URL` | Exact frontend origin for credentialed CORS. |
| `BCRYPT_SALT_ROUNDS` | yes | `12` | Password hashing cost. |
| `RATE_LIMIT_WINDOW_MS` | yes | `900000` | Auth route rate-limit window. |
| `RATE_LIMIT_MAX_REQUESTS` | yes | `20` | Auth route max requests per window. |
| `REFRESH_TOKEN_COOKIE_NAME` | yes | `personal_os_refresh` | HttpOnly refresh cookie name. |
| `REFRESH_TOKEN_MAX_AGE_MS` | yes | `604800000` | Refresh cookie lifetime. |
| `COOKIE_SECURE` | yes | `false` | Must be `true` in production. |
| `COOKIE_SAME_SITE` | yes | `lax` | Cookie SameSite mode. |

### Client

| Variable | Required | Default | Description |
|---|---:|---|---|
| `VITE_API_URL` | yes in production | `/api` | Backend API base URL. |
| `VITE_API_BASE_URL` | no | `/api` | Backward-compatible local API base URL. |
| `VITE_API_PROXY_TARGET` | no | `http://127.0.0.1:5000` | Vite dev proxy target. |

## Deployment

### Server: Railway

1. Connect the repository to Railway.
2. Set the service root directory to `/server`.
3. Use the included `server/Dockerfile`.
4. Add the required server environment variables in Railway.
5. Deploy and verify `/health`.

### Client: Vercel

1. Connect the repository to Vercel.
2. Set the project root directory to `/client`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_URL` pointing to the Railway API URL.
6. Deploy.

### Database: MongoDB Atlas

1. Create an Atlas cluster.
2. Create a database user.
3. Set the Atlas connection string as `MONGODB_URI` on Railway.
4. Configure network access for the Railway deployment.

## Project structure

```text
client/src/
  app/          App providers and route configuration
  components/   Shared layout and UI components
  features/     Auth, dashboard, tasks, habits, analytics, settings, theme, pomodoro
  hooks/        Shared client hooks
  lib/          API client and helpers
  styles/       Tailwind v4 entry and design tokens
  themes/       Theme-related assets
  utils/        Frontend constants and pure helpers

server/src/
  config/       Environment, database, and cookie configuration
  domain/       Pure scoring and habit date rules
  errors/       Application error types
  middleware/   Auth, validation, and error middleware
  modules/      Auth, tasks, habits, dashboard, analytics modules
  utils/        Backend utility helpers
```

## Useful scripts

```bash
npm run install:all
npm run dev
npm run build
npm run start
npm run health
```

## Offline and installable app

The client includes a web app manifest and production service worker. Run `npm run build` in `client/` or from the root build script to verify `client/dist/sw.js` is generated. Offline support is intentionally app-shell focused: cached screens can reopen, while fresh API data still requires the backend connection.

## Contributing

See `CONTRIBUTING.md`.

## Security

Report suspected vulnerabilities privately using `SECURITY.md`. Do not open public security issues until maintainers have reviewed them.

## License

MIT
