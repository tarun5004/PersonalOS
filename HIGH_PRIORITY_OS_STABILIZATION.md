# PersonalOS High Priority Stabilization

Status: Active implementation checklist
Purpose: Keep the current high-priority request explicit, reviewable, and safe.

## Operating Prompt

Act like a senior product engineer and prompt engineer:

- Diagnose before rewriting.
- Keep PersonalOS lightweight, secure, and scalable.
- Prefer focused fixes over framework migration.
- Do not commit secrets.
- Preserve the current React/Vite architecture unless a migration has a proven benefit.
- Make the app feel cohesive across light and dark themes.
- Verify habit edit/delete because it is high priority.
- Remove only verified dead code.

## Current Decisions

- Do not migrate to Next.js in this chunk. The current app is a Vite SPA with PWA/offline capability and route-level code splitting; moving to Next.js would add migration risk without solving the current theme, Cloudinary, or habit action issues.
- Keep Cloudinary credentials server-side only. Local `.env` can be configured by the developer, but real keys must not be committed.
- Apply the requested palette through semantic CSS variables so the whole app inherits it.
- Keep tests/config files unless they are verified dead or explicitly harmful.

## Tasks

- [x] Apply requested punch red / honeydew / frosted blue / cerulean / oxford navy palette globally.
- [x] Define a matching dark theme with the same palette family.
- [x] Explain and improve the Cloudinary-not-configured error state.
- [x] Verify habit create, edit, delete, and check-in flows.
- [x] Make habit edit/delete actions discoverable on desktop and mobile.
- [x] Run frontend tests and build.
- [x] Run backend tests/build if backend files are changed.
- [x] Run browser QA for login, register, dashboard, habits, settings, and Cloudinary UI state.
- [x] Run static audits for secrets, hardcoded JSX colors, and dead/test file state.
- [x] Commit with a clear message after checks pass.

## Cloudinary Error Autopsy

Observed UI: `Cloudinary is not configured`.

Cause: backend upload code requires:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The local ignored `server/.env` did not define those variable names during inspection. The app should keep secrets out of git and make the settings UI clear when custom uploads require local/server environment configuration.

## Scalability Review Notes

- Current stack can remain scalable for V1 if API calls stay centralized, server state stays in TanStack Query, and heavy visual features stay lazy/optional.
- Offline-first improvements should build on the existing PWA/service-worker direction instead of a framework rewrite.
- Next.js is not required for the current SPA dashboard use case.

## QA Notes

- Browser QA verified login, register, dashboard, habits, settings, theme persistence, habit create/edit/delete, and mobile dashboard overflow.
- The Cloudinary missing-config test intentionally triggers one `503` network response because the server-side Cloudinary env is not configured. The UI now shows the exact missing env names and no secret is exposed.
- `client/src/test/setup.js` remains because it is test environment setup, not a test/spec file.
