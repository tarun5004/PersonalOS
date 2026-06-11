# Performance, Scalability, Architecture, and UX Hardening Audit

Status: Baseline audit for engineering review  
Date: 2026-06-12  
Scope: Audit only. No Phase 8 work. No backend, auth, routing, state-management, or feature implementation changes.

## 1. Executive Summary

PersonalOS is stable enough for the next engineering-quality pass, but the current implementation is still closer to a working V1 shell than a production-scale application.

The strongest current points are:

- Route-level page splitting is already implemented with `React.lazy` and `Suspense`.
- API calls are centralized through `client/src/lib/apiClient.js`.
- Auth models include useful indexes for user email, refresh token hash, token family lookup, and refresh token TTL cleanup.
- The current app makes very few real API requests because only auth is implemented.

The biggest scalability and performance risks are:

- The dashboard loads the heavy Recharts chunk immediately, even though chart content is below the fold and often empty.
- TanStack Query is approved in docs but not installed or wired yet.
- No backend request-timing middleware, slow-request logging, or query-count instrumentation exists.
- No bundle visualizer, lint script, or type-check script exists.
- Future task/habit lists need pagination and virtualization before real large datasets are introduced.

## 2. Baseline Metrics

### Frontend Build

Command:

```text
cd client
npm.cmd run build
```

Result: passed.

Total production build artifact size:

```text
18 files, 813.59 KB uncompressed
```

Largest production assets:

| Asset | Size |
| --- | ---: |
| `ScoreChart-Bl9cK-c7.js` | 324.94 KB |
| `index-W5raCdtv.js` | 264.18 KB |
| `DashboardCard-CvP-G792.js` | 118.90 KB |
| `Card-DCGITRQC.js` | 36.24 KB |
| `index-q5QBIhXK.css` | 35.85 KB |
| `DashboardPage-DjZyxh0Z.js` | 7.97 KB |

Vite reported gzip sizes during build:

| Asset | Gzip |
| --- | ---: |
| `ScoreChart-Bl9cK-c7.js` | 99.01 KB |
| `index-W5raCdtv.js` | 87.05 KB |
| `DashboardCard-CvP-G792.js` | 39.55 KB |
| `Card-DCGITRQC.js` | 12.29 KB |
| `index-q5QBIhXK.css` | 7.14 KB |

### Lighthouse Baseline

Target:

```text
http://127.0.0.1:4173/login
```

Reason: Login is public and can be measured by Lighthouse without auth stubbing.

Result:

| Metric | Value |
| --- | ---: |
| Performance score | 98 |
| First Contentful Paint | 1.6 s |
| Largest Contentful Paint | 1.9 s |
| Speed Index | 1.8 s |
| Total Blocking Time | 70 ms |
| Cumulative Layout Shift | 0 |
| Time to Interactive | 1.9 s |

Report artifact generated locally:

```text
C:\tmp\personalos-lighthouse-login.json
```

### Protected Dashboard Browser Metrics

Target:

```text
http://127.0.0.1:4173/dashboard
```

Method: Playwright CLI with `/api/auth/refresh` stubbed for visual/performance measurement only. No app code was changed.

| Metric | Value |
| --- | ---: |
| FCP | 448 ms |
| LCP | 480 ms |
| DOM content loaded | 233.5 ms |
| Load event | 233.6 ms |
| Resource requests | 10 |
| JS requests | 7 |
| CSS requests | 1 |
| Decoded JS loaded | 754.17 KB |
| Decoded CSS loaded | 35.85 KB |

Initial dashboard JS assets loaded:

- `index-W5raCdtv.js`
- `Card-DCGITRQC.js`
- `DashboardPage-DjZyxh0Z.js`
- `ScoreChart-Bl9cK-c7.js`
- `DashboardCard-CvP-G792.js`
- `StatCard-CaWfks4M.js`
- `TaskCard-DQznx3F_.js`

### Route Transition Metrics

Transition:

```text
Dashboard -> Analytics
```

| Metric | Value |
| --- | ---: |
| Route latency | 726.1 ms |
| New resource requests after navigation | 2 |
| New JS requests after navigation | 1 |
| New decoded JS loaded | 2 KB |
| New JS asset | `AnalyticsPage-DuW_La7S.js` |

Interpretation: route-level code splitting works, but the initial dashboard load already includes heavy chart/shared chunks.

### Backend Response-Time Baseline

Environment: local development server on `127.0.0.1:5000`.

`GET /health`:

| Samples | Min | Average | Max |
| ---: | ---: | ---: | ---: |
| 10 | 2.17 ms | 25.12 ms | 190.59 ms |

`GET /api/auth/me` without auth:

| Samples | Min | Average | Max |
| ---: | ---: | ---: | ---: |
| 5 | 3.08 ms | 48.26 ms | 210.59 ms |

The first sample in each run was the slowest, likely due to local cold path or process scheduling. Warm responses were generally low single-digit to low double-digit milliseconds.

## 3. Frontend Audit Findings

