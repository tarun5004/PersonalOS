# PersonalOS Next-Level OS Task Checklist

Status: Draft execution checklist
Rule: Complete one chunk, test it, commit it, then move to the next chunk.

## Chunk 0 - Source Of Truth Update

- [x] Update `AGENTS.md` to allow the approved Next-Level OS package track.
- [x] Update `STEPS.md` with the new package/design-system track.
- [x] Update component architecture docs to allow controlled shadcn/ui, Magic UI, and Aceternity UI usage.
- [x] Update non-functional requirements to describe animation, 3D, and AI asset performance constraints.
- [x] Add an ADR for controlled premium UI package adoption.
- [x] Add an ADR for server-side OpenAI Images API + Cloudinary asset pipeline.
- [x] Run `git diff --check`.
- [x] Commit: `docs(next-level): approve premium ui and ai asset track`.

## Chunk 1 - Package Installation And Baseline Verification

- [x] Install only the required missing packages after docs are updated.
- [x] Confirm installed package versions in `client/package.json` and server package file if OpenAI SDK is added server-side.
- [x] Run frontend tests.
- [x] Run frontend build.
- [x] Run backend tests if server package/config changes.
- [x] Commit: `chore(deps): add next-level ui and asset packages`.

Target package groups:

- [x] `framer-motion`
- [x] `@formkit/auto-animate`
- [x] `@dicebear/core`
- [x] DiceBear collection package selected during implementation
- [x] `lottie-react`
- [x] `canvas-confetti`
- [x] `react-countup`
- [x] `react-hook-form`
- [x] `three`
- [x] `@react-three/fiber`
- [x] OpenAI SDK on the server if needed
- [x] shadcn/ui setup only after conflict docs are updated
- [ ] Magic UI components copied/adapted only where useful
- [ ] Aceternity UI components copied/adapted only where useful

## Chunk 2 - Design System Consolidation

- [x] Create or refine shared `MotionCard`, `AnimatedNumber`, `ConfettiReward`, `LottieState`, and `ThreeCanvasShell`.
- [x] Adapt shadcn-style primitives into local PersonalOS components without exposing template styling.
- [x] Create one animation timing map and one reward intensity map.
- [x] Ensure new shared primitives use CSS variables.
- [ ] Replace existing avatar/habit swatch hex data with token or generated-color strategy in the relevant profile/habit chunks.
- [x] Run frontend tests/build.
- [x] Commit: `feat(ui): add next-level shared interaction primitives`.

## Chunk 3 - Dashboard OS Upgrade

- [x] Add CountUp to XP, focus score, streak, task totals, and habit completion.
- [x] Add Framer Motion transitions to hero, alerts, stat cards, and achievement unlock cards.
- [ ] Deferred: use a Lottie dashboard empty state only when an approved animation asset exists; the static premium empty state is kept for now to avoid `lottie-web` build warnings.
- [x] Add controlled Canvas Confetti only for first milestone unlock.
- [x] Keep dashboard readable and dense.
- [x] Browser QA desktop/mobile public auth routes and protected-route redirect; authenticated dashboard visual QA requires a seeded logged-in browser session.
- [x] Commit: `feat(dashboard): add animated command center feedback`.

## Chunk 4 - Tasks Experience Upgrade

- [x] Use Auto Animate for task columns.
- [x] Use React Hook Form + Zod for task create/edit form.
- [x] Add motion for task card completion and status movement.
- [x] Add subtle reward on first completed task only.
- [x] Preserve existing API contracts and React Query invalidation.
- [x] Run frontend tests/build.
- [x] Commit: `feat(tasks): polish task flow interactions`.

## Chunk 5 - Habits Experience Upgrade

- [x] Use Auto Animate for habit rows.
- [x] Use React Hook Form + Zod for habit form.
- [x] Add motion for check-in, missed day emphasis, streak milestone, and monthly summary.
- [x] Add CountUp for consistency and streak metrics.
- [x] Add optional confetti only for streak milestones.
- [ ] Deferred: authenticated habit browser QA needs a seeded logged-in session; frontend tests/build passed for this chunk.
- [x] Commit: `feat(habits): add habit reward and motion layer`.

## Chunk 6 - Profile And Avatar Upgrade

- [ ] Add DiceBear avatar generation.
- [ ] Keep Cloudinary custom avatar upload.
- [ ] Add avatar frame, XP ring, level badge, achievement count, streak, and completion signal.
- [ ] Store only safe avatar metadata.
- [ ] Run frontend/backend checks if endpoints change.
- [ ] Commit: `feat(profile): add avatar identity system`.

## Chunk 7 - OpenAI Images + Cloudinary Asset Pipeline

- [ ] Add backend env placeholders for OpenAI API key.
- [ ] Add server-side OpenAI image service.
- [ ] Validate prompt length, asset type, and ownership.
- [ ] Add rate limiting for AI image generation endpoint.
- [ ] Generate image, upload to Cloudinary, store Cloudinary URL/public ID.
- [ ] Add frontend prompt form with React Hook Form + Zod.
- [ ] Never expose OpenAI key or Cloudinary secret to client code.
- [ ] Run backend tests and frontend build.
- [ ] Commit: `feat(assets): add ai image generation pipeline`.

## Chunk 8 - 3D Focus / Progress Layer

- [ ] Add lazy-loaded React Three Fiber scene.
- [ ] Use it only in focus mode or an optional progress view.
- [ ] Add loading fallback and reduced-motion/low-power fallback.
- [ ] Verify canvas is nonblank with browser screenshot.
- [ ] Confirm bundle impact is acceptable.
- [ ] Commit: `feat(focus): add optional 3d progress layer`.

## Chunk 9 - Final QA And Cleanup

- [ ] Run frontend tests.
- [ ] Run frontend build.
- [ ] Run backend tests.
- [ ] Run `git diff --check`.
- [ ] Browser QA login, register, dashboard, tasks, habits, analytics, settings.
- [ ] Verify no secrets are staged.
- [ ] Verify no hardcoded random colors in JSX.
- [ ] Verify heavy features are lazy-loaded.
- [ ] Commit: `chore(next-level): finalize ui qa and cleanup`.

## Stop Conditions

Stop before implementation if:

- Source-of-truth docs still ban a requested package.
- OpenAI or Cloudinary real secrets would need to be written to tracked files.
- A package conflicts with the current React/Vite/Tailwind setup.
- A copied UI library pattern would force a visual direction that looks generic or template-like.
- Backend API contracts would need broad changes without a dedicated phase.
