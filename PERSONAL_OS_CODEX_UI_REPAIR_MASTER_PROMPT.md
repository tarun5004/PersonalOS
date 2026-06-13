# Personal OS - Codex Multi-Agent UI Repair, Brand Integration, Theme Reset, Responsiveness, and Cleanup Prompt

## Use this prompt as the master instruction for Codex

You are Codex acting as a senior product engineer, UI systems designer, frontend architect, backend reviewer, QA lead, and documentation owner for the **Personal OS** productivity platform.

Your job is not to do a surface-level styling pass. Your job is to inspect the whole codebase, understand the existing app structure, apply the provided logo and theme reference images, fix broken or weird UI, make every component responsive, verify every major route renders correctly, remove verified dead/duplicate code, and update docs so the project remains maintainable.

Treat this as a production-quality SaaS polish and repair pass.

---

## 0. Non-negotiable outcome

By the end of this task, the app must feel like a premium modern SaaS product with a calm, intelligent, systematic, high-performance visual language.

Target visual direction:

- Premium SaaS / modern operating-system vibe
- Calm and trustworthy, not loud
- Clean product UI inspired by Linear, Notion, Stripe, Arc Browser, and Vercel
- Strong spacing, readable typography, clear hierarchy
- Polished light and dark themes
- Responsive on mobile, tablet, laptop, and desktop
- No content overflowing out of cards
- No random/weird theme colors
- No broken auth screens
- No dead placeholder UI left behind
- No unused frontend or backend files left if they are verified to be dead
- Existing docs updated to reflect the final implementation

---

## 1. Known user-reported problems to fix

The user reported these issues directly. Treat all of them as required tasks:

1. **Login and register pages look weird**
   - Redesign/fix both pages so they look premium, clean, modern, and trustworthy.
   - They must work well in light and dark theme.
   - They must work on mobile, tablet, and desktop.
   - Typography, spacing, card width, input states, error states, loading states, and button states must be polished.

2. **User-provided logo must be applied across the OS/app**
   - Use the latest logo reference provided by the user as the source of truth.
   - Apply it consistently in the app shell, auth pages, sidebar/navbar/header, favicon/app icon if the project supports it, and any brand mark location.
   - Do not keep old placeholder logos, random generated icons, or mismatched brand marks.

3. **Some UI cards are not responsive on mobile and tablet**
   - Audit every card/grid/list/dashboard block.
   - Fix layouts for common breakpoints: 320px, 360px, 390px, 430px, 768px, 1024px, 1280px, and 1440px.
   - No horizontal overflow unless it is an intentional data table with an accessible scroll container.

4. **Theme colors are weird and must be reset from the reference image**
   - Use the provided theme reference image as the visual source of truth.
   - Rebuild or correct the theme tokens so colors feel premium and consistent.
   - Avoid random accent colors and one-off hardcoded colors.
   - Ensure light/dark mode contrast is readable and accessible.

5. **Card content is overflowing / context is spilling out**
   - Fix text wrapping, card sizing, min-width issues, overflow, line clamping, long words, long titles, long descriptions, and responsive grids.
   - Content should remain readable without breaking layouts.

6. **Habit interactions need edit/delete options on click**
   - When the user clicks/selects a habit, show edit and delete actions.
   - Actions must be clear, accessible, and not visually noisy by default.
   - Delete must have confirmation or undo protection.
   - Edit must open the existing edit flow or a proper edit modal/form.
   - Ensure this works on desktop, tablet, and mobile.

7. **Text styles and text colors must adapt to dark and light themes**
   - Check all headings, body text, muted text, labels, placeholders, helper text, errors, buttons, cards, dialogs, toasts, badges, and navigation items.
   - Text must remain visible and visually balanced in both themes.
   - Font sizes and line heights must be checked across all components.

8. **Every component must be checked one by one**
   - Confirm components render correctly.
   - Confirm they are actually used or safely removable.
   - Confirm no layout overflow.
   - Confirm no broken props, missing states, or dead imports.
   - Confirm animations and UI libraries installed/used in the previous session are actually visible and integrated correctly.

