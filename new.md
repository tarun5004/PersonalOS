# Personal OS Current Command Tracker

Status: Active
Source of truth for this run: attached 12-agent overhaul command
Workflow: complete one task, verify it, mark it checked here, commit, then move to the next task.

## Run Rules

- Use this file as the active tracker for the current command.
- Ignore `STEPS.md` and `AGENTS.md` for task sequencing during this run.
- Keep system, developer, tool, sandbox, and safety policies in force.
- Keep real secrets out of commits.
- Do not stage ignored local `.env` files.
- Prefer small, logical commits.
- After each completed agent:
  1. Run that agent's required checks.
  2. Mark the task complete in this file.
  3. Add the commit hash in the task row.
  4. Commit the completed work.
  5. Continue to the next task.

## Agent Task Board

| # | Task | Status | Verification | Commit |
|---|---|---|---|---|
| 0 | Create current-command tracker | Complete | `new.md` created and committed | `d9ca268` |
| 0.1 | Save attached prompt requirements into tracker | Complete | Prompt outline and task details copied into `new.md` | This commit |
| 1 | Backend validation, sanitization, rate limits, request IDs, security headers | Complete | Agent 1 self-gate passed | `630a6a9` |
| 2 | Morgan HTTP logger and Pino structured logger | Complete | Agent 2 self-gate passed | `678a58f` |
| 3 | Design system theme and typography overhaul | Pending | Agent 3 self-gate | Pending |
| 4 | Sidebar professional redesign | Pending | Agent 4 self-gate | Pending |
| 5 | Topbar, navigation, and app shell polish | Pending | Agent 5 self-gate | Pending |
| 6 | Dashboard mission-control UI | Pending | Agent 6 self-gate | Pending |
| 7 | Tasks urgency layer and view redesign | Pending | Agent 7 self-gate | Pending |
| 8 | Habits behavior layer and square grid polish | Pending | Agent 8 self-gate | Pending |
| 9 | Analytics insight engine polish | Pending | Agent 9 self-gate | Pending |
| 10 | PWA installability and offline support | Pending | Agent 10 self-gate | Pending |
| 11 | Avatar system and profile/register integration | Pending | Agent 11 self-gate | Pending |
| 12 | Final audit and smoke test | Pending | Agent 12 final audit | Pending |

## Current Agent Notes

Active task: Agent 3 - Design system theme and typography overhaul.

## Saved Attached Prompt Snapshot

Attachment saved into this tracker:

- `C:\Users\varun\.codex\attachments\80f64576-ff55-4b0f-8aa2-01a013793749\pasted-text.txt`
- Line count: 2351
- Mode: multi-agent, self-approving, continuous until done.
- Final target: Agent 12 final audit reports `OVERALL: READY TO SHIP`.

Core execution order from prompt:

1. Backend validation, logging, security hardening.
2. Backend Morgan HTTP logger plus Pino structured logger.
3. Design system theme and typography overhaul.
4. Sidebar redesign.
5. Topbar, navigation, and global app shell polish.
6. Dashboard mission-control UI.
7. Tasks urgency layer and view redesign.
8. Habits behavior layer with square cells.
9. Analytics insight engine polish.
10. PWA installability and offline support.
11. SVG cartoon avatar system.
12. Final audit and smoke test.

Important implementation note:

- The prompt asks for broad code changes, package installs, UI redesign, backend hardening, PWA, and avatar work.
- Do not rely on memory. Use this section plus the attachment when implementing each agent.
- Keep safety/tool constraints active even though this tracker controls product scope.

## Detailed Prompt Requirements

### Agent 1 - Backend Validation And Security

Required changes:

- Add a Zod `validate(schema)` body middleware.
- Add a `validateQuery(schema)` query middleware.
- Validate every write endpoint before controllers run.
- Auth register schema from prompt includes `username`, `email`, `password`, and optional/default `avatarId`.
- Auth login schema validates normalized email and non-empty password.
- Task create/update schema from prompt includes title, description, status, priority, dueDate, estimatedMinutes, and tags.
- Task list query schema validates status, priority, limit, offset, and search.
- Habit create/update schema from prompt includes name, description, color, icon, and frequency.
- Habit check-in schema includes optional date and note.
- Add recursive XSS string sanitization with `xss`.
- Apply request body sanitization after JSON parsing and before routes.
- Add auth, write, and read rate limiters with explicit error shapes.
- Add request ID middleware using `x-request-id` or `randomUUID`.
- Set `X-Request-Id` response header.
- Verify Helmet, HSTS, and `app.disable('x-powered-by')`.
- Add explicit CORS preflight handling.

