# Information Architecture

Status: Approved for V1 planning  
Source of truth: Master Prompt V4

## 1. IA Goals

The V1 interface will make the core productivity areas easy to find: Dashboard, Tasks, Habits, Analytics, and Settings. Navigation will be predictable, responsive, and suitable for repeated daily use.

## 2. Primary Navigation

Authenticated users will see:

- Dashboard
- Tasks
- Habits
- Analytics
- Settings

Unauthenticated users will see:

- Login
- Register

## 3. Route-Level Structure

The planned user-facing route structure will be:

- `/login`
- `/register`
- `/dashboard`
- `/tasks`
- `/habits`
- `/analytics`
- `/settings`

Route names may be reviewed during engineering docs, but V1 navigation should stay this simple unless explicitly approved.

## 4. Dashboard Information Priority

The dashboard will prioritize:

1. Welcome message
2. Today's tasks summary
3. Today's habits summary
4. Productivity score
5. Current streak
6. Weekly overview chart

## 5. Tasks IA

The Tasks area will include:

- Task list
- Task create/edit form
- Filters using URL query params where useful
- Loading, empty, error, and success states
- Delete confirmation where appropriate

## 6. Habits IA

The Habits area will include:

- Habit list
- Habit create/edit form
- Daily check-in control
- Monthly habit grid
- Completion percentage
- Current and longest streak indicators
- Loading, empty, error, and success states

## 7. Analytics IA

The Analytics area will include:

- Task completion rate
- Habit consistency
- Daily productivity score
- Weekly productivity chart
- Clear treatment for `null` score days as gaps

## 8. Settings IA

Settings in V1 will focus on theme selection and basic authenticated user context where required. Full account management is out of scope unless approved in a later phase.

## 9. Responsive Behavior

Desktop navigation will use an app layout with sidebar and topbar. Smaller screens will preserve access to the same primary areas with a responsive navigation pattern defined during implementation.
