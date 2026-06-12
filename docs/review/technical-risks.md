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

## 4. Refresh Cookie and CSRF Risk

Same-domain refresh-cookie deployments rely on `sameSite: "lax"` as the V1 CSRF mitigation for refresh and logout endpoints.

Most protected API mutations use access tokens in the `Authorization` header rather than cookie-only authentication.

Risk: Cross-domain refresh-cookie deployments require careful CORS, cookie, and CSRF configuration.

Mitigation:

- Prefer same-domain deployment when possible.
- Use exact `CORS_ORIGIN`.
- Require `secure: true` with `sameSite: "none"`.
- Add CSRF protection before production use if cross-domain refresh cookies are required.

## 5. Refresh Token Rotation Risk

V1 uses short-lived access tokens and rotated refresh tokens.

Risk: Token rotation, reuse detection, and revocation add backend complexity.

Mitigation:

- Store only refresh token hashes.
- Add tests for refresh success, refresh expiry, reuse detection, logout revocation, and access-token expiry.
- Keep token service logic explicit and well documented.

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

## 9. Premium UI Package Risk

The Next-Level OS track introduces shadcn/ui-derived primitives, Magic UI, Aceternity UI, motion, reward, and 3D libraries.

Risk: PersonalOS can start looking like a template collection instead of a coherent daily-use operating system.

Mitigation:

- Adapt every imported pattern into PersonalOS tokens and shared components.
- Avoid one-off animation and decorative effects.
- Lazy-load heavy visual experiences.
- Keep dashboard, tasks, habits, analytics, settings, login, and register readable without animations.

## 10. AI Asset Generation Risk

The Next-Level OS track introduces server-side OpenAI Images API usage with Cloudinary storage.

Risk: AI image generation adds cost, latency, abuse, prompt safety, and secret-management concerns.

Mitigation:

- Keep OpenAI API keys on the backend only.
- Validate and rate-limit image-generation requests.
- Store generated outputs in Cloudinary and return optimized delivery URLs.
- Never block core productivity workflows on image generation.
- Do not commit OpenAI or Cloudinary secrets.