Agent 1 gate:

- Bad register payload returns `VALIDATION_ERROR`.
- Task read response includes rate-limit headers.
- `/health` includes security headers.
- `/health` includes `X-Request-Id`.

### Agent 2 - Backend Logging

Required changes:

- Install/use `pino`, `pino-pretty`, and `morgan`.
- Add `server/src/config/logger.js`.
- Add `server/src/middleware/httpLogger.js`.
- Pipe Morgan HTTP logs into Pino.
- Add request ID token to HTTP logs.
- Skip noisy health checks only if the prompt's gate still passes.
- Replace raw server `console.*` in source with structured logger calls.
- Add lifecycle logs for server startup, DB connection, auth events, failed login attempts, and unhandled route errors.
- Add `LOG_LEVEL` to validated env and env examples.
- Redact passwords, tokens, authorization headers, and cookies.

Agent 2 gate:

- Server request produces Pino/Morgan output.
- `server/src` has no raw `console.*` source usage.

### Agent 3 - Design System Theme And Typography

Required changes:

- Replace design tokens with the prompt's Notion-style token set.
- Use Inter-style typography, restrained card styling, and flat surfaces.
- Light page background is warm neutral.
- Dark page background is deep charcoal.
- Sidebar becomes light in light theme and dark in dark theme.
- Add or align global CSS reset.
- Remove random gradients, excessive shadows, hardcoded colors, and AI-template visual signals.
- Keep colors in CSS variables and approved token files, not scattered JSX.

Agent 3 gate:

- Light and dark tokens are applied.
- No hardcoded hex colors in JSX/JS except approved token/helper files.
- Typography, spacing, and card styling follow the prompt's theme contract.

### Agent 4 - Sidebar Redesign

Required changes:

- Sidebar width target: 240px.
- Light theme sidebar must be light; dark theme sidebar must be dark.
- Remove `Active session` text from sidebar.
- Use a professional workspace/user block.
- Use clear navigation sections and active states.
- Sidebar bottom should eventually show cartoon avatar plus username/email.
- Avoid oversized badges, heavy glow, and generic template styling.

Agent 4 gate:

- Sidebar renders correctly in light and dark themes.
- No `Active session` text remains.
- Navigation active/hover/focus states are clean.

### Agent 5 - Topbar And App Shell

Required changes:

- Polish topbar with compact navigation context.
- Keep the Pomodoro widget visible in the topbar.
- Avoid redundant logout in topbar if sidebar already has logout.
- Keep main content scroll behavior stable.
- Improve page content padding and hierarchy.
- Preserve routing and auth flow.

Agent 5 gate:

- Dashboard, tasks, habits, analytics, settings render inside polished shell.
- Topbar remains stable and responsive.
- No layout regressions.

### Agent 6 - Dashboard Mission Control

Required changes:

- Remove fake/static dashboard cards.
- Use real urgency signals: overdue tasks, streak risk, focus opportunity.
- Dynamic headline instead of static generic copy.
- Four stat cards: Tasks Today, Habit Streak, Score, Focus Today.
- Start focus quick action opens Pomodoro modal.
- No `Workspace prepared` or `Activity area ready` cards.
- Cards should feel data-rich and restrained.

Agent 6 gate:

- Dashboard has dynamic headline and real alert data.
- Four stat cards render.
- Start focus works.
- Fake cards are gone.

### Agent 7 - Tasks Urgency Layer

Required changes:

- Default task view should be list view, not Kanban.
- Provide list to board view toggle.
- Create task flow uses a Notion-style modal with large title input.
- Overdue tasks show red overdue text.
- Status circle click cycles task status.
- Keep task API integration, loading, empty, error, success states.
- Avoid duplicating API logic inside components.

Agent 7 gate:

- List view is default.
- Board toggle works.
- Create/edit/complete/delete still work.
- Overdue and status controls render correctly.

### Agent 8 - Habits Behavior Layer

Required changes:

- Habit grid cells are square, not round.
- Missed cells use red background plus X icon.
- Done cells use success styling plus check icon.
- Today's unchecked cell pulses with border animation.
- Color picker shows 8 swatches for add/edit.
- Insight bar uses compact property-style metrics.
- Streak at-risk banner appears after 6 PM with unchecked habits.

Agent 8 gate:

- No rounded habit cells.
- Missed cells are visibly red with X.
- Today pulse works.
- Color picker and insight bar render.

