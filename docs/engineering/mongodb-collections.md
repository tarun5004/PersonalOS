# MongoDB Collections

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Overview

This document defines V1 MongoDB collections and indexes before implementation.

Approved V1 collections:

- `users`
- `refresh_tokens`
- `tasks`
- `habits`
- `habit_check_ins`

## 2. `users`

Purpose: Stores authenticated user accounts.

Fields:

- `_id`: MongoDB ObjectId
- `name`: user display name
- `email`: unique user email
- `passwordHash`: bcrypt password hash
- `createdAt`: account creation date
- `updatedAt`: account update date

Mongoose timestamps may be used to manage `createdAt` and `updatedAt`.

Indexes:

- Unique index on `email`

Response rule:

- API responses may include `{ _id, name, email, createdAt }`
- API responses must never include `passwordHash`

## 3. `refresh_tokens`

Purpose: Stores hashed refresh tokens for access-token renewal.

Fields:

- `_id`: MongoDB ObjectId
- `userId`: owner user id
- `tokenHash`: hash of the opaque refresh token
- `familyId`: token family id for rotation/reuse handling
- `expiresAt`: UTC expiry date
- `revokedAt`: optional UTC revocation date
- `replacedByTokenId`: optional id of the rotated replacement token
- `createdAt`: token creation date
- `updatedAt`: token update date

Optional implementation fields:

- `userAgent`: request user-agent snapshot for review/debugging
- `ipHash`: hashed IP value if maintainers decide it is useful
- `lastUsedAt`: UTC date of last successful refresh

Mongoose timestamps may be used to manage `createdAt` and `updatedAt`.

Indexes:

- Unique index on `tokenHash`
- Compound index on `userId + familyId`
- TTL index on `expiresAt`

Rules:

- Raw refresh tokens must never be stored.
- Refresh token rotation must revoke or replace the previous token.
- Reuse detection should revoke the related token family where practical.

## 4. `tasks`

Purpose: Stores user-owned tasks.

Fields:

- `_id`: MongoDB ObjectId
- `userId`: owner user id
- `title`: task title
- `description`: optional task description
- `priority`: Low, Medium, or High
- `dueDate`: UTC date used for daily calculations
- `status`: Todo, In Progress, or Completed
- `createdAt`: task creation date
- `updatedAt`: task update date

Mongoose timestamps may be used to manage `createdAt` and `updatedAt`.

Indexes:

- `userId`
- `userId + dueDate`
- `userId + status`

Query behavior:

- List endpoints default to 50 items.
- `limit` and `offset` will be supported.
- Dashboard "today's tasks" uses `userId + dueDate`.

## 5. `habits`

Purpose: Stores user-owned habits.

Fields:

- `_id`: MongoDB ObjectId
- `userId`: owner user id
- `name`: habit name
- `createdAt`: habit creation date
- `updatedAt`: habit update date

Mongoose timestamps may be used to manage `createdAt` and `updatedAt`.

Indexes:

- `userId`

Query behavior:

- Habit list queries must be scoped by `userId`.
- Habit mutations must verify ownership.

## 6. `habit_check_ins`

Purpose: Stores daily habit completions.

Fields:

- `_id`: MongoDB ObjectId
- `userId`: owner user id
- `habitId`: related habit id
- `date`: checked UTC day normalized to UTC midnight
- `month`: derived UTC month key for monthly queries
- `createdAt`: check-in creation date
- `updatedAt`: check-in update date

Mongoose timestamps may be used to manage `createdAt` and `updatedAt`.

Indexes:

- Unique compound index on `userId + habitId + date`
- Compound index on `userId + month`

Rules:

- The unique `userId + habitId + date` index enforces one completion per habit per UTC day.
- `month` will be derived from `date` so monthly grid queries can use the required `userId + month` index.
- Deleting a habit must delete related check-ins.

## 7. Index Review Checklist

- Refresh token lookup uses `tokenHash`.
- Refresh token cleanup uses TTL on `expiresAt`.
- Refresh token reuse handling uses `userId + familyId`.
- Task dashboard queries use `userId + dueDate`.
- Task status filters use `userId + status`.
- Habit list queries use `userId`.
- Habit duplicate check-in prevention uses `userId + habitId + date`.
- Habit monthly grid queries use `userId + month`.
