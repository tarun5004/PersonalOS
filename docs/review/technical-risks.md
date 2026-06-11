# Technical Risks

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, corrected Phase 0-B docs

## 1. UTC Day Boundary Risk

V1 uses UTC day boundaries for habit check-ins, streaks, dashboard daily summaries, and weekly analytics.

Risk: Users may expect local-day behavior, especially near midnight in their timezone.

Mitigation:

- Document the limitation clearly.
- Keep date helpers centralized.
- Add tests for UTC boundaries.
- Consider local timezone support after V1.

## 2. Habit Completion Percentage Risk

V1 uses total days in the selected month as the denominator. Habits created mid-month do not receive a reduced denominator.

Risk: New habits may look less successful in their first month.

Mitigation:

- Document this as a V1 limitation.
- Keep RULE-HABIT-05 unchanged in implementation.
- Revisit denominator behavior only through a future proposal.

## 3. Hard Delete Analytics Risk

Deleted tasks and habits are removed from live data and will no longer affect historical analytics.

Risk: Historical scores can change after deletion.

Mitigation:

- Document this limitation in product and engineering docs.
- Avoid presenting V1 analytics as immutable history.
- Consider historical snapshots or soft delete after V1 if needed.

## 4. Cookie Auth and CSRF Risk

Same-domain deployments rely on `sameSite: "lax"` as the V1 CSRF mitigation.

Cross-domain cookie deployment without CSRF tokens is a deliberate V1 tradeoff.

Risk: Cross-domain deployments require careful CORS and cookie configuration.

Mitigation:

- Prefer same-domain deployment when possible.
- Use exact `CORS_ORIGIN`.
- Require `secure: true` with `sameSite: "none"`.
- Avoid cross-domain cookie deployment unless required.

## 5. No Refresh Token Risk

V1 uses a 7-day JWT with no refresh tokens.

Risk: Users must log in again after expiry, and token invalidation options are limited.

Mitigation:

- Keep expiry short and documented.
- Restore session through `/api/auth/me`.
- Revisit refresh tokens after V1 if user needs justify it.

## 6. MongoDB Schema Discipline Risk

MongoDB is flexible, but V1 needs consistent shapes and indexes.

Risk: Inconsistent data fields or missing indexes can cause bugs and slow queries.

Mitigation:

- Use Mongoose schemas.
- Document collections and indexes before implementation.
- Validate writes with Zod.
- Scope protected queries by `userId`.

## 7. Scope Creep Risk

Personal OS has many possible future directions.

Risk: Adding post-MVP features too early can make V1 hard to finish.

Mitigation:

- Follow `STEPS.md`.
- Use feature proposals.
- Keep phases small.
- Stop when requirements are unclear.

## 8. Abstraction Risk

Reusable architecture can become over-engineered if abstractions are added too early.

Risk: Contributors may struggle with hidden magic or vague helpers.

Mitigation:

- Prefer explicit modules.
- Add abstractions only when they remove real duplication or complexity.
- Use comments to explain why important decisions exist.