9. **Remove unnecessary code from frontend and backend**
   - Delete only code that is verified unused, duplicate, placeholder, broken, or obsolete.
   - Do not delete production behavior just because it is not obvious.
   - If something is suspicious but not safely deletable, document it as a cleanup candidate instead of deleting blindly.

10. **Update all existing docs**
    - Existing docs must not block the task.
    - If docs are outdated, update the docs.
    - If docs conflict with source code, inspect source code and update docs to match the fixed app.

---

## 2. Assumptions and defaults

Use these assumptions unless the repository clearly proves otherwise:

1. This is an existing Personal OS productivity app with authentication, dashboard/productivity UI, habits, cards, theme switching, and at least one frontend framework.
2. The latest logo image and theme reference image supplied by the user are the visual source of truth.
3. The project may include frontend and backend code; inspect both before modifying shared contracts.
4. The app should support responsive web usage across mobile, tablet, and desktop.
5. Do not change database schema or API contracts unless required to fix a real bug.
6. Do not introduce a new design system dependency unless the existing stack cannot support the required fixes.
7. Prefer existing UI/animation libraries already installed in the project.
8. Reusable artifacts, docs, code comments, and final reports must be written in clear English.

---

## 3. First action: inspect before editing

Before changing code, perform a full project audit.

Run the safest available commands for the repository:

```bash
git status --short
find . -maxdepth 3 -type f | sed 's#^./##' | sort | head -300
```

Then identify the package manager and scripts:

```bash
ls
cat package.json 2>/dev/null || true
cat pnpm-lock.yaml 2>/dev/null | head || true
cat yarn.lock 2>/dev/null | head || true
cat package-lock.json 2>/dev/null | head || true
```

If it is a monorepo, inspect each app/package separately.

Create an internal checklist before implementing:

- Routes/pages found
- Auth pages found
- App shell/nav/sidebar/header found
- Habit components found
- Card components found
- Theme provider/tokens found
- UI libraries found
- Animation libraries found
- Backend auth/habit APIs found, if backend exists
- Docs found
- Static assets found
- Logo/theme reference images found
- Dead/duplicate candidates found

Do not skip this audit.

---

## 4. Reference asset handling

### 4.1 Logo reference

Use the user-provided logo as the brand source of truth.

Search likely locations:

- Attached files available to the coding environment
- `public/`
- `public/assets/`
- `src/assets/`
- `assets/`
- `app/assets/`
- `components/brand/`
- `docs/`
- root-level image files
- `/mnt/data/` if available in the execution environment

Required logo implementation:

- Create or update one reusable brand component, for example `LogoIcon`, `BrandMark`, or the project's existing equivalent.
- Use one canonical logo asset path.
- Replace all inconsistent old logos.
- Ensure the logo works at small sizes, including favicon-like 16px usage.
- Ensure it remains recognizable in monochrome.
- Do not add text to the icon unless the existing UI has a separate wordmark area.
- Do not use gradients, shadows, 3D effects, mockups, or watermarks for the logo.

If the only logo asset is raster, optimize usage and add a TODO in docs for future SVG conversion. If SVG conversion is practical and faithful, create a clean SVG/vector component.

### 4.2 Theme reference image

Use the user-provided theme reference image to reset the app palette.

Do this:

- Extract/approximate the key colors from the reference image.
- Map them into design tokens rather than hardcoding colors into components.
- Keep the palette restrained and premium.
- Use Deep Teal `#1D9E75` and Charcoal `#1C1B19` only if they match or complement the provided reference.
- Create light and dark token sets.
- Ensure body, cards, borders, muted surfaces, inputs, buttons, focus rings, badges, destructive actions, warnings, and success states all use tokens.

Do not do this:

- Do not leave old weird colors scattered across components.
- Do not use random gradients.
- Do not use low-contrast text.
- Do not hardcode theme-specific colors inside individual components unless the project convention requires it and there is no better token path.

---

## 5. Architecture rules

Map fixes into the app's architecture instead of randomly patching files.

