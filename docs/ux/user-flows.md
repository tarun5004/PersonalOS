# User Flows

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved architecture update for Tailwind/auth migration

## 1. Register

1. User opens Register.
2. User enters name, email, and password.
3. App validates form input.
4. App submits registration.
5. Backend creates the account, returns a short-lived access token, and sets a secure HttpOnly refresh-token cookie.
6. App stores the returned user and access token in in-memory auth state.
7. User lands on Dashboard.

Error path: If email already exists or validation fails, the form will show a clear inline error.

## 2. Login

1. User opens Login.
2. User enters email and password.
3. App validates form input.
4. App submits login.
5. Backend returns a short-lived access token and sets a secure HttpOnly refresh-token cookie.
6. App stores the returned user and access token in in-memory auth state.
7. User lands on Dashboard.

Error path: Invalid credentials will show a clear form-level error.

## 3. Restore Session

1. User opens the app after a previous login.
2. App calls `POST /api/auth/refresh` with credentials included.
3. If valid, backend rotates the refresh token and returns a new access token plus user.
4. App stores the returned user and access token in memory and shows the protected route.
5. If invalid or expired, app clears auth state and redirects to Login silently.

## 4. Logout

1. User selects Logout.
2. App sends logout request with credentials included.
3. Backend revokes the current refresh token when present and clears the refresh cookie.
4. App clears in-memory auth state.
5. User lands on Login.

Logout will be idempotent and should feel successful even if the cookie was already missing or expired.

## 5. Create Task

1. User opens Tasks.
2. User selects create task.
3. User enters title and optional fields.
4. App validates the form.
5. App submits the task with a valid access token.
6. Task list updates.
7. Dashboard and analytics-relevant cached data will refresh during implementation according to state-management docs.

Note: The exact definition of "today's tasks" will be finalized in Phase 0-B API and domain rules.

## 6. Complete Task

1. User opens Tasks.
2. User marks a task as Completed.
3. App submits the status change with a valid access token.
4. Task list updates.
5. Dashboard and analytics views reflect the new completion state.

## 7. Create Habit

1. User opens Habits.
2. User selects create habit.
3. User enters habit details.
4. App validates the form.
5. App submits the habit with a valid access token.
6. Habit list and grid update.

## 8. Habit Check-In

1. User opens Habits or Dashboard.
2. User marks a habit complete for the current UTC day.
3. App submits the check-in with a valid access token.
4. Habit UI updates completion state.
5. Current streak, longest streak, completion percentage, dashboard, and analytics update.

Rule: A habit can be marked completed once per day.

Note: Habit completion percentage edge cases, including habits created mid-month, will be finalized in Phase 0-B engineering domain rules.

## 9. View Dashboard

1. User opens Dashboard.
2. App loads today's task summary, today's habit summary, productivity score, current streak, and weekly overview chart.
3. Loading skeletons appear while data loads.
4. Empty states appear when there is no activity.
5. Error states provide a retry path where useful.

Note: The dashboard weekly overview chart will reuse the approved weekly analytics data contract rather than defining a separate scoring model.

## 10. Change Theme

1. User opens Settings.
2. User selects light or dark theme.
3. App applies the theme tokens through the Tailwind/theme architecture.
4. The selected theme persists according to the theme architecture defined in engineering docs.

Settings in V1 is limited to theme selection and basic authenticated user context where required. Full account management is out of scope.
