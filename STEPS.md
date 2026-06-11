# Personal OS Build Steps

Status: Draft control document  
Workflow: Docs-first, phase-based, chunk-by-chunk  
Source of truth: Master Prompt V4

## 0. Current Control Chunk

The developer explicitly requested a small control/setup chunk before continuing Phase 0-B:

- Add `.gitignore`
- Add `STEPS.md`
- Add an agent instruction file to reduce hallucination and coordination bugs

This chunk does not approve or start Phase 0-B. Phase 0-A product and UX docs still need developer review.

## 1. Operating Rules

- Work one phase at a time.
- Split large phases into small chunks when useful.
- Stop after every chunk when review is requested.
- Stop after every phase and wait for approval.
- Do not start the next phase unless the developer explicitly says `Proceed to Phase X` or `Proceed to next phase`.
- Do not touch unrelated files.
- Do not install packages unless the active phase allows it.
- Do not write implementation code during documentation phases.
- If requirements are unclear, ask before assuming.

## 2. Developer Commands

- `Proceed to Phase X`: start the named phase if prior dependencies are approved.
- `Proceed to next phase`: start the next phase if the previous phase is approved.
- `Review current phase`: inspect current phase output and report findings.
- `Fix current phase`: modify only files allowed in the active phase.

## 3. Phase Completion Report

Every phase must end with:

```text
Summary:
Files changed:
Architecture layer impact:
Validation added:
Security considerations:
State/cache behavior:
Tests added:
Manual QA steps:
Docs updated:
Known limitations:
What was intentionally not included:
Stop condition: STOP - awaiting developer approval for Phase [X+1]
```

## 4. Blocked Report

If blocked mid-phase, stop and report:

```text
BLOCKED REPORT
Phase: [X]
Blocker: [what is unclear or missing]
Doc gap: [which doc is missing the needed info]
Question for developer: [specific question]
Suggested resolution: [your suggested answer]
```

Do not push through a blocker silently.

## 5. Global Acceptance Checklist

A chunk is not complete until it:

- Matches Master Prompt V4 and approved docs.
- Follows the 4-layer architecture where implementation exists.
- Avoids unrelated changes.
- Uses reusable components, hooks, services, and domain helpers where appropriate.
- Includes validation where required.
- Includes centralized error handling where required.
- Handles loading, empty, error, and success states where relevant.
- Uses theme variables for UI colors.
- Avoids hardcoded secrets.
- Adds tests where the phase requires tests.
- Includes manual QA notes.

## 6. Phase Plan

### Phase 0-A: Product and UX Documentation

Goal: Define the product and UX foundation before implementation.

Files allowed:

- `docs/product/PRD.md`
- `docs/product/personas.md`
- `docs/product/user-stories.md`
- `docs/product/mvp-scope.md`
- `docs/product/post-mvp-scope.md`
- `docs/product/roadmap.md`
- `docs/ux/information-architecture.md`
- `docs/ux/user-flows.md`
- `docs/ux/dashboard-wireframe.md`
- `docs/ux/habit-tracker-ux.md`
- `docs/ux/theme-system-ux.md`

Files not allowed:

- Application code
- `client/`
- `server/`
- `docs/engineering/`
- `docs/open-source/`
- `docs/architecture/`
- `docs/review/`

Documentation dependency: Master Prompt V4.

Implementation tasks:

- Create product docs.
- Create UX docs.
- Use forward-facing planning language.
- Capture V1 scope and explicit non-goals.

Acceptance criteria:

- All required product and UX docs exist.
- V1 scope is clear.
- Screenshot references are captured only as UX inspiration, not scope expansion.
- No engineering or implementation files are created.

Security requirements:

- Auth expectations may be described only at product or UX level.
- Detailed security design waits for Phase 0-B.

Validation requirements:

- No runtime validation.
- Docs must not invent fields outside Master Prompt V4.

Testing requirements:

- No tests.

Manual QA checklist:

- Review docs for scope accuracy.
- Confirm no V1 exclusions were accidentally added as features.

Stop condition: STOP - awaiting developer approval for Phase 0-B.

