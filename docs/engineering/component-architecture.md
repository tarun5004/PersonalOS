# Component Architecture

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved Phase 0-A docs

## 1. Component Goals

The frontend component system will be reusable, theme-aware, accessible, and simple enough for contributors to understand.

V1 will build custom components inspired by shadcn/ui patterns. It will not install shadcn/ui as a dependency.

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
- `Skeleton`
- `EmptyState`
- `ErrorState`

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
- `SectionCard`
- `ConfirmDialog`
- `ProgressRing`
- `DatePicker`

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

## 4. Reuse Rules

- Same UI pattern must not be rebuilt in multiple feature folders.
- Shared controls belong in `components/ui/` or `components/shared/`.
- Feature components may compose shared components but should not redefine them.
- Components must use theme variables for colors.
- Components must support light and dark themes.

## 5. Async State Components

Every async UI will support:

- Loading
- Empty
- Error
- Success

Reusable components:

- `Skeleton`
- `EmptyState`
- `ErrorState`

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
