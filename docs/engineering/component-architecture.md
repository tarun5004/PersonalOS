# Component Architecture

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Component Goals

The frontend component system will be reusable, theme-aware, accessible, responsive, and simple enough for contributors to understand.

V1 will use Tailwind CSS v4 with custom reusable components. It will not install shadcn/ui as a dependency.

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

The protected app shell should follow the approved dashboard reference direction:

- soft white dashboard workspace
- purple-to-teal gradient icon navigation rail
- clean topbar with clear page context
- rounded cards with restrained shadows
- dense but readable dashboard sections
- desktop and mobile layouts that preserve the same hierarchy

Reference-style cards may be used for visual structure before data APIs are complete, but they must not imply undocumented backend features are implemented.

The UI stabilization chunk before Phase 8 may polish Dashboard, Tasks, Habits, Analytics, Settings, Login, and Register screens using placeholder-safe structures only. It must not implement backend feature behavior or duplicate app layout code.

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
