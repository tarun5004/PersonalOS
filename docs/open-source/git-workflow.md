# Git Workflow

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved docs

## 1. Branching

Use short-lived branches for focused changes.

Recommended branch names:

- `docs/phase-0c-open-source`
- `feat/tasks-backend`
- `fix/auth-cookie-options`
- `test/habit-streaks`

## 2. Commit Style

Use Conventional Commits.

Allowed types:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`
- `style`

Allowed scopes:

- `auth`
- `tasks`
- `habits`
- `analytics`
- `dashboard`
- `theme`
- `ui`
- `docs`
- `config`
- `tests`
- `deps`

Examples:

```text
docs(docs): add engineering security documentation
feat(auth): add cookie-based login endpoint
fix(habits): correct UTC streak calculation
test(tasks): add task validation failures
```

No other scopes should be used without discussion.

## 3. Small Commits

Prefer commits that represent one logical change. Avoid mixing docs, unrelated refactors, package changes, and feature implementation in one commit.

## 4. Protected Work

Do not rewrite or delete another contributor's work without discussion.

Do not use destructive Git operations unless explicitly requested and reviewed.

## 5. Phase Alignment

Every branch and commit should align with the active phase in `STEPS.md`.

If a change belongs to a later phase, leave it out and document the follow-up.
