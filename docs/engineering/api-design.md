# API Design

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved Phase 0-A docs

## 1. API Principles

- All backend routes will be mounted under `/api`, except `GET /health`.
- API responses will use one consistent success shape and one consistent error shape.
- Protected routes will use the HttpOnly auth cookie.
- Frontend API calls will include credentials.
- Controllers will stay thin and delegate business logic to services.

## 2. HTTP Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Success for GET, PUT, PATCH, DELETE |
| 201 | Created for POST |
| 400 | Validation error or bad request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Conflict |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## 3. Response Shapes

Success:

```json
{
  "success": true,
  "data": {}
}
```

The success response `message` is optional unless the endpoint has no returned data. Endpoints that do not return data, such as delete and logout responses, should include a clear `message`.

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

500 responses must not leak sensitive details in production.

## 4. Auth Routes

### `POST /api/auth/register`

Request:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password"
}
```

Success: 201

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "string",
      "name": "User Name",
      "email": "user@example.com",
      "createdAt": "ISO date"
    }
  }
}
```

Errors:

- 400 for validation failure
- 409 for duplicate email
- 429 for rate limit exceeded

### `POST /api/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Success: 200. Sets HttpOnly auth cookie and returns `{ user }`.

Errors:

- 400 for validation failure
- 401 for invalid credentials
- 429 for rate limit exceeded

### `POST /api/auth/logout`

Request body: none

Success: 200

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

Logout is idempotent.

### `GET /api/auth/me`

Success: 200 with `{ user }`

Errors:

- 401 for missing, expired, or invalid cookie

## 5. Task Routes

All task routes require authentication.

### `GET /api/tasks`

Query params:

- `limit`: optional, defaults to 50
- `offset`: optional, defaults to 0

Success: 200 with task list.

### `POST /api/tasks`

Request:

```json
{
  "title": "Task title",
  "description": "Optional description",
  "priority": "Medium",
  "dueDate": "ISO date",
  "status": "Todo"
}
```

Success: 201 with created task.

### `GET /api/tasks/:id`

Success: 200 with task.

Errors:

- 404 if the task does not exist for the authenticated user

### `PATCH /api/tasks/:id`

Request: partial task fields to update according to validation schema.

Success: 200 with updated task.

### `DELETE /api/tasks/:id`

Success: 200.

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

Behavior: hard delete.

## 6. Habit Routes

All habit routes require authentication.

### `GET /api/habits`

Success: 200 with habit list and derived values needed by the V1 UI.

Each habit item may include:

- `todayCompleted`
- `currentStreak`
- `longestStreak`
- `completionPercentage`

Derived values use UTC day-boundary rules and the selected/default month used by the habit UI.

### `POST /api/habits`

Request:

```json
{
  "name": "Read"
}
```

Success: 201 with created habit.

### `GET /api/habits/:id`

Success: 200 with habit details.

### `PATCH /api/habits/:id`

Request:

```json
{
  "name": "Read"
}
```

Success: 200 with updated habit.

### `DELETE /api/habits/:id`

Success: 200.

```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

Behavior: hard delete habit and related `habit_check_ins`.

### `POST /api/habits/:id/check-in`

Request body: none for V1. The server determines the current UTC day.

Success: 201 with check-in result.

Errors:

- 400 for invalid request
- 404 if the habit does not exist for the authenticated user
- 409 if the habit is already completed for the current UTC day

## 7. Dashboard Routes

### `GET /api/dashboard/summary`

Requires authentication.

Success: 200

Data will include today's snapshot:

- Today's tasks summary using the UTC `dueDate` rule
- Today's habits summary using UTC check-ins
- Daily productivity score or `null`
- Current streak

This endpoint will not return weekly chart data.

## 8. Analytics Routes

### `GET /api/analytics/weekly`

Requires authentication.

Success: 200

Data will include the last 7 UTC days including today. Each day will include:

- `date`
- `label`
- `taskCompletionRate`
- `habitCompletionRate`
- `productivityScore`

If a day has no tasks and no habits, `productivityScore` will be `null`.

The dashboard weekly chart will use this endpoint.

## 9. Health Check

### `GET /health`

Does not require authentication.

Success: 200 with basic service health information.
