# Functional Requirements

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Purpose

This document defines the V1 functional behavior for Personal OS before implementation begins.

Personal OS V1 will be a modular MERN productivity dashboard with authentication, tasks, habits, analytics, and theme support.

## 2. Authentication

### FR-AUTH-01: Register

The backend will expose `POST /api/auth/register`. A user will register with name, email, and password.

On success:

- The password will be hashed with bcrypt.
- A short-lived access token will be returned in the response body.
- A rotated refresh token will be set in a secure HttpOnly cookie.
- Only a hash of the refresh token will be stored in MongoDB.
- The response will include `{ _id, name, email, createdAt }`.
- The response will not include password, password hash, role, or refresh token.

If the email already exists, the API will return 409.

### FR-AUTH-02: Login

The backend will expose `POST /api/auth/login`. A user will log in with email and password.

On success:

- A short-lived access token will be returned in the response body.
- A rotated refresh token will be set in a secure HttpOnly cookie.
- The response will include `{ _id, name, email, createdAt }`.

Invalid credentials will return 401.

### FR-AUTH-03: Refresh Session

The backend will expose `POST /api/auth/refresh`.

The endpoint will use the HttpOnly refresh-token cookie to:

- Validate the refresh token hash.
- Reject expired, revoked, reused, or invalid refresh tokens.
- Rotate the refresh token.
- Return a new short-lived access token and safe user.

The frontend will call this endpoint on page load to restore auth state.

### FR-AUTH-04: Logout

The backend will expose `POST /api/auth/logout`.

Logout will revoke the current refresh token when present, clear the refresh cookie, and always return 200. Logout is idempotent, even if the cookie is missing or expired.

### FR-AUTH-05: Current User

The backend will expose `GET /api/auth/me`.

The endpoint requires a valid access token in the `Authorization` header. A valid access token returns the user. Missing, expired, or invalid access tokens return 401.

The frontend will clear auth state and redirect to `/login` when refresh fails or when protected API calls cannot be re-authorized.

## 3. Tasks

### FR-TASK-01: Task Fields

A task will include:

- `title`
- Optional `description`
- `priority`: Low, Medium, or High
- `dueDate`
- `status`: Todo, In Progress, or Completed

Each task belongs to one authenticated user.

### FR-TASK-02: Task CRUD

Authenticated users will be able to create, view, edit, delete, and update tasks.

Users must not read, update, or delete another user's tasks.

### FR-TASK-03: Task List Limits

Task list endpoints will use a default limit of 50 items per request.

The API will support `limit` and `offset` query params for future pagination.

### FR-TASK-04: Task Delete Behavior

Task deletion will be hard delete in V1. Deleted tasks will be permanently removed and will no longer affect analytics.

### FR-TASK-05: Today's Tasks Definition

For V1 dashboard and daily productivity calculations, "today's tasks" will mean tasks whose `dueDate` falls within the current UTC day:

- Start: current UTC date at `00:00:00.000`
- End: next UTC date at `00:00:00.000`, exclusive

Overdue tasks and future tasks may appear in task list filters, but they will not be counted in the dashboard's "today's tasks" summary unless their `dueDate` is the current UTC day.

## 4. Habits

### FR-HABIT-01: Habit Fields

A habit will include a `name` and will belong to one authenticated user.

### FR-HABIT-02: Habit CRUD

Authenticated users will be able to create, view, edit, and delete habits.

Users must not read, update, check in, or delete another user's habits.

### FR-HABIT-03: Daily Check-In

A habit can be marked completed once per UTC day.

Check-ins will use the UTC day boundary in V1. Local timezone boundaries are out of scope for V1.

### FR-HABIT-04: Current Streak

Current streak will equal consecutive completed UTC days counting backward from today. A missed day resets current streak to 0.

### FR-HABIT-05: Longest Streak

Longest streak will equal the maximum consecutive completed-day sequence across all recorded history.

### FR-HABIT-06: Completion Percentage

Completion percentage will use the Master Prompt V4 formula:

```text
completed days in selected month / total days in selected month * 100
```

For V1, habits created mid-month will still use the total days in the selected month as the denominator. Days before the habit existed will not be treated specially. This is a known V1 limitation and keeps RULE-HABIT-05 unchanged.

### FR-HABIT-07: Habit Delete Behavior

Habit deletion will be hard delete in V1.

Deleting a habit must also delete all related records in `habit_check_ins`.

## 5. Dashboard

### FR-DASH-01: Dashboard Summary

The backend will expose `GET /api/dashboard/summary`.

The endpoint will return today's snapshot for:

- Welcome/user context where required
- Today's task summary
- Today's habit summary
- Daily productivity score
- Current streak

The endpoint will not return weekly chart data.

### FR-DASH-02: Weekly Chart Source

The dashboard weekly overview chart will reuse `GET /api/analytics/weekly`.

The dashboard will not define a separate scoring model or a dashboard-specific weekly endpoint.

### FR-DASH-03: Dashboard Layout

The dashboard layout will be fixed in V1. It will be modular at the component and layout-definition level, not user-configurable through drag-and-drop.

## 6. Analytics

### FR-ANALYTICS-01: Weekly Analytics

The backend will expose `GET /api/analytics/weekly`.

Weekly overview will cover the last 7 days including today, using UTC day boundaries.

### FR-ANALYTICS-02: Daily Score

Daily score will use:

```text
Daily Score = (taskWeight * taskCompletionRate) + (habitWeight * habitCompletionRate)
```

Default weights:

- Tasks: 0.5
- Habits: 0.5

Fallbacks:

- If only habits exist: `productivityScore` equals `habitCompletionRate`
- If only tasks exist: `productivityScore` equals `taskCompletionRate`
- If both tasks and habits exist: `productivityScore` uses the weighted average
- If neither tasks nor habits exist: `productivityScore` is `null`

When score is `null`, the UI will show "No activity tracked today." Dashboard and analytics charts must not display 0 or 100 for this state.

### FR-ANALYTICS-03: Weekly Chart Gaps

Days with no tasks and no habits tracked will return `productivityScore: null`. The frontend will render a visual gap rather than 0.

## 7. Theme and Styling System

### FR-THEME-01: V1 Themes

V1 will support light and dark themes.

### FR-THEME-02: Tailwind and Theme Tokens

V1 will use Tailwind CSS v4 for styling.

UI colors and visual states will use semantic CSS variables exposed through Tailwind utilities. Components must not hardcode colors.

### FR-THEME-03: CSS File Scope

The frontend will keep only the required global Tailwind entry CSS file for Tailwind import, resets, theme variables, and global tokens.

Component-level CSS files should be removed during the Tailwind migration unless a documented exception is approved.

### FR-THEME-04: Settings Scope

Settings in V1 will be limited to theme selection and basic authenticated user context where required.

Full account management is out of scope.