### Phase 0-B: Engineering Documentation

Goal: Define engineering behavior and architecture before code.

Files allowed:

- `docs/engineering/functional-requirements.md`
- `docs/engineering/non-functional-requirements.md`
- `docs/engineering/database-design.md`
- `docs/engineering/mongodb-collections.md`
- `docs/engineering/api-design.md`
- `docs/engineering/folder-structure.md`
- `docs/engineering/component-architecture.md`
- `docs/engineering/state-management.md`
- `docs/engineering/theme-system-architecture.md`
- `docs/engineering/security.md`
- `docs/engineering/deployment.md`

Files not allowed:

- Application code
- Root release files
- ADR files
- Open-source process docs

Documentation dependency: Approved Phase 0-A docs and Master Prompt V4.

Implementation tasks:

- Document functional and non-functional requirements.
- Document database collections, indexes, and hard delete behavior.
- Document API contracts and response formats.
- Document frontend and backend folder structure.
- Document component, state, theme, security, and deployment architecture.

Acceptance criteria:

- Engineering docs cover auth, tasks, habits, dashboard, analytics, theme, deployment, security, validation, error handling, and state/cache behavior.
- MongoDB collections use `users`, `tasks`, `habits`, and `habit_check_ins`.
- API routes are all under `/api` except `GET /health`.
- No implementation code is added.

Security requirements:

- Document HttpOnly cookie auth, env validation, CORS, rate limiting, Helmet, and CSRF tradeoff.

Validation requirements:

- Document Zod validation for env and write requests.

Testing requirements:

- Document required backend, frontend, and domain tests.

Manual QA checklist:

- Cross-check engineering docs against Phase 0-A scope.
- Verify no post-MVP features entered V1 architecture.

Stop condition: STOP - awaiting developer approval for Phase 0-C.

### Phase 0-C: Open Source Docs, ADRs, and Review Docs

Goal: Define contribution process, architecture decisions, and review risks before setup.

Files allowed:

- `docs/open-source/contributing.md`
- `docs/open-source/git-workflow.md`
- `docs/open-source/coding-standards.md`
- `docs/open-source/feature-proposals.md`
- `docs/open-source/pull-request-workflow.md`
- `docs/architecture/adr/0001-use-mern-stack.md`
- `docs/architecture/adr/0002-use-javascript-for-v1.md`
- `docs/architecture/adr/0003-use-css-variables-for-theming.md`
- `docs/architecture/adr/0004-use-tanstack-query-for-server-state.md`
- `docs/architecture/adr/0005-avoid-redux-in-v1.md`
- `docs/architecture/adr/0006-use-layered-backend-architecture.md`
- `docs/architecture/adr/0007-use-utc-day-boundary-for-streaks.md`
- `docs/architecture/adr/0008-use-7-day-jwt-no-refresh-in-v1.md`
- `docs/architecture/adr/0009-use-mit-license.md`
- `docs/architecture/adr/0010-use-http-only-cookie-auth.md`
- `docs/architecture/adr/0011-use-npm-as-package-manager.md`
- `docs/architecture/adr/0012-use-conventional-commits.md`
- `docs/review/technical-risks.md`
- `docs/review/scalability.md`
- `docs/review/final-architecture-review.md`

Files not allowed:

- Application code
- Root release files unless explicitly requested
- Package manifests

Documentation dependency: Approved Phase 0-A and Phase 0-B docs.

Implementation tasks:

- Create open-source workflow docs.
- Create all required ADRs with Context, Decision, Alternatives considered, Consequences, and Status.
- Create technical risk, scalability, and final architecture review docs.

Acceptance criteria:

- All ADRs 0001 through 0012 exist.
- Contributor process is clear for future PRs.
- Technical risks and scalability limitations are documented.

Security requirements:

- Open-source docs include responsible security reporting expectations at process level.

Validation requirements:

- No runtime validation.
- ADR decisions must align with Master Prompt V4.

Testing requirements:

- No tests.

Manual QA checklist:

- Confirm every required ADR is present.
- Confirm ADRs do not document feature behavior rules that belong in engineering docs.