### 5.1 Frontend flow

Use this flow where applicable:

```text
Page / Route -> Feature component -> Feature hook or state -> API/client service -> Backend endpoint
```

Presentation layer:

- Pages/routes
- Layouts
- Cards
- Forms
- Navigation
- Dialogs/popovers
- Brand/logo components

Application layer:

- Hooks
- View state
- Form state
- Theme state
- Habit interaction state

Domain layer:

- Habit rules
- Validation rules
- Formatting helpers
- Any productivity-specific logic

Infrastructure layer:

- API clients
- Storage adapters
- Auth/session clients
- Theme persistence
- Backend integration

### 5.2 Backend flow, if backend exists

Use this flow:

```text
Route -> Middleware -> Controller -> Service -> Model/Repository
```

Backend rules:

- Do not bypass auth middleware for protected habit/user data.
- Habit edit/delete must verify ownership.
- Validate request input before mutation.
- Sanitize production errors.
- Do not log secrets or raw auth tokens.
- Do not commit new secrets or `.env` values.

---

## 6. Multi-agent execution model

If the coding environment supports sub-agents, create these agents. If it does not, execute these workstreams sequentially in the same order while preserving file ownership rules.

Do not claim work is parallel unless the tooling actually runs it in parallel.

### Coordinator Agent - owner of source of truth and merge safety

Mission:

- Own the audit, shared contracts, merge order, final validation, and completion report.
- Prevent agents from editing the same files at the same time.
- Confirm reference assets are found and used.
- Confirm docs are updated.

Allowed files:

- Repo-wide read access
- `docs/**`
- `README*`
- project planning/checklist files
- shared token/config files after confirming ownership

Forbidden files:

- Do not rewrite unrelated business logic.
- Do not delete backend models, migrations, or APIs unless another workstream verifies they are dead and the Coordinator approves.
- Do not change lockfiles unless dependencies are intentionally changed.

Outputs:

- Audit checklist
- Shared file ownership map
- Component inventory
- Final completion report

Stop condition:

- All agents/workstreams have completed or documented blockers.
- Build/lint/typecheck/test/manual QA status is recorded.
- Docs are updated.

---

### Agent 1 - Brand and Theme Systems Agent

Mission:

- Apply the user-provided logo everywhere.
- Reset theme colors using the user-provided theme reference.
- Centralize colors in tokens.
- Ensure light/dark mode readability.

Allowed files:

- Theme/token files
- CSS/global styles
- Tailwind/config files, if present
- Brand/logo components
- App metadata/favicon files
- Asset files under `public`, `assets`, or `src/assets`
- Docs related to branding/theme

Forbidden files:

- Do not modify backend business logic.
- Do not rewrite unrelated feature components except to replace hardcoded colors with tokens.
- Do not add new theme libraries unless approved by Coordinator.

Tasks:

1. Locate existing theme implementation.
2. Locate logo usage and brand assets.
3. Replace inconsistent logos with one canonical brand mark.
4. Create/update semantic tokens for:
   - background
   - foreground
   - card
   - card foreground
   - popover
   - popover foreground
   - primary
   - primary foreground
   - secondary
   - secondary foreground
   - muted
   - muted foreground
   - accent
   - accent foreground
   - destructive
   - destructive foreground
   - border
   - input
   - ring/focus
   - success
   - warning
   - info, only if already used
5. Check both light and dark mode.
6. Remove weird hardcoded colors where safe.
7. Ensure focus states are visible.

Quality gates:

- Text contrast is readable in both themes.
- Primary action color feels premium and consistent.
- No component uses random one-off colors unless justified.
- Logo appears correctly in all brand locations.

Stop condition:

- Theme and logo are consistently implemented and documented.

---

### Agent 2 - Auth UI Agent

Mission:

- Fix the weird login and register pages.
- Make auth pages feel premium SaaS, calm, modern, trustworthy, and responsive.

Allowed files:

- Login page/route
- Register/signup page/route
- Auth layout
- Auth form components
- Auth-specific validation/error display components
- Brand component usage inside auth
- Auth page tests, if present

