# Scalability Review

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, corrected Phase 0-B docs

## 1. V1 Scalability Goal

V1 should be reliable for a self-hosted or small hosted personal productivity app.

V1 is not designed for enterprise multi-tenant scale, real-time collaboration, or high-volume analytics.

## 2. Backend Scalability

The Express backend will use a monolithic structure with clear modules.

This is appropriate for V1 because:

- Feature scope is small.
- Business logic benefits from local service boundaries.
- Deployment is simpler.
- Contributors can understand the full system.

Potential future scaling options:

- Move heavy analytics into background jobs.
- Add caching for expensive summary queries.
- Split services only if usage patterns justify it.

## 3. Database Scalability

MongoDB indexes are planned for common V1 queries:

- `tasks`: `userId`, `userId + dueDate`, `userId + status`
- `refresh_tokens`: `tokenHash`, `userId + familyId`, `expiresAt`
- `habits`: `userId`
- `habit_check_ins`: `userId + habitId + date`, `userId + month`

These indexes support the expected dashboard, task, habit, and monthly grid queries.

Potential future needs:

- Historical analytics snapshots
- Archive or soft-delete strategy
- More granular date indexes
- Per-user timezone data

## 4. Frontend Scalability

The frontend will use:

- Route-based lazy loading
- TanStack Query caching
- Reusable components
- Feature folders
- Theme variables

This supports modular growth without introducing Redux or a large design-system dependency in V1.

## 5. Auth Scalability

V1 uses short-lived access tokens and rotated HttpOnly refresh-token cookies.

This supports better token revocation than a single long-lived token, while remaining smaller than enterprise auth.

Future scale may require:

- Global logout from all devices
- More detailed session management UI
- OAuth providers
- More granular authorization

## 6. Operational Scalability

V1 deployment targets are simple hosted services: Vercel or Netlify for frontend, Render/Railway/Fly.io for backend, and MongoDB Atlas for database.

Docker Compose will start as a stub for self-hosting direction, not a full production orchestration platform.

## 7. Scalability Conclusion

The V1 architecture is suitable for a focused open-source productivity dashboard.

The main scalability risks are not raw traffic, but scope creep, analytics history expectations, and date/timezone complexity.
