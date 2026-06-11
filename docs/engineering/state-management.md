# State Management

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved Phase 0-A docs

## 1. State Strategy

Personal OS V1 will use:

- Local React state for small UI-only state.
- React Context for auth user and theme.
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

- Auth user state
- Theme state

Auth context will restore session by calling `GET /api/auth/me` on page load.

Theme context will apply light and dark theme selection according to the theme architecture docs.

## 4. TanStack Query

Use TanStack Query for all server state:

- Auth session restore where appropriate
- Tasks
- Habits
- Dashboard summary
- Weekly analytics

Query functions will call centralized API client functions. Components must not call raw endpoints directly.

## 5. Cache Invalidation Rules

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

## 6. URL Query Params

Filters will use URL query params where useful.

V1 task list supports `limit` and `offset` at the API level. UI filters must not invent undocumented backend query params.

## 7. Error Handling

API errors will be normalized by the API client. Feature hooks will expose loading, error, empty, and success states to UI components.

Expired auth sessions will be handled by detecting 401 responses, clearing auth state, and redirecting to `/login` where appropriate.

## 8. API Client Rule

All API calls will be centralized.

For V1 cookie-based auth, every request must include credentials:

```js
fetch(url, { credentials: "include" })
```

or, if Axios is approved:

```js
axios.create({ withCredentials: true })
```

The API client must not read JWTs from localStorage or sessionStorage.

## 9. Base URL Strategy

Development:

- Vite proxy will forward `/api` requests to the backend.
- The API client will not hardcode `localhost`.

Production:

- `VITE_API_BASE_URL` will provide the API base URL.