Forbidden files:

- Do not change backend auth behavior unless a real integration bug is found.
- Do not alter database schema.
- Do not replace the entire auth system.

Required UI behavior:

- Mobile-first layout.
- Clean centered form or split layout only if it remains elegant and responsive.
- Logo visible and correctly sized.
- Clear heading and supporting text.
- Inputs have label, placeholder, focus, disabled, error, and autofill states.
- Password visibility toggle if already supported or easy to add safely.
- Primary button loading state.
- Link between login and register pages.
- Error messages are visible but not ugly.
- Dark mode must look intentional, not inverted randomly.

Recommended visual style:

- White or near-white light theme background.
- Charcoal text.
- Deep teal or reference-based primary action.
- Subtle borders, not heavy shadows.
- Good vertical rhythm.
- No loud gradients.
- No 3D/mockup visuals.

Quality gates:

- Works at 320px width without overflow.
- Works on tablet without awkward huge spacing.
- Works on desktop without looking empty or stretched.
- Auth form fields are accessible and keyboard-friendly.

Stop condition:

- Login and register pages are polished, responsive, and validated in light/dark themes.

---

### Agent 3 - Responsive Cards and Layout Agent

Mission:

- Fix all card, grid, dashboard, list, and layout responsiveness problems.
- Stop content from overflowing outside cards.

Allowed files:

- Dashboard pages/routes
- Card components
- Grid/list components
- Layout components
- Responsive utility classes/styles
- Component-specific tests/stories if present

Forbidden files:

- Do not change API response shapes.
- Do not delete feature logic.
- Do not hide content just to pass layout checks unless text truncation is intentional and accessible.

Tasks:

1. Find every card-like component.
2. Check parent grid/flex containers.
3. Fix common overflow causes:
   - Missing `min-w-0`
   - Fixed widths on mobile
   - Long unbroken strings
   - Bad flex children
   - Fixed heights with dynamic content
   - Bad grid column definitions
   - Missing `overflow-hidden` where needed
   - Missing `break-words` or `text-wrap`
   - Cards with no responsive padding
4. Use responsive patterns:
   - Mobile: 1 column
   - Tablet: 1-2 columns depending on content
   - Desktop: 2-4 columns depending on content density
   - Prefer `grid-template-columns: repeat(auto-fit, minmax(...))` or framework equivalent where appropriate.
5. Use `line-clamp` only where truncation improves UX.
6. Add tooltips, expandable content, or detail views only where necessary.
7. Ensure cards have enough spacing but do not waste space.

Viewport audit:

- 320px
- 360px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px

Quality gates:

- No accidental horizontal page scroll.
- No text spills outside cards.
- No buttons or actions overlap text.
- Cards remain visually balanced.
- Empty, loading, and error states do not break layout.

Stop condition:

- All card/grid/list UI is responsive and overflow-safe.

---

### Agent 4 - Habit Interaction Agent

Mission:

- Implement or fix habit click behavior so edit and delete options appear when a habit is selected/clicked.

Allowed files:

- Habit components
- Habit card/list item components
- Habit hooks/state
- Habit edit modal/form
- Habit delete confirmation/undo UI
- Habit API client methods
- Habit backend route/controller/service only if required
- Habit tests

Forbidden files:

- Do not modify unrelated dashboard cards.
- Do not change unrelated auth behavior.
- Do not remove habit data fields without explicit need.

Required behavior:

- Clicking/selecting a habit reveals edit and delete options.
- On desktop, use an inline action row, contextual menu, popover, or visible selected state consistent with the existing UI library.
- On mobile, use a tappable action area, drawer, bottom sheet, or accessible menu if available.
- Edit opens the existing edit flow or creates a clean modal/form if missing.
- Delete requires confirmation or undo.
- Keyboard users can access actions.
- Screen readers can understand the actions.
- Clicking outside or pressing Escape closes contextual actions, where applicable.
- Completion toggle and edit/delete action must not conflict.

Security/data rules, if backend exists:

