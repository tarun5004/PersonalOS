# Personal OS Agent Instructions

Status: Draft control document  
Purpose: Keep every agent aligned with Master Prompt V4, approved docs, and the current chunk.

## 1. Source of Truth

Runtime instructions from the platform, system, developer, and tool policies always take precedence over repository documents. Inside the Personal OS project, use the Master Prompt V4 priority order:

1. Master Prompt V4
2. Approved documentation files
3. Implemented code

If two sources conflict, stop and report the conflict before making changes.

`STEPS.md` is the build-control checklist. It helps sequence work, but it does not override Master Prompt V4 or approved docs.

The current user request defines the active task only when it does not conflict with the priority order above.

## 2. Non-Negotiable Rules

- Do not hallucinate features, files, APIs, database fields, packages, components, or routes.
- Do not build the full app at once.
- Work in small chunks.
- Do not continue to the next phase without explicit approval.
- Do not touch unrelated files.
- Do not add packages unless the current approved phase allows it.
- Do not rename, move, or delete files unless the active chunk explicitly requires it.
- Do not make TypeScript mandatory for V1.
- Do not introduce Redux, shadcn/ui as a dependency, microservices, AI features, OAuth, Redis, Kubernetes, or real-time collaboration in V1.
- Do not store JWTs in localStorage or sessionStorage.
- Use npm for V1.
- Tailwind CSS v4 is the approved V1 styling system.
- Keep one global frontend CSS entry file only.
- Do not create generic placeholder UI when a polished placeholder-safe state is possible.
- Do not duplicate the app shell, sidebar, topbar, or shared card/form patterns.

## 3. Chunk Protocol

Before editing:

1. Read the current session briefing or user request.
2. Identify the active phase and chunk.
3. Check `STEPS.md` for allowed files.
4. Inspect existing files before changing them.
5. Ask if the request is unclear or conflicts with approved docs.
6. Do not modify approved docs unless the developer explicitly requests a docs update.
7. If implementation reveals a docs issue, stop and report the doc gap before changing approved docs.

During editing:

1. Keep the patch small and reviewable.
2. Follow the documented 4-layer architecture.
3. Reuse existing patterns before creating new ones.
4. Add validation, error handling, loading states, and tests when the phase requires them.
5. Keep secrets out of the repository.
6. Prefer existing project patterns over new abstractions.
7. Keep package and tooling changes out of the patch unless explicitly approved for the phase.

After editing:

1. Verify the changed files.
2. Summarize files changed and why.
3. Include tests or manual QA notes.
4. Stop at the phase or chunk boundary.

## 4. Multi-Agent Approach

Use sub-agents only when the user has explicitly allowed multi-agent work for the session or task and the tool is available.

The current overnight execution request explicitly requires a coordinated multi-agent engineering workflow. For Phases 10 through 15, every phase must use a phase gate before advancing.

Required phase-gate reviewers:

- Lead Architect: verifies scope, architecture, maintainability, and phase boundaries.
- Backend Engineer: verifies API, model, service, controller, validation, indexes, and backend tests when backend files are touched.
- Frontend Engineer: verifies UI, forms, state management, loading, empty, error, and accessibility behavior when frontend files are touched.
- Performance Engineer: verifies lazy loading, query efficiency, render behavior, bundle impact, pagination, and database query patterns.
- Security Auditor: verifies authentication, authorization, ownership checks, input validation, API exposure, and sensitive data handling.
- QA Engineer: verifies routes, buttons, forms, modals, workflows, navigation paths, and realistic seeded data.
- Production Reviewer: reviews the result as a daily-use product for clarity, trust, speed, and unfinished-feeling UX.
- Red Team Reviewer: actively tries invalid inputs, edge cases, unauthorized access, pagination abuse, race-prone flows, empty states, and large-data scenarios.

A phase gate is required before moving from one approved overnight phase to the next. A gate pass does not authorize work outside the current overnight execution plan, does not authorize Phase 16 or release action, and does not override source-of-truth documentation.

If sub-agent tooling is unavailable, report the tooling gap and perform a clearly labeled local simulated review for each required role. Do not claim a real sub-agent approval when a local simulated review was used.

Good delegated work:

- Reviewing a draft against approved docs.
- Checking a specific layer for consistency.
- Implementing a clearly owned, disjoint file group only after that phase is explicitly approved and listed as the active phase.
- Running independent verification while the main agent continues non-overlapping work.

Rules for delegated work:

- The main agent owns the critical path and final integration.
- Each sub-agent must receive a bounded task and clear file ownership.
- Agents must not edit the same files in parallel.
- Agents must not work from memory when relevant docs or files are available.
- Agents must not revert or overwrite another agent's changes.
- Sub-agent output must be reviewed before being treated as final.
- If a delegated result conflicts with Master Prompt V4 or approved docs, stop and report it.
- Close sub-agents when their work is integrated or no longer needed.

## 5. Architecture Guardrails

Personal OS uses four layers:

- Presentation: pages, layouts, UI components, route screens, loading, empty, error, and success states.
- Application: hooks, form coordination, client validation, server-state coordination.
- Domain: business rules, constants, validation schemas, scoring formulas, streak rules.
- Infrastructure: API clients, Express routes, controllers, services, models, middleware, env config, auth token handling, logging, and error handling.

