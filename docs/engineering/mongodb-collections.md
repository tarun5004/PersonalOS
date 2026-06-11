# MongoDB Collections

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved Phase 0-A docs

## 1. Overview

This document defines V1 MongoDB collections and indexes before implementation.

No collections other than `users`, `tasks`, `habits`, and `habit_check_ins` are approved for V1.

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

## 3. `tasks`

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

## 4. `habits`

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

## 5. `habit_check_ins`

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

## 6. Index Review Checklist

- Task dashboard queries use `userId + dueDate`.
- Task status filters use `userId + status`.
- Habit list queries use `userId`.
- Habit duplicate check-in prevention uses `userId + habitId + date`.
- Habit monthly grid queries use `userId + month`.