- User can only edit/delete their own habits.
- Validate habit ID.
- Validate mutation input.
- Prefer soft delete if existing system supports it.
- Do not silently cascade delete related analytics unless already designed.

Quality gates:

- Habit actions work on mobile, tablet, and desktop.
- No accidental delete from a single careless click.
- UI stays clean when no habit is selected.

Stop condition:

- Habit edit/delete discovery and execution are working, accessible, and tested.

---

### Agent 5 - Typography, Accessibility, Animation, and UI Library Agent

Mission:

- Ensure every component has correct text size, text color, contrast, focus, and visible UI/animation library integration.

Allowed files:

- Components
- Shared UI primitives
- Global styles
- Typography tokens
- Animation wrappers/utilities
- Accessibility tests/configs

Forbidden files:

- Do not add flashy animations that hurt usability.
- Do not install a new animation library if an existing one is already present.
- Do not reduce accessibility to achieve visual polish.

Tasks:

1. Inspect `package.json` for UI and animation libraries.
2. Find where these libraries are used.
3. Confirm visible UI components are actually rendering.
4. Confirm animation usage is subtle and purposeful.
5. Respect `prefers-reduced-motion` where applicable.
6. Check text color in light and dark mode.
7. Check typography scale:
   - Page title
   - Section heading
   - Card title
   - Body text
   - Muted metadata
   - Form labels
   - Input text
   - Button text
   - Error text
   - Empty states
8. Fix inaccessible muted text.
9. Fix overly small or inconsistent text sizes.
10. Ensure focus rings are visible.

Quality gates:

- No important text has poor contrast.
- No text is too tiny on mobile.
- No animations make the app feel unstable.
- Existing UI/animation libraries are either used properly or documented as unused cleanup candidates.

Stop condition:

- Visual readability and accessibility are improved across all checked components.

---

### Agent 6 - Codebase Cleanup and Backend Safety Agent

Mission:

- Remove verified unused/duplicate/broken code from frontend and backend while preserving production behavior.

Allowed files:

- Unused components
- Dead routes/pages
- Duplicate helpers
- Unused styles
- Unused assets
- Unused backend routes/controllers/services only after verification
- Tests and docs related to cleanup

Forbidden files:

- Do not delete migrations blindly.
- Do not delete data models blindly.
- Do not delete environment examples unless obsolete and replaced.
- Do not delete API behavior only because the current frontend does not call it.
- Do not modify lockfiles unless dependency cleanup requires it and tests pass.

Verification steps before deleting code:

1. Search imports/usages across the repo.
2. Check route registration.
3. Check dynamic imports.
4. Check barrel exports.
5. Check docs references.
6. Check tests/stories.
7. Check backend route mounting.
8. Check any config references.

Safe deletion criteria:

- No imports/usages found.
- Not registered as a route.
- Not referenced dynamically.
- Not referenced by tests/stories/docs as intended behavior.
- Not part of public API or migrations.
- Coordinator approves deletion.

If not safe to delete:

- Add it to a cleanup-candidates section in docs with reason and evidence.

Quality gates:

- App still builds.
- No broken imports.
- No removed behavior without evidence.
- No secret values introduced.
- No backend auth checks weakened.

Stop condition:

- Verified dead code is removed and risky candidates are documented, not blindly deleted.

---

### Agent 7 - QA, Testing, and Documentation Agent

Mission:

- Validate all changes, run checks, perform manual QA, and update existing documentation.

Allowed files:

- Tests
- Docs
- README
- CHANGELOG or release notes if present
- QA reports
- Component audit docs

Forbidden files:

- Do not modify implementation files except small testability fixes approved by Coordinator.

Required checks:

Use the package manager detected in the repo.

Run available commands, for example:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

or equivalent `pnpm`, `yarn`, `bun`, `turbo`, or monorepo commands.

If a command does not exist, record that clearly. Do not invent passing results.

Manual QA checklist:

- Login page light theme
- Login page dark theme
- Register page light theme
- Register page dark theme
- App shell logo placement
- Favicon/app icon, if applicable
- Dashboard/cards at 320px
- Dashboard/cards at 390px
- Dashboard/cards at 768px
- Dashboard/cards at 1024px
- Dashboard/cards at desktop width
- Habit click/select shows edit/delete
- Habit edit flow
- Habit delete confirmation/undo
- Empty states
- Loading states
- Error states
- Long text inside cards
- Navigation/sidebar on mobile
- Theme toggle/persistence
- Keyboard navigation
- Focus visibility
- Reduced motion behavior, if animations exist

Docs to update if present:

- `README.md`
- `docs/**`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- Design system/theme docs
- Component docs/stories
- API docs, if backend habit/auth behavior changed

Docs must include:

- Final theme token summary
- Logo asset path and usage rules
- Responsive behavior summary
- Habit edit/delete interaction summary
- Test commands run and results
- Known limitations, if any
- Cleanup candidates not safely removed

Stop condition:

- Validation results are recorded and docs reflect the final code.

---

## 7. Shared contracts before implementation

Before coding, define or confirm these contracts.

### 7.1 UI tokens contract

All components should use semantic tokens. Example names may differ by framework, but the concept must remain:

```text
background
foreground
card
cardForeground
popover
popoverForeground
primary
primaryForeground
secondary
secondaryForeground
muted
mutedForeground
accent
accentForeground
destructive
destructiveForeground
border
input
ring
success
warning
```

### 7.2 Logo contract

```text
Canonical logo component: [fill after inspection]
Canonical logo asset path: [fill after inspection]
Allowed logo sizes: 16, 20, 24, 32, 40, 48
Default logo color: theme primary or currentColor, depending on implementation
Logo must not include text unless explicitly used in a wordmark component
```

### 7.3 Habit interaction contract

```text
User action: click/select habit
UI response: reveal edit/delete actions for selected habit
Edit action: opens edit form/modal/sheet with current habit data
Delete action: requires confirmation or undo
Close behavior: outside click, Escape, route change, or selecting another habit
Accessibility: keyboard reachable and screen-reader labeled
Backend safety: user ownership required for mutations, if backend exists
```

### 7.4 Responsive card contract

```text
Mobile: 1 column, no horizontal overflow
Tablet: 1-2 columns depending on available width
Desktop: 2-4 columns depending on content density
Long text: wraps or clamps intentionally
Actions: never overlap primary content
Cards: use min-w-0 and overflow-safe layout patterns
```

### 7.5 Error contract

All errors shown to users must be clear and non-technical. All backend/internal errors must be sanitized in production.

---

## 8. Implementation phases and stop conditions

### Phase 1 - Audit and contracts

Tasks:

- Inspect repo structure.
- Identify framework, package manager, scripts, theme system, routes, components, backend structure, and docs.
- Find logo and theme reference assets.
- Create component inventory.
- Define shared contracts.
- Create file ownership map.

Stop condition:

- Audit notes, contracts, and ownership map exist before implementation begins.

### Phase 2 - Brand and theme foundation

Tasks:

- Apply logo through a canonical component.
- Reset theme tokens from reference image.
- Fix global light/dark variables.
- Remove obvious hardcoded weird colors.

Stop condition:

- Brand and theme are centralized and usable by other workstreams.

### Phase 3 - Auth UI repair

Tasks:

- Fix login page.
- Fix register page.
- Improve form states and responsive layout.
- Apply logo and theme tokens.

Stop condition:

- Auth pages look premium, responsive, and accessible in light/dark mode.

### Phase 4 - Cards, layout, and responsive repair

Tasks:

- Fix dashboard/card/list/grid responsiveness.
- Fix content overflow.
- Validate mobile/tablet/desktop breakpoints.

Stop condition:

- No accidental horizontal overflow or card content spill in tested viewports.

### Phase 5 - Habit edit/delete interactions

Tasks:

- Implement click/select behavior.
- Add edit/delete action visibility.
- Add confirmation/undo for delete.
- Validate backend ownership if applicable.

Stop condition:

- Habit edit/delete actions are discoverable, safe, responsive, and tested.