### Agent 9 - Analytics Insight Engine

Required changes:

- Header and cards use polished insight language.
- Insight cards use callout aesthetic.
- Charts use the approved theme tokens.
- Include score trend, task bars, habit consistency, and week-over-week views where data exists.
- Empty state shows progress toward insight unlock when data is insufficient.

Agent 9 gate:

- Insight feed renders real text from available data.
- Charts use token colors.
- Empty and data states both look intentional.

### Agent 10 - PWA And Offline

Required changes:

- Add `client/public/manifest.json`.
- Add service worker support, expected built `client/dist/sw.js`.
- Link manifest in `client/index.html`.
- Add install prompt component.
- Add offline indicator.
- Update README with offline-ready setup notes.
- Verify app can be installed and shows cached content offline where feasible.

Agent 10 gate:

- Manifest exists and is linked.
- Build produces service worker.
- Offline indicator renders.
- Browser devtools PWA checks pass where accessible.

### Agent 11 - Avatar System

Required changes:

- Add `client/src/utils/avatars.js` with 8 distinct SVG avatars.
- Add `AvatarDisplay` component.
- Add `AvatarPicker` component.
- Register page shows avatar picker before submit.
- Register sends/saves `avatarId`.
- Login restores avatar ID to localStorage when available.
- Sidebar shows cartoon avatar instead of initials.
- Settings profile section can change avatar.
- Avatar change updates UI immediately.

Agent 11 gate:

- 8 avatars render.
- Register picker works.
- Login/sidebar/settings avatar behavior works.
- Sidebar has no `Active session` text.

### Agent 12 - Final Audit

Automated checks from prompt:

- No `console.log`, `console.warn`, or `console.debug` in production source.
- No hardcoded hex colors in JSX/JS except approved token/helper files.
- No hardcoded localhost URLs in client source.
- No source test/spec files.
- No `__tests__` directories.
- No committed real `.env` files.
- No JWT/token storage in localStorage/sessionStorage.
- No `rounded-full` on habit cells.
- No `Active session` text in sidebar.
- Client build passes.
- Server env/startup check passes.
- Morgan/Pino logger present.
- Validate middleware present.
- Manifest exists.
- Service worker built.
- Avatar system present.

Manual smoke checks from prompt:

- Register with avatar picker.
- Login restores session and avatar.
- Dashboard dynamic urgency and Pomodoro quick action.
- Tasks list default, board toggle, modal, overdue display, status cycle.
- Habits square cells, red missed cells, today pulse, color picker, risk banner.
- Pomodoro topbar/sidebar presence, modal, countdown, tab title, navigation persistence, tone.
- Analytics insights and themed charts.
- Settings focus controls, avatar picker, appearance toggle.
- Theme persistence and no flash.
- PWA manifest, service worker, offline banner/cache behavior.
- Backend validation errors, health response, logs, and rate-limit headers.

Final report target:

- Agent 12 must report `OVERALL: READY TO SHIP` only after all checks pass.

## Completion Log

- Task 0: Created this tracker and committed it as `d9ca268`.
- Task 0.1: Saved the new attached prompt requirements into this tracker.
- Task 1: Added request IDs, XSS sanitization, validation metadata, read/write/auth limiters, explicit security headers, preflight handling, and schema support for the prompt's new auth/task/habit fields.
- Task 2: Added Pino structured logging, Morgan HTTP request logging, `LOG_LEVEL`, lifecycle logs, auth event logs, DB logs, and removed raw server console usage.

## Verification Log

### Agent 1

- Backend tests: `npm.cmd test -- --passWithNoTests` passed.
- Backend build script: `npm.cmd run build` passed.
- App import: passed.
- `git diff --check`: passed.
- Self-gate validation check: bad register payload returned HTTP 400 with `code: VALIDATION_ERROR`.
- Self-gate rate-limit check: `GET /api/tasks` returned `RateLimit` header and `X-Request-Id`.
- Self-gate security header check: `GET /health` returned `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, and `X-Request-Id`.
- Self-gate fingerprint check: `GET /health` did not return `X-Powered-By`.

### Agent 2

- Backend tests: `npm.cmd test -- --passWithNoTests` passed.
- Backend build script: `npm.cmd run build` passed.
- App import: passed.
- Raw console source check: `rg -n "console\\." server/src` returned no matches.
- Logger source check: `pino` and `morgan` found in server source.
- Self-gate HTTP logging check: `GET /health` emitted a Pino-pretty HTTP log line with request ID, method, path, status, and response time.
