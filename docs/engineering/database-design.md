# Database Design

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Database Choice

Personal OS V1 will use MongoDB with Mongoose.

The database will store users, refresh tokens, tasks, habits, and habit check-ins.

## 2. Collection Names

V1 will use plural lowercase collection names with underscores where required:

- `users`
- `refresh_tokens`
- `tasks`
- `habits`
- `habit_check_ins`

`habit_check_ins` and `refresh_tokens` are the authoritative collection names.

## 3. Ownership Model

Tasks, habits, habit check-ins, and refresh tokens will belong to a user.

Every protected query must be scoped by authenticated `userId`. Services must prevent users from reading, updating, deleting, or checking in another user's data.

## 4. Relationships

### User to Refresh Tokens

One user can have many refresh tokens across devices or browser sessions.

Refresh token records store only token hashes, not raw token values.

### User to Tasks

One user can have many tasks. Each task belongs to one user.

### User to Habits

One user can have many habits. Each habit belongs to one user.

### Habit to Check-Ins

One habit can have many check-ins. Each check-in belongs to one habit and one user.

The check-in stores `userId` as well as `habitId` so user-scoped monthly queries do not need to join through habits.

## 5. Delete Behavior

V1 will use hard delete for tasks and habits.

### Users

Full account deletion is out of scope for V1.

### Refresh Tokens

Logout revokes the current refresh token when available. Expired refresh tokens may be removed by TTL index or cleanup process.

### Tasks

Deleting a task permanently removes it from the `tasks` collection.

### Habits

Deleting a habit permanently removes it from the `habits` collection and must also delete related `habit_check_ins`.

### Analytics Impact

Analytics are calculated from live data. Deleted tasks and habits will no longer appear in historical scores. This is a known V1 limitation.

## 6. Date Storage

All dates will be stored in UTC.

Habit check-in dates will be normalized to UTC midnight for the checked day.

Task `dueDate` will be interpreted using UTC day boundaries for dashboard and analytics calculations.

Refresh token expiry dates will be stored as UTC dates and indexed for cleanup.

## 7. Today's Task Query

The dashboard and daily score will query tasks where `dueDate` is within the current UTC day:

```text
dueDate >= startOfTodayUtc
dueDate < startOfTomorrowUtc
```

This keeps dashboard task summaries and analytics scoring aligned.

## 8. Habit Completion Percentage Edge Case

RULE-HABIT-05 uses total days in the selected month as the denominator.

For V1, a habit created mid-month still uses the total days in the month. Days before the habit existed are not excluded from the denominator. This is a known V1 limitation and should be documented for users and contributors.

## 9. Data Integrity Rules

- User email must be unique.
- Refresh token hashes must be stored instead of raw refresh tokens.
- Refresh tokens must be revocable and expire.
- A habit can have at most one check-in per user, habit, and UTC date.
- Services must enforce ownership before mutation.
- Services must handle habit check-in cascade deletion.
- API responses must not expose password hashes or raw refresh tokens.
- MongoDB models may use Mongoose timestamps for `createdAt` and `updatedAt`.