### Phase 6 - Typography, accessibility, and animation polish

Tasks:

- Check text colors and text sizes.
- Fix contrast issues.
- Verify UI/animation libraries are visible and purposeful.
- Respect reduced motion.

Stop condition:

- Text and animations feel polished and accessible across the app.

### Phase 7 - Verified cleanup

Tasks:

- Remove verified unused components/files/styles/assets/backend code.
- Document unsafe cleanup candidates.
- Confirm no broken imports or route registrations.

Stop condition:

- Cleanup is complete without deleting unverified production behavior.

### Phase 8 - Testing, docs, and final report

Tasks:

- Run lint/typecheck/tests/build as available.
- Perform manual QA checklist.
- Update docs.
- Produce final report.

Stop condition:

- Validation status and docs are complete.

---

## 9. Detailed UI acceptance criteria

### 9.1 Login and register pages

Must pass:

- Looks professional and premium.
- Logo appears in the correct place.
- Inputs align perfectly.
- Buttons use theme primary color.
- Error/loading states are styled.
- No awkward spacing on desktop.
- No overflow on mobile.
- Dark mode looks designed, not accidental.
- Form labels and helper text are readable.
- Keyboard navigation works.
- Autofill styling does not break the design.

### 9.2 Theme

Must pass:

- Light theme has clean background, readable foreground, premium cards.
- Dark theme has balanced contrast without harsh neon colors.
- Primary color is restrained and consistent.
- Muted text is visible.
- Destructive actions are clear but not ugly.
- Focus ring is visible in both themes.
- No weird old color remains in core UI.

### 9.3 Cards

Must pass:

- No card content spills outside boundaries.
- Long titles wrap or clamp cleanly.
- Long descriptions do not destroy layout.
- Buttons remain accessible.
- Card grids adapt by viewport.
- Empty/loading/error states do not break dimensions.

### 9.4 Habits

Must pass:

- Click/select habit reveals edit/delete actions.
- Edit action works.
- Delete action is protected by confirmation or undo.
- Mobile behavior is easy to use.
- Keyboard accessibility works.
- Ownership/security is preserved if backend exists.

### 9.5 Components

Must pass:

- Every route/page renders.
- Every active component renders correctly.
- Unused components are removed only after verification.
- No duplicate placeholder components remain.
- No broken import remains.
- Existing UI/animation libraries are either used intentionally or documented.

---

## 10. Responsive rules

Use mobile-first implementation.

Minimum viewport support:

```text
320px - smallest mobile
360px - common Android
390px - common iPhone
430px - large phone
768px - tablet
1024px - tablet landscape/small laptop
1280px - laptop
1440px - desktop
```

Rules:

- Avoid fixed width containers on mobile.
- Use `max-width` plus fluid width.
- Use `min-w-0` inside flex/grid children.
- Use `break-words` for long user-generated text.
- Use responsive padding.
- Avoid hiding important actions on mobile.
- Use accessible overflow containers for wide tables only.
- Do not rely only on hover for critical actions.

---

## 11. Accessibility rules

Required:

- Buttons have accessible names.
- Icon-only buttons have `aria-label` or equivalent.
- Dialogs/popovers manage focus correctly if the framework supports it.
- Escape closes menus/dialogs where expected.
- Error messages are associated with fields where practical.
- Focus states are visible.
- Color is not the only way to communicate errors/destructive actions.
- Text contrast should target WCAG AA.
- Respect `prefers-reduced-motion` for non-essential animations.

---

## 12. Security rules

Required if backend/auth exists:

- Never expose secrets.
- Never commit `.env` values.
- Protected routes require authentication.
- Habit edit/delete requires user ownership.
- Validate request body and route params before mutation.
- Sanitize errors in production.
- Do not weaken CORS, CSRF, cookie, or token handling.
- Do not log passwords, tokens, cookies, or sensitive user data.

---

## 13. Testing instructions

Detect the project tooling first. Then run the relevant available commands.

Examples:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

or:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

or monorepo equivalents.

Also perform static checks:

```bash
git status --short
```

