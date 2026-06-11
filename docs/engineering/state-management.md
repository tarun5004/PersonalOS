# State Management

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. State Strategy

Personal OS V1 will use:

- Local React state for small UI-only state.
- React Context for auth session and theme.
- TanStack Query for server state.
- URL query params for filters.

Redux will not be used in V1.

## 2. Local React State

Use local component state for:

- Modal open and close state
- Form inputs before submit
- Active tabs
- Small UI toggles
- Temporary component-only state

Local state must not be used as a duplicate source of truth for server data.

## 3. React Context

Use React Context for:

- Auth session state
- Theme state

Auth context will keep the access token in memory only. It must never write access tokens or refresh tokens to localStorage or sessionStorage.

Theme context will apply light and dark theme selection according to the theme architecture docs.

## 4. Auth Session Restore

On page load, the frontend will restore an auth session by calling:

```text
POST /api/auth/refresh
```

The request must include credentials so the browser sends the HttpOnly refresh-token cookie.

If refresh succeeds:

- Store the returned access token in auth context memory.
- Store the returned safe user in auth context.
- Allow protected routes to render.

If refresh fails:

- Clear in-memory auth state.
- Redirect protected routes to `/login`.

`GET /api/auth/me` requires an access token and is used only after an access token is available.

## 5. TanStack Query

Use TanStack Query for all server state:

- Auth session restore where appropriate
- Tasks
- Habits
- Dashboard summary
- Weekly analytics

Query functions will call centralized API client functions. Components must not call raw endpoints directly.

## 6. Cache Invalidation Rules

Required invalidation:

- Create task -> invalidate `tasks`, `dashboard`, `analytics`
- Update task -> invalidate `tasks`, `dashboard`, `analytics`
- Delete task -> invalidate `tasks`, `dashboard`, `analytics`
- Complete task -> invalidate `tasks`, `dashboard`, `analytics`
- Create habit -> invalidate `habits`, `dashboard`, `analytics`
- Update habit -> invalidate `habits`, `dashboard`, `analytics`
- Delete habit -> invalidate `habits`, `dashboard`, `analytics`
- Check in habit -> invalidate `habits`, `dashboard`, `analytics`

Additional invalidation may be added only when tied to documented behavior.

## 7. URL Query Params

Filters will use URL query params where useful.

V1 task list supports `limit` and `offset` at the API level. UI filters must not invent undocumented backend query params.

## 8. Error Handling

API errors will be normalized by the API client. Feature hooks will expose loading, error, empty, and success states to UI components.

Expired access tokens will be handled by detecting 401 responses, attempting one refresh-token rotation, retrying the original request once, and clearing auth state if refresh fails.

## 9. API Client Rule

All API calls will be centralized.

For bearer-protected API requests, the API client must attach:

```text
Authorization: Bearer <accessToken>
```

For refresh-cookie requests, the API client must include:

```js
fetch(url, { credentials: "include" })
```

The API client must not read tokens from localStorage or sessionStorage.

## 10. Base URL Strategy

Development:

- Vite proxy will forward `/api` requests to the backend.
- The API client will not hardcode `localhost`.

Production:

- `VITE_API_BASE_URL` will provide the API base URL.