Backend flow must remain:

```text
Route -> Middleware -> Controller -> Service -> Model
```

Frontend API flow must remain:

```text
Page -> Feature hook -> API client function -> Backend endpoint
```

State management must remain:

- Local React state for modal state, form inputs, active tabs, and small UI-only state.
- React Context for auth user and theme.
- TanStack Query for server state including tasks, habits, dashboard, and analytics.
- URL query params for filters where documented.

API calls must remain centralized. Components must not contain raw backend endpoint strings.

## 6. Active Execution Guardrails

The current active execution is the approved overnight run from Phase 10 through Phase 15.

- Phase 9 Task Frontend is complete and committed.
- Phase 10 Habit Backend is the next implementation phase.
- Continue one phase at a time through Phase 15 only.
- Do not start Phase 16, release action, or post-V1 work during this run.
- Do not skip required implementation, review, test, browser QA, performance review, security review, red-team review, or internal approval gates.
- Do not change auth behavior, routing contracts, API contracts outside the active phase, or state-management ownership unless a verified integration bug requires it.
- Preserve existing user-facing behavior unless the active phase explicitly adds or wires the documented feature.
- Use realistic seeded data for browser/manual QA once the relevant backend data exists.
- Runtime crashes, white screens, console errors, broken navigation, failed tests, failed builds, and blocking API errors must be fixed before advancing.
- Keep commits logical and readable at phase or major-chunk boundaries.
- Report tooling gaps honestly instead of adding dependencies by default.
- Add dependencies only when the active phase or a measured optimization justifies the value.

## 7. UI and Theme Guardrails

The approved PersonalOS visual direction remains in effect for future UI work.

- PersonalOS should feel like a personal operating system, digital command center, and long-lived productivity cockpit.
- Use the provided dashboard references for layout hierarchy, information density, and navigation organization only.
- Do not copy the reference colors, branding, or startup-dashboard appearance.
- Do not make the app look like ChatGPT, Linear, Notion, Vercel, a generic SaaS dashboard, a startup admin template, an AI-generated UI, or a shadcn demo project.
- Use a mature productivity palette: soft neutral app backgrounds, clean canvas cards, refined teal accents, graphite/navy dark surfaces, subtle borders, and muted professional status colors.
- Use Tailwind CSS v4 utilities backed by approved semantic CSS variables.
- The frontend must keep exactly one global CSS entry file for Tailwind import, theme variables, resets, and global tokens.
- Use reusable shared components before adding page-specific repeated markup.
- Use `lucide-react` icons for navigation and action affordances when the package is available.
- Use `@headlessui/react` only for accessible dialogs, menus, toggles, or similar UI primitives where needed.
- Use `framer-motion` only for subtle transitions; do not over-animate the app.
- Use `clsx` and `tailwind-merge` through the local class-name helper after they are installed.
- Do not use random hardcoded colors in JSX or JS files; add semantic CSS variables when a new color role is required.
- Avoid purple-first startup themes, bright AI-style gradients, glow effects, glassmorphism, excessive border radius, inconsistent shadows, and arbitrary color accents.
- Sidebar, topbar, cards, forms, and page headers must feel stable, readable, and built for daily use.
- Placeholder-safe UI is allowed before backend feature phases, but it must not imply unsupported backend behavior is implemented.

## 8. Security Guardrails

- V1 auth uses short-lived access tokens in frontend memory and rotated refresh tokens in secure HttpOnly cookies.
- Backend validates refresh cookies, access tokens, and env configuration.
- CORS must use `credentials: true` and exact `CORS_ORIGIN`.
- Frontend requests must include credentials.
- Auth login and register routes require rate limiting.
- Do not log passwords, tokens, secrets, or password hashes.
- Production 500 responses must be sanitized.
- V1 uses `sameSite: "lax"` as primary CSRF mitigation for same-domain deployments.
- `COOKIE_SAME_SITE` controls cookie same-site behavior. Do not hardcode deployment-specific cookie assumptions.
- `ACCESS_TOKEN_EXPIRES_IN` is short-lived. `REFRESH_TOKEN_MAX_AGE_MS` controls the refresh cookie lifetime.

## 9. Approved Docs Change Control

Once a documentation file is approved, do not modify it during implementation unless the developer explicitly requests a docs update.

If implementation reveals a docs issue, stop and report:

- Which doc is wrong or incomplete.
- What change is needed.
- Why the change is required.
- Whether it affects the current phase scope.

Do not silently update approved docs.

## 10. Stop Conditions

Stop and ask when:

- A required doc is missing or unclear.
- A requested change conflicts with Master Prompt V4.
- A phase asks for files outside its allowed scope.
- A package, API field, route, or feature is not documented.
- A security decision is ambiguous.
- User approval is required to proceed.

Use the blocked report format from Master Prompt V4 when a phase cannot continue.

## 11. Reporting Requirements

When blocked, report:

```text
BLOCKED REPORT
Phase: [X]
Blocker: [what is unclear or missing]
Doc gap: [which doc is missing the needed info]
Question for developer: [specific question]
Suggested resolution: [your suggested answer]
```

When a phase completes, use the phase completion report format from `STEPS.md`.