Search for hardcoded colors after theme reset:

```bash
grep -R "#[0-9A-Fa-f]\{3,8\}" -n src app components pages styles public 2>/dev/null || true
```

Search for TODO/placeholder/demo leftovers:

```bash
grep -R "TODO\|FIXME\|placeholder\|demo\|dummy\|lorem\|test logo\|sample" -n src app components pages server backend api docs 2>/dev/null || true
```

Search for overflow-prone fixed widths:

```bash
grep -R "w-\[\|min-w-\[\|max-w-\[\|width:" -n src app components pages styles 2>/dev/null || true
```

Do not treat grep results as automatic failures. Inspect and fix only real issues.

---

## 14. Documentation requirements

Update existing docs. If no docs exist, create concise docs in the most appropriate location, such as `docs/ui-repair-report.md`.

Docs must include:

1. What was fixed
2. Logo source and implementation path
3. Theme token summary
4. Responsive changes
5. Habit edit/delete behavior
6. Accessibility changes
7. Dead code removed
8. Cleanup candidates not removed
9. Tests/checks run
10. Known limitations

Important:

- Outdated docs must not block implementation.
- If docs conflict with the current app, update the docs.
- Do not leave docs claiming the old weird theme or old logo is still active.

---

## 15. Final response format required from Codex

At the end, respond with this structure:

```text
Summary:
- [clear summary of what changed]

Files changed:
- [file]: [why]

Brand/theme:
- Logo applied at: [locations]
- Theme tokens changed: [summary]

UI fixes:
- Auth pages: [summary]
- Cards/responsive: [summary]
- Habits: [summary]
- Typography/accessibility: [summary]

Cleanup:
- Deleted verified dead code: [list]
- Cleanup candidates not deleted: [list with reason]

Validation:
- Lint: [pass/fail/not available]
- Typecheck: [pass/fail/not available]
- Tests: [pass/fail/not available]
- Build: [pass/fail/not available]
- Manual QA: [summary]

Docs updated:
- [list]

Known limitations:
- [only if any]

Stop condition:
- [state whether all acceptance criteria are met]
```

Do not claim a check passed unless you actually ran it. If a check cannot run because the project lacks a script or dependency, say that clearly and explain what was manually verified instead.

---

## 16. Hard rules and anti-patterns

Do not:

- Do not ignore the user-provided logo or theme reference image.
- Do not leave weird old colors in core UI.
- Do not fix only one screen and ignore the rest.
- Do not break mobile/tablet layouts.
- Do not hide overflowing content without thinking through UX.
- Do not make destructive habit delete available without confirmation or undo.
- Do not rely only on hover for edit/delete actions.
- Do not add excessive animations.
- Do not install unnecessary dependencies.
- Do not delete backend files blindly.
- Do not weaken auth/security.
- Do not commit secrets.
- Do not leave stale docs.
- Do not say complete if lint/build/tests fail without documenting why.
- Do not make broad rewrites unrelated to the reported problems.

Do:

- Inspect first.
- Work from shared contracts.
- Use semantic theme tokens.
- Keep components responsive.
- Preserve app behavior unless clearly broken.
- Remove verified dead code.
- Update docs.
- Record validation honestly.

---

## 17. Definition of done

This task is complete only when all of the following are true:

- Login page looks polished and responsive.
- Register page looks polished and responsive.
- User-provided logo is applied consistently.
- Theme is reset from the reference image and no weird palette remains in core UI.
- Light and dark theme text visibility is good.
- All card layouts are responsive on mobile/tablet/desktop.
- Card content no longer overflows.
- Habit click/select shows edit and delete options.
- Habit edit/delete flow works safely.
- Text sizes and colors are checked across components.
- Existing UI and animation libraries are integrated intentionally or documented as unused.
- Every major component/route has been checked for rendering.
- Verified dead/duplicate code is removed from frontend/backend.
- Risky cleanup candidates are documented instead of blindly deleted.
- Existing docs are updated.
- Lint/typecheck/tests/build are run where available.
- Final report is complete and honest.

