# PersonalOS Next-Level OS Plan

Status: Approved source-of-truth update in progress
Purpose: Define how the requested UI, motion, 3D, AI image, and asset packages should be used without turning the app into a dependency mess.

## 1. Current Reality

Already installed in `client/package.json`:

- React
- Vite
- Tailwind CSS v4
- Recharts
- TanStack React Query
- Zod
- Cloudinary foundation exists on the backend through signed REST upload helper, without committing secrets.

Not installed yet:

- shadcn/ui
- Framer Motion
- Auto Animate
- DiceBear package
- Lottie
- Canvas Confetti
- React CountUp
- React Hook Form
- Magic UI
- Aceternity UI
- React Three Fiber
- Three.js
- OpenAI SDK / OpenAI Images API integration

## 2. Source-Of-Truth Conflicts

The current repository docs still say V1 should not introduce:

- `shadcn/ui` as a dependency
- AI features

The new request explicitly asks to use `shadcn/ui`, Magic UI, Aceternity UI, and OpenAI Images API.

Before implementation, the source of truth should be updated to say this is a new approved "Next-Level OS" track that supersedes the earlier V1 limitation for these packages only.

Required docs to update before package installation:

- `AGENTS.md`
- `STEPS.md`
- `docs/engineering/component-architecture.md`
- `docs/engineering/non-functional-requirements.md`
- Any ADR that says shadcn/ui or AI features are excluded from V1

Status: completed by Chunk 0 documentation updates.

## 3. Package Roles

### Core App Foundation

- React: existing UI runtime.
- Vite: existing frontend build system.
- Tailwind CSS v4: existing styling system and token layer.
- React Query: existing server-state cache layer.
- Zod: existing schema validation layer.

### Component System

- shadcn/ui: use only as copied component primitives or a small local component foundation. Do not let it replace the PersonalOS design language.
- Magic UI: use selectively for high-value visual moments such as hero highlights, animated cards, and subtle glow borders.
- Aceternity UI: use selectively for premium visual compositions. Avoid copying template-heavy sections.
- Existing shared components remain the primary design system. New components should wrap or adapt the imported patterns into `client/src/components/ui/` or `client/src/components/shared/`.

### Motion And Reward

- Framer Motion: page transitions, modal transitions, card reveal, achievement unlock, Pomodoro session states.
- Auto Animate: list transitions for task columns, habit rows, achievement lists, and lightweight layout changes.
- Canvas Confetti: rare celebration events only, such as first task complete, streak milestone, focus session milestone.
- React CountUp: dashboard score, XP, streak, completed task count, focus minutes.
- Lottie: optional curated animations for empty states and achievement unlocks. Avoid noisy decorative loops.

### Identity And Assets

- DiceBear: generated avatar identities and fallback avatars.
- Cloudinary: durable uploaded assets, optimized delivery, generated image storage, avatar/background/badge URLs.
- OpenAI Images API: generate dashboard backgrounds, avatar variations, badge art, and theme artwork on the backend only.

### Data Visualization

- Recharts: existing charts for analytics, weekly scores, habit consistency, task throughput, focus history.

### Forms

- React Hook Form: form state and validation ergonomics for task, habit, settings, avatar, and AI image prompts.
- Zod: shared schema validation for frontend forms and backend request validation.

### 3D / Immersive

- React Three Fiber + Three.js: optional "OS cockpit" visual layer, not core layout.
- Use only for contained, lazy-loaded experiences such as focus mode background, achievement constellation, or yearly progress globe.
- Must be route/component lazy-loaded and disabled on low-power/mobile when needed.

## 4. OpenAI Images API Direction

OpenAI's current docs describe image generation/editing through the Images API or the Responses API, and the docs list `gpt-image-2` as a state-of-the-art image generation model. The implementation should keep all OpenAI API calls on the server so API keys never reach the browser.

Recommended V1 flow:

1. User requests a background/avatar/badge concept from the frontend.
2. Backend validates prompt, image type, and ownership.
3. Backend calls OpenAI image generation.
4. Backend uploads resulting image bytes/base64 to Cloudinary.
5. Backend stores only Cloudinary URL/public ID and generation metadata.
6. Frontend renders optimized Cloudinary delivery URL.

Do not store OpenAI API keys in frontend env variables.

## 5. Design Direction

PersonalOS should feel like:

- A personal operating system
- A productivity cockpit
- A calm command center
- A gamified daily-use life tool

It should not feel like:

- A generic SaaS dashboard
- A shadcn demo
- A Magic UI demo
- An Aceternity template
- A random animation playground

Every package must serve one of these goals:

- More clarity
- More emotional progress
- Better feedback
- Better personalization
- Better daily habit formation
- Better performance or maintainability

## 6. Architecture Rules

- Keep backend flow: `Route -> Middleware -> Controller -> Service -> Model`.
- Keep frontend flow: `Page -> Feature hook -> API client -> Backend endpoint`.
- Keep server state in React Query.
- Keep UI state local unless it belongs in Auth, Theme, Pomodoro, or another documented context.
- Do not expose API keys or Cloudinary secrets in frontend code.
- Do not make frontend components call OpenAI or Cloudinary signed APIs directly.
- Do not duplicate sidebar, topbar, cards, modals, form controls, chart wrappers, or avatar primitives.
- Lazy-load heavy 3D, Lottie, and image-generation screens.

## 7. Risk Controls

- shadcn/ui, Magic UI, and Aceternity UI can quickly create a template-looking app. All imported patterns must be restyled into PersonalOS tokens.
- Framer Motion, Lottie, confetti, and Three.js can hurt performance if always loaded. They must be scoped and lazy-loaded.
- OpenAI image generation adds cost, safety, and moderation concerns. Prompts must be validated and rate-limited.
- Cloudinary/OpenAI secrets must never be committed.
- Generated assets should include ownership checks and delete/replace behavior.

## 8. Acceptance Criteria

- Package list is documented before installation.
- Source-of-truth conflicts are resolved before implementation.
- No real secrets are committed.
- App still builds after each chunk.
- Dashboard, tasks, habits, analytics, settings, login, and register keep working.
- New motion/3D/AI effects improve the OS feeling without breaking readability.
- Every new dependency has a clear reason and at least one concrete use.
