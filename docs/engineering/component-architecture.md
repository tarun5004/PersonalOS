# Component Architecture

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Component Goals

The frontend component system will be reusable, theme-aware, accessible, responsive, and simple enough for contributors to understand.

V1 will use Tailwind CSS v4 with custom reusable components.

The approved Next-Level OS track may introduce controlled shadcn/ui-derived primitives, Magic UI patterns, and Aceternity UI patterns when they are adapted into PersonalOS components and theme tokens. These libraries must not replace the PersonalOS visual identity or create a generic template/demo look.

## 2. Component Groups

### UI Components

Location:

```text
client/src/components/ui/
```

Planned components:

- `Button`
- `Input`
- `Card`
- `Modal`
- `Badge`
- `Select`
- `Checkbox`
- `Tabs`
- `Table`
- `Skeleton`
- `Loader`
- `LoadingState`
- `EmptyState`
- `ErrorState`
- `SuccessState`

### Layout Components

Location:

```text
client/src/components/layout/
```

Planned components:

- `AppLayout`
- `Sidebar`
- `Topbar`
- `PageHeader`

### Shared Components

Location:

```text
client/src/components/shared/
```

Planned components:

- `StatCard`
- `DashboardCard`
- `TaskCard`
- `NotificationCard`
- `EventCard`
- `CalendarSummaryCard`
- `SectionCard`
- `ConfirmDialog`
- `ProgressRing`
- `DatePicker`
- `MotionCard`
- `AnimatedNumber`
- `ConfettiReward`
- `LottieState`
- `ThreeCanvasShell`

The protected app shell should follow the approved PersonalOS visual direction:

- calm personal command center rather than a generic company dashboard
- mature neutral workspace surfaces with a restrained teal accent
- stable icon navigation with clear labels, active states, and keyboard focus
- clean topbar with clear page context and low visual noise
- rounded cards with subtle borders, restrained shadows, and consistent spacing
- dense but readable dashboard sections for daily life planning
- desktop and mobile layouts that preserve the same hierarchy
- viewport-height application shell rather than document-level webpage scrolling
- persistent sidebar, topbar, navigation, and user/profile context
- independently scrollable main content workspace with no double scrollbars

Reference-style cards may be used for layout structure before data APIs are complete, but they must not imply undocumented backend features are implemented.

Avoid visual patterns that make the app feel AI-generated or template-like: bright gradients, glow effects, glassmorphism, arbitrary accent colors, excessive border radius, and duplicated decorative card patterns.

Next-Level OS visual packages must follow these rules:

- shadcn/ui primitives may be copied/adapted into local `components/ui/` files, but app pages should still use PersonalOS shared components.
- Magic UI and Aceternity UI patterns may be adapted only for high-value moments such as command surfaces, achievement cards, premium empty states, and controlled visual accents.
- Framer Motion should handle page, card, modal, and achievement transitions.
- Auto Animate should handle low-cost list transitions for task columns, habit rows, and achievement lists.
- Lottie should be optional and used for a small set of empty/reward states.
- Canvas Confetti should trigger only for milestone moments.
- React CountUp should be used only for meaningful metrics.
- React Three Fiber and Three.js must be lazy-loaded and optional.

The visual identity modernization chunk before Phase 8 may polish Dashboard, Tasks, Habits, Analytics, Settings, Login, and Register screens using placeholder-safe structures only. It must not implement backend feature behavior or duplicate app layout code.

Phase 8 remains blocked pending UX and performance approval.

## 2.1 App Shell Scrolling Architecture

Protected routes must use a true application shell:

- Outer shell height equals the viewport height.
- Sidebar remains visible and full-height on desktop.
- Mobile navigation remains visible above the content workspace.
- Topbar remains visible because it lives outside the scrollable content region.
- `main` owns vertical scrolling for page content.
- The document/body should not become the primary scroll container for protected routes.
- Do not introduce nested scroll areas inside cards unless a specific component, such as a large grid or table, requires it.

This is required so PersonalOS feels like a daily-use desktop application rather than a long marketing or dashboard page.

## 3. Feature Components

Task components:

```text
client/src/features/tasks/components/
  TaskCard.jsx
  TaskForm.jsx
  TaskList.jsx
  TaskFilters.jsx
```

Habit components:

```text
client/src/features/habits/components/
  HabitGrid.jsx
  HabitCard.jsx
  HabitForm.jsx
  HabitCheckCell.jsx
```

Auth components:

```text
client/src/features/auth/components/
  AuthShell.jsx
```

Feature components may be added only when the active phase needs them.

## 4. Reuse Rules

- Same UI pattern must not be rebuilt in multiple feature folders.
- Shared controls belong in `components/ui/` or `components/shared/`.
- Feature components may compose shared components but should not redefine them.
- Components must use Tailwind utility classes backed by semantic theme variables.
- Components must support light and dark themes.
- Components must remain readable when animation, 3D, or generated assets fail to load.
- Avoid duplicated utility-class strings when a shared component would be clearer.
- Component-level CSS files should be removed during the Tailwind migration unless a specific exception is documented.

## 5. Async State Components

Every async UI will support:

- Loading
- Empty
- Error
- Success

Reusable components:

- `Skeleton`
- `Loader`
- `EmptyState`
- `ErrorState`
- `SuccessState`

Required areas:

- Dashboard cards
- Task list
- Habit list
- Monthly habit grid
- Analytics chart
- Login and register forms

## 6. Accessibility Rules

- Inputs must have labels.
- Buttons must be keyboard accessible.
- Focus states must be visible.
- Dialogs must manage focus reasonably.
- Error messages must be associated with affected fields where practical.
- Status must not rely on color alone.

## 7. Page Composition Rule

Pages will compose components and call hooks. Pages will not contain complex business logic, raw endpoint strings, or direct cache invalidation logic.

The intended flow is:

```text
Page -> Feature hook -> API client function -> Backend endpoint
```