Stop condition: STOP - awaiting developer approval for Phase 1.

### Phase 1: Repository Setup

Goal: Add root repository files and project setup foundations.

Files allowed:

- `README.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `LICENSE`
- `.env.example`
- `.gitignore`
- `docker-compose.yml`
- Optional root `package.json` for convenience scripts only

Files not allowed:

- Feature implementation code
- `client/src/`
- `server/src/`

Documentation dependency: Approved Phase 0 docs.

Implementation tasks:

- Add required open-source root files.
- Add MIT license.
- Add root `.env.example` with server and client variables.
- Add Docker Compose stub.
- Add optional convenience npm scripts if approved.

Acceptance criteria:

- Required root files exist.
- No real secrets are committed.
- No workspace tooling is introduced.

Security requirements:

- `.env.example` documents required env vars without secrets.
- Security policy matches V1 scope.

Validation requirements:

- No runtime validation yet.

Testing requirements:

- No tests required.

Manual QA checklist:

- Confirm repo files render correctly.
- Confirm `.gitignore` protects env files and generated artifacts.

Stop condition: STOP - awaiting developer approval for Phase 2.

### Phase 2: Frontend App Setup

Goal: Initialize the React Vite frontend foundation.

Files allowed:

- `client/`
- Root scripts only if needed

Files not allowed:

- Backend implementation
- Real feature API integration

Documentation dependency: Approved Phase 0 engineering docs and Phase 1 setup.

Implementation tasks:

- Initialize Vite React JavaScript app.
- Add React Router foundation.
- Add project folder structure.
- Add route-based lazy loading foundation.
- Add temporary mock data only where allowed.

Acceptance criteria:

- Frontend starts locally.
- Routes render placeholder screens.
- No TypeScript requirement is introduced.

Security requirements:

- No secrets in frontend.
- API base URL strategy follows docs.

Validation requirements:

- Basic form validation patterns may be stubbed only if documented.

Testing requirements:

- Add initial frontend test setup if the phase scope includes it.

Manual QA checklist:

- Start frontend.
- Open main routes.
- Confirm no console errors.

Stop condition: STOP - awaiting developer approval for Phase 3.

### Phase 3: Backend App Setup

Goal: Initialize the Node and Express backend foundation.

Files allowed:

- `server/`
- Root scripts only if needed

Files not allowed:

- Frontend feature implementation
- Auth, task, habit, dashboard, or analytics feature logic beyond setup stubs

Documentation dependency: Approved engineering docs and Phase 1 setup.

Implementation tasks:

- Initialize Express app.
- Add app/server entry structure.
- Add health check.
- Add env config foundation.
- Add centralized error handling foundation.

Acceptance criteria:

- Backend starts locally.
- `GET /health` responds.
- Folder structure matches docs.

Security requirements:

- Prepare Helmet, CORS, env validation, and error sanitization approach according to docs.

Validation requirements:

- Env validation plan is ready or implemented if approved for setup.

Testing requirements:

- Add health check test if test setup is included in phase scope.

Manual QA checklist:

- Start server.
- Call `GET /health`.

Stop condition: STOP - awaiting developer approval for Phase 4.

### Phase 4: Theme System Foundation

Goal: Add theme tokens and light/dark theme foundation.

Files allowed:

- `client/src/themes/`
- Theme context and app integration files
- Shared UI styles needed for theme tokens

Files not allowed:

- Feature-specific task, habit, dashboard, or analytics code

Documentation dependency: Approved theme UX and theme architecture docs.

Implementation tasks:

- Define CSS variables.
- Add light and dark themes.
- Add theme context.
- Add persistence according to docs.
- Use mock examples only where allowed.

Acceptance criteria:

- Theme toggle works.
- Theme survives refresh if documented.
- Components use theme variables.

Security requirements:

- No security-sensitive behavior.

Validation requirements:

- Validate theme values through documented token usage, not runtime schema.

Testing requirements:

- Add focused tests if theme context behavior is non-trivial.

Manual QA checklist:

- Toggle light/dark theme.
- Check contrast and focus states.

Stop condition: STOP - awaiting developer approval for Phase 5.

### Phase 5: Authentication Backend

Goal: Implement secure backend auth.

Files allowed:

- Auth routes, controllers, services, validation, middleware, model, tests
- Shared error, async, env, cookie, CORS, rate-limit, and security middleware files

Files not allowed:

- Frontend auth screens
- Task, habit, dashboard, analytics feature implementation

Documentation dependency: Approved auth API, security, database, and folder-structure docs.

Implementation tasks:

- Implement register, login, logout, and me endpoints.
- Hash passwords with bcrypt.
- Store JWT in HttpOnly cookie.
- Add auth middleware.
- Add login/register rate limiting.

Acceptance criteria:

- Auth endpoints match contract.
- User response excludes password and role.
- Logout is idempotent.

Security requirements:

- Strong env JWT secret.
- Cookie options from env.
- CORS exact origin with credentials.
- No token or password logging.

Validation requirements:

- Zod validation for auth writes and env.

Testing requirements:

- Tests for register, login, logout, me, protected access, duplicate email, invalid credentials, and validation failures.

Manual QA checklist:

- Register user.
- Login user.
- Call `/api/auth/me`.
- Logout user.

Stop condition: STOP - awaiting developer approval for Phase 6.

### Phase 6: Authentication Frontend

Goal: Implement frontend auth screens and auth state.

Files allowed:

- Auth pages, hooks, context, API client auth functions, validation, tests

Files not allowed:

- Task, habit, dashboard, or analytics implementation

Documentation dependency: Approved auth UX, API, state-management, and security docs.

Implementation tasks:

- Build login and register forms.
- Build auth context.
- Restore session through `/api/auth/me`.
- Handle 401 redirects silently for expired sessions.

Acceptance criteria:

- Login/register flows work with backend.
- Token is never read by frontend JavaScript.
- API client sends credentials.

Security requirements:

- No JWT localStorage or sessionStorage.
- No hardcoded backend URL in API client.

Validation requirements:

- Client-side form validation.
- Server errors normalized.

Testing requirements:

- Tests for login/register form behavior and session handling.

Manual QA checklist:

- Register from UI.
- Refresh and confirm session restore.
- Expire or clear cookie and confirm redirect behavior.

Stop condition: STOP - awaiting developer approval for Phase 7.

### Phase 7: Protected Routes and App Layout

Goal: Add protected app shell and route access control.

Files allowed:

- Layout components
- Protected route components
- Navigation components
- Route definitions

Files not allowed:

- Task, habit, dashboard, or analytics feature implementation beyond placeholders

Documentation dependency: Approved IA, user flows, component architecture, and auth docs.

Implementation tasks:

- Add AppLayout, Sidebar, Topbar, and PageHeader.
- Protect authenticated routes.
- Add responsive navigation behavior.

Acceptance criteria:

- Protected pages require auth.
- App layout is reusable.
- Navigation matches IA.

Security requirements:

- Protected UI routes depend on restored auth state.

Validation requirements:

- No new request validation.

Testing requirements:

- Protected route tests.

Manual QA checklist:

- Visit protected route while logged out.
- Visit protected route while logged in.
- Check responsive layout.

Stop condition: STOP - awaiting developer approval for Phase 8.

### Phase 8: Task Backend

Goal: Implement task API and backend task rules.

Files allowed:

- Task model, routes, controller, service, validation, tests
- Shared domain constants if needed

Files not allowed:

- Task frontend
- Habit, dashboard, analytics implementation except cache-impact docs if needed

Documentation dependency: Approved task API, database, validation, and security docs.

Implementation tasks:

- Implement task CRUD.
- Add ownership checks.
- Add `limit` and `offset`.
- Add hard delete behavior.

Acceptance criteria:

- Task endpoints match API docs.
- Default list limit is 50.
- Users cannot access other users' tasks.

Security requirements:

- Protected routes require auth.
- No sensitive data leakage.

Validation requirements:

- Zod validation for create and update.
- Query validation for `limit` and `offset`.

Testing requirements:

- Task CRUD, protected access, ownership, pagination params, and validation failure tests.

Manual QA checklist:

- Create, list, update, complete, and delete task via API.

Stop condition: STOP - awaiting developer approval for Phase 9.

### Phase 9: Task Frontend

Goal: Implement task UI and server-state integration.

Files allowed:

- Task feature components, hooks, API functions, validation, tests
- Shared UI components required by task flows

Files not allowed:

- Habit, dashboard, analytics implementation

Documentation dependency: Approved task UX, API, component, and state docs.

Implementation tasks:

- Build TaskList, TaskCard, TaskForm, and TaskFilters.
- Integrate TanStack Query.
- Add create, edit, delete, and complete behavior.

Acceptance criteria:

- Task UI handles loading, empty, error, and success states.
- Mutations invalidate `tasks`, `dashboard`, and `analytics` according to docs.

Security requirements:

- API client sends credentials.

Validation requirements:

- Client form validation and server error display.

Testing requirements:

- Task form basic behavior tests.

Manual QA checklist:

- Create, edit, complete, filter, and delete tasks from UI.

Stop condition: STOP - awaiting developer approval for Phase 10.

### Phase 10: Habit Backend

Goal: Implement habit API, check-ins, and streak rules.

Files allowed:

- Habit model, check-in model, routes, controller, service, validation, domain calculators, tests

Files not allowed:

- Habit frontend
- Dashboard or analytics implementation beyond shared domain helpers

Documentation dependency: Approved habit API, database, domain rules, and security docs.

Implementation tasks:

- Implement habit CRUD.
- Implement daily check-in.
- Enforce once-per-day rule.
- Implement current streak, longest streak, and completion percentage logic.
- Cascade delete habit check-ins when a habit is deleted.

Acceptance criteria:

- Habit rules RULE-HABIT-01 through RULE-HABIT-05 are implemented.
- UTC boundary behavior is documented in code comments where required.

Security requirements:

- Protected routes require auth.
- Ownership checks prevent cross-user access.

Validation requirements:

- Zod validation for habit create/update and check-in.

Testing requirements:

- Habit CRUD, check-in, duplicate check-in, streak, completion percentage, cascade delete, and validation tests.

Manual QA checklist:

- Create habit.
- Check in for today.
- Attempt duplicate check-in.
- Delete habit and confirm check-ins are removed.

Stop condition: STOP - awaiting developer approval for Phase 11.

### Phase 11: Habit Frontend

Goal: Implement habit tracker UI.

Files allowed:

- Habit feature components, hooks, API functions, validation, tests
- Shared UI components required by habit flows

Files not allowed:

- Dashboard or analytics implementation

Documentation dependency: Approved habit UX, API, component, and state docs.

Implementation tasks:

- Build HabitGrid, HabitCard, HabitForm, and HabitCheckCell.
- Add daily check-in UI.
- Add monthly grid view.
- Integrate TanStack Query.

Acceptance criteria:

- Habit UI handles loading, empty, error, and success states.
- Check-in mutation invalidates `habits`, `dashboard`, and `analytics`.

Security requirements:

- API client sends credentials.

Validation requirements:

- Client form validation and server error display.

Testing requirements:

- Habit grid basic behavior tests.

Manual QA checklist:

- Create, edit, check in, and delete habits from UI.
- Inspect monthly grid on desktop and mobile.

Stop condition: STOP - awaiting developer approval for Phase 12.

### Phase 12: Dashboard Summary Backend

Goal: Implement today's dashboard summary endpoint.

Files allowed:

- Dashboard route, controller, service, validation if needed, tests
- Shared domain helpers if needed

Files not allowed:

- Dashboard frontend
- Weekly analytics endpoint

Documentation dependency: Approved dashboard API, analytics rules, and database docs.

Implementation tasks:

- Implement `/api/dashboard/summary`.
- Return today's task summary, habit summary, productivity score, and current streak.
- Use UTC day boundary rules.

Acceptance criteria:

- Endpoint returns today's snapshot only.
- Weekly chart data is not duplicated here.

Security requirements:

- Protected route requires auth.

Validation requirements:

- Validate any accepted query params if added.

Testing requirements:

- Dashboard summary tests for empty, partial, and complete activity states.

Manual QA checklist:

- Call dashboard summary with no activity.
- Call after task and habit activity.

Stop condition: STOP - awaiting developer approval for Phase 13.

### Phase 13: Dashboard Frontend

Goal: Implement dashboard UI.

Files allowed:

- Dashboard page, components, hook, API function, tests
- Shared StatCard, SectionCard, ProgressRing, Skeleton, EmptyState, ErrorState if needed

Files not allowed:

- Analytics page implementation

Documentation dependency: Approved dashboard wireframe, API, component, and state docs.

Implementation tasks:

- Build fixed modular dashboard layout.
- Load summary endpoint.
- Load weekly chart from analytics endpoint once Phase 14 exists; before then keep chart placeholder documented if needed.

Acceptance criteria:

- Dashboard handles loading, empty, error, and success states.
- Dashboard matches V1 fixed layout.

Security requirements:

- API client sends credentials.

Validation requirements:

- Normalize API errors.

Testing requirements:

- Dashboard loading, error, and empty state tests.

Manual QA checklist:

- Review dashboard on desktop and mobile.
- Confirm no screenshot-only features entered V1.

Stop condition: STOP - awaiting developer approval for Phase 14.

### Phase 14: Analytics Backend

Goal: Implement weekly analytics endpoint and score rules.

Files allowed:

- Analytics route, controller, service, domain calculator, validation, tests

Files not allowed:

- Analytics frontend

Documentation dependency: Approved analytics API, functional requirements, and scoring docs.

Implementation tasks:

- Implement `/api/analytics/weekly`.
- Calculate last 7 days including today.
- Apply productivity score rules RULE-SCORE-01 through RULE-SCORE-05.
- Return `null` for days with no tasks and no habits.

Acceptance criteria:

- Weekly endpoint powers both analytics page and dashboard chart.
- Score fallback behavior matches docs.

Security requirements:

- Protected route requires auth.

Validation requirements:

- Validate any date or query params if added.

Testing requirements:

- Score formula, fallback cases, weekly range, and null-gap tests.

Manual QA checklist:

- Call weekly endpoint with no activity.
- Call with tasks only, habits only, and mixed activity.

Stop condition: STOP - awaiting developer approval for Phase 15.

### Phase 15: Analytics Frontend

Goal: Implement analytics UI and weekly chart integration.

Files allowed:

- Analytics page, components, hook, API function, tests
- Chart integration files

Files not allowed:

- New backend behavior

Documentation dependency: Approved analytics UX, API, and state docs.

Implementation tasks:

- Build analytics screen.
- Integrate Recharts.
- Display task completion rate, habit consistency, daily productivity score, and weekly chart.
- Show visual gaps for `null` scores.

Acceptance criteria:

- Analytics handles loading, empty, error, and success states.
- Chart does not show 0 for no-activity `null` days.

Security requirements:

- API client sends credentials.

Validation requirements:

- Normalize API errors.

Testing requirements:

- Analytics chart basic render and state tests where practical.

Manual QA checklist:

- Review chart with empty, partial, and full weekly data.

Stop condition: STOP - awaiting developer approval for Phase 16.

### Phase 16: Integration Testing Pass

Goal: Verify cross-feature behavior end to end.

Files allowed:

- Test files
- Test utilities
- Minimal fixes required by failing tests

Files not allowed:

- New features
- Scope expansion

Documentation dependency: Approved feature docs and implemented phases 1-15.

Implementation tasks:

- Run backend tests.
- Run frontend tests.
- Add missing integration coverage.
- Fix defects found by tests.

Acceptance criteria:

- Critical auth, task, habit, dashboard, and analytics flows are covered.
- Backend services and domain logic target 70% coverage.

Security requirements:

- Confirm protected routes and credential behavior through tests.

Validation requirements:

- Confirm validation failures return expected error format.

Testing requirements:

- Required backend, frontend, and domain tests from Master Prompt V4.

Manual QA checklist:

- Run core flows locally after automated tests.

Stop condition: STOP - awaiting developer approval for Phase 17.

### Phase 17: Security Pass

Goal: Review and harden V1 security behavior.

Files allowed:

- Security middleware/config files
- Env validation files
- Auth-related fixes
- Security docs only if explicitly approved

Files not allowed:

- New product features

Documentation dependency: Approved security docs and implemented phases.

Implementation tasks:

- Review cookie config.
- Review CORS config.
- Review rate limiting.
- Review error sanitization.
- Review secret handling.
- Review dependency security where possible.

Acceptance criteria:

- No JWT localStorage/sessionStorage usage.
- No wildcard credentialed CORS.
- Auth routes are rate-limited.
- Env config fails fast.

Security requirements:

- This phase is security-focused.

Validation requirements:

- Validate env sync rule for `COOKIE_MAX_AGE_MS` and `JWT_EXPIRES_IN`.

Testing requirements:

- Add or update security-focused tests for auth and env behavior.

Manual QA checklist:

- Inspect auth cookie flags.
- Test unauthorized and expired session behavior.

Stop condition: STOP - awaiting developer approval for Phase 18.

### Phase 18: UI Polish

Goal: Improve usability, accessibility, and responsive quality.

Files allowed:

- UI components
- Layout styles
- Feature UI polish files
- Accessibility fixes

Files not allowed:

- New features
- Backend schema or API changes unless required by documented bug fix

Documentation dependency: Approved UX docs and implemented UI phases.

Implementation tasks:

- Polish responsive layouts.
- Improve focus states.
- Improve loading, empty, and error states.
- Ensure theme token usage.
- Remove leftover mock data.

Acceptance criteria:

- UI is responsive and accessible enough for V1.
- No hardcoded component colors.
- No text overlap in expected viewport sizes.

Security requirements:

- No new security-sensitive behavior.

Validation requirements:

- Preserve form validation behavior.

Testing requirements:

- Update affected UI tests if behavior changes.

Manual QA checklist:

- Review dashboard, tasks, habits, analytics, auth, and settings on desktop and mobile.

Stop condition: STOP - awaiting developer approval for Phase 19.

### Phase 19: Documentation Polish

Goal: Update docs so they match the implemented V1.

Files allowed:

- Documentation files
- README updates
- Changelog updates if needed

Files not allowed:

- Feature implementation code unless explicitly approved as a doc-discovered bug fix

Documentation dependency: All implemented phases.

Implementation tasks:

- Review docs against implementation.
- Fix outdated docs with approval.
- Document scripts and local setup.
- Confirm limitations are clear.

Acceptance criteria:

- Docs are accurate for V1.
- Setup instructions are clear.
- Known limitations are documented.

Security requirements:

- Confirm security docs match final behavior.

Validation requirements:

- Confirm env and validation docs match code.

Testing requirements:

- No new tests unless docs reveal a missing required test.

Manual QA checklist:

- Follow README setup on a clean clone where practical.

Stop condition: STOP - awaiting developer approval for Phase 20.

### Phase 20: First Open Source Release Prep

Goal: Prepare version `0.1.0` for public release.

Files allowed:

- Release docs
- Changelog
- Final metadata and config fixes
- Minimal release-blocking bug fixes

Files not allowed:

- New features
- Architecture rewrites

Documentation dependency: Approved Phase 19 docs.

Implementation tasks:

- Finalize changelog in Keep a Changelog format.
- Confirm MIT license.
- Confirm contribution docs.
- Confirm env examples.
- Run final tests and build checks.

Acceptance criteria:

- Project is ready for first open-source release.
- Version `0.1.0` release notes are prepared.
- Required tests and build checks pass.

Security requirements:

- Confirm no real secrets are present.
- Confirm security reporting docs are present.

Validation requirements:

- Confirm env validation and request validation work.

Testing requirements:

- Run full test suite and build commands.

Manual QA checklist:

- Complete core user journey from register to dashboard analytics.
- Review release files.

Stop condition: STOP - Phase 20 complete. Await developer approval for release action.