### Route-Level Code Splitting

Status: mostly good.

Evidence:

- Major pages are lazy loaded in `client/src/app/routes/routeConfig.js`.
- `App.jsx` wraps routes in `Suspense`.
- Dashboard to Analytics route transition loaded only `AnalyticsPage-DuW_La7S.js`.

Risk:

- Shared imports can still pull large chunks into routes that do not need them immediately.

Recommendation:

- Keep route-level lazy loading.
- Add component-level lazy loading for charts and other heavy below-fold modules.

### Component Lazy Loading

Status: needs improvement.

Finding:

- `DashboardPage.jsx` imports `ScoreChart` directly.
- `ScoreChart.jsx` imports Recharts directly.
- The dashboard initial load includes `ScoreChart-Bl9cK-c7.js` at 324.94 KB uncompressed even when the chart is below the fold and empty.

Recommendation:

- Lazy load `ScoreChart` behind `React.lazy` or a local `LazyScoreChart` wrapper.
- Keep a lightweight skeleton or empty chart placeholder in the initial route.
- Consider moving chart-specific code into analytics-only paths until real dashboard chart data exists.

### Server-State Caching

Status: documented but not implemented.

Evidence:

- `docs/engineering/state-management.md` and ADR-0004 approve TanStack Query.
- `client/package.json` does not include `@tanstack/react-query`.
- No `QueryClient`, `useQuery`, or `useMutation` usage exists.

Current impact:

- Low for current functionality because only auth is implemented.

Future risk:

- Task, habit, dashboard, and analytics features will duplicate fetch/cache/loading logic if implemented before TanStack Query is wired.

Recommendation:

- Before Phase 8 task backend or real dashboard data, add TanStack Query provider and feature query patterns.
- Define query keys for `auth`, `tasks`, `habits`, `dashboard`, and `analytics`.
- Keep auth access token in memory; do not use TanStack Query as token storage.

### Request Deduplication

Status: acceptable today, incomplete for future features.

Current request behavior:

- Auth restore uses `POST /api/auth/refresh`.
- API client retries one failed 401 after a refresh attempt.
- No task/habit/dashboard/analytics API calls exist yet.

Risk:

- Future dashboard cards could independently request overlapping task and habit data.

Recommendation:

- Implement a single dashboard summary endpoint before wiring dashboard server data.
- Use TanStack Query query-key deduplication so multiple components share one request.

### Render Optimization

Status: no implementation change recommended yet.

Finding:

- There is no React Profiler evidence in this audit.
- Current pages are mostly static and small.
- `React.memo`, `useMemo`, and `useCallback` should not be added without profiling proof.

Recommendation:

- Re-profile once real lists and mutations exist.
- Apply memoization only to expensive repeated list items, chart transforms, and stable table rows.

### Virtualization

Status: not needed today, required before large real lists.

Finding:

- Current task and habit screens use placeholder/static data.
- No potentially large live list is implemented.

Recommendation:

- Do not install `@tanstack/react-virtual` yet.
- Add virtualization when real task/habit/activity lists can exceed roughly 100 visible rows or when profiling shows scroll/render pressure.

### Pagination Strategy

Status: must be designed before task/habit APIs scale.

Finding:

- Current docs mention API-level `limit` and `offset` for tasks.
- No frontend pagination/infinite-loading behavior exists yet.

Recommendation:

- Use cursor pagination for append-heavy activity feeds.
- Use page/limit or limit/offset for simple task lists only if sorting remains stable.
- Document query params before implementation.

### Bundle Optimization

Status: clear optimization target found.

Primary bottleneck:

- Recharts is the largest frontend payload contributor through `ScoreChart`.

Secondary bottleneck:

- `framer-motion` appears in a large shared chunk through `DashboardCard`.

Recommendation:

- Lazy load chart components.
- Reconsider whether all dashboard cards need `framer-motion`; subtle CSS transitions may be enough for base cards.
- Add `rollup-plugin-visualizer` in a later optimization chunk if maintainers approve a dev-only dependency.

## 4. Backend Audit Findings

### Implemented API Surface

Current routes:

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

No task, habit, dashboard, or analytics backend routes exist yet.

### Query Counts by Endpoint

Estimated from code inspection:

| Endpoint | Query/work count |
| --- | --- |
| `POST /api/auth/register` | `findOne` user, `create` user, `create` refresh token, bcrypt hash |
| `POST /api/auth/login` | `findOne` user with password hash, bcrypt compare, `create` refresh token |
| `POST /api/auth/refresh` | `findOne` refresh token, `findById` user, `create` refresh token, update old token |
| `POST /api/auth/logout` | `findOne` refresh token, update token if present |
| `GET /api/auth/me` | verify JWT, `findById` user |

No N+1 query patterns are present because there are no list endpoints yet.

### Indexes

Current useful indexes:

- `users.email` unique index.
- `refresh_tokens.tokenHash` unique index.
- `refresh_tokens.userId` index.
- `refresh_tokens.userId + familyId` compound index.
- `refresh_tokens.expiresAt` TTL index.

Potential future index considerations:

- Add task indexes by `userId`, status, due date, created date, and completion date after task schema is finalized.
- Add habit check-in indexes by `userId`, habit id, UTC day, and month after habit schema is finalized.
- Do not add undocumented indexes before collections exist.

### Observability

Status: missing.

Finding:

- No request-timing middleware.
- No slow-request logging.
- No query-count logging.
- No structured logger.
- Startup/shutdown uses direct `console.log` and `console.error`.

Recommendation:

- Add lightweight request timing middleware before feature APIs scale.
- Log method, path, status, duration, and request id.
- Add slow request threshold logging.
- Keep logs free of tokens, cookies, passwords, password hashes, and secrets.

### Rate Limiting

Status: good for V1 single-instance development, not multi-instance production.

Finding:

- `express-rate-limit` default in-memory store is not horizontally scalable.
- Login, register, and refresh share the same auth limiter.

Recommendation:

- Keep the current limiter for V1 local/self-hosting.
- Before multi-instance deployment, move to a shared store or edge/platform rate limiting.
- Consider a separate refresh limiter so normal session restore does not compete with register/login attempts.

## 5. Security Review

Strengths:

- Access token stays in frontend memory.
- Refresh token uses HttpOnly cookie.
- API client does not use localStorage or sessionStorage for auth tokens.
- Backend validates env values at startup.
- Helmet is enabled.
- CORS uses exact origin with credentials.
- Request validation uses Zod for auth payloads.
- Production 500 responses are sanitized.

Risks and follow-ups:

- No CSRF token implementation exists; V1 relies on same-site cookie behavior as documented.
- Refresh endpoint rate limiting can create noisy local QA and may affect users if limits are too low.
- No audit logging exists for suspicious refresh-token family reuse.
- No request id or structured error reporting exists.

No auth redesign is recommended in this audit chunk.

## 6. Developer Experience Findings

Strengths:

- Folder structure is understandable.
- Backend follows route -> middleware -> controller -> service -> model.
- Frontend routes are centralized.
- UI components are reusable and mostly theme-driven.

Gaps:

- No root convenience scripts.
- No lint script.
- No type-check script, which is expected because V1 is JavaScript, but there is no JS static-analysis substitute yet.
- No bundle-analysis script.
- No performance-report script.

Recommendation:

- Add linting only in a dedicated tooling chunk.
- Add a repeatable bundle-analysis command after choosing visualizer tooling.
- Keep npm as the package manager.

## 7. Recommended Optimization Chunks

### Chunk A: Frontend Payload Reduction

Goal: reduce initial dashboard JS payload.

Actions:

- Lazy load `ScoreChart`.
- Replace `framer-motion` in base cards with CSS transitions or load motion only where it creates measurable value.
- Re-run build, Lighthouse, and protected dashboard metrics.

Expected impact:

- Lower initial dashboard decoded JS.
- Lower parse/execute cost.
- Better future mobile performance.

### Chunk B: Server-State Foundation

Goal: prevent duplicated future fetch logic.

Actions:

- Install `@tanstack/react-query`.
- Add `QueryClientProvider`.
- Define query key conventions.
- Migrate auth restore only if it does not weaken token handling.
- Prepare task/habit/dashboard hooks before Phase 8 data work.

Expected impact:

- Request deduplication.
- Consistent loading/error states.
- Predictable invalidation.

### Chunk C: Observability Foundation

Goal: make the backend diagnosable.

Actions:

- Add request id and request timing middleware.
- Add slow request logging with sanitized metadata.
- Document thresholds.

Expected impact:

- Faster debugging.
- Evidence for future backend performance work.

### Chunk D: Scalable Data Access Design

Goal: avoid expensive future task/habit queries.

Actions:

- Finalize pagination strategy before task/habit APIs.
- Define indexes only after schemas are approved.
- Design `GET /api/dashboard` aggregation endpoint before dashboard server data.

Expected impact:

- Fewer network requests.
- Fewer database queries.
- Safer future scale path.

## 8. Final Metrics

No after-optimization metrics were collected in this chunk because implementation has not started.

This audit intentionally stops before optimization implementation so engineering review can approve the next chunk.

## 9. Validation Run

Frontend tests:

```text
cd client
npm.cmd test
```

Result: passed, 5 test files and 16 tests.

Backend tests:

```text
cd server
npm.cmd test
```

Result: passed, 3 test suites and 21 tests.

Frontend build:

```text
cd client
npm.cmd run build
```

Result: passed.

Lighthouse:

```text
npx.cmd --yes lighthouse http://127.0.0.1:4173/login --only-categories=performance
```

Result: passed with performance score 98.

Linting:

```text
Not run. No lint script exists.
```

Type checking:

```text
Not run. V1 is JavaScript and no type-check script exists.
```

## 10. Stop Condition

STOP - awaiting engineering review and approval before any optimization implementation.

Do not start Phase 8, backend feature work, AI features, or new product functionality from this audit.
