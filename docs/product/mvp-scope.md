# MVP Scope

Status: Approved for V1 planning  
Source of truth: Master Prompt V4

## 1. MVP Definition

V1 will be a modular MERN productivity dashboard with authentication, tasks, habits, analytics, and theme support.

The MVP will be useful as a personal dashboard and maintainable as an open-source project. It will prioritize reliable core workflows over broad feature coverage.

## 2. In Scope

### Authentication

- Register
- Login
- Logout
- Protected frontend and backend routes
- Session restore through `GET /api/auth/me`
- Basic auth error handling
- JWT stored in an HttpOnly cookie

### Task Management

- Create, view, edit, and delete tasks
- Task fields: title, optional description, priority, due date, status
- Priority values: Low, Medium, High
- Status values: Todo, In Progress, Completed
- Default list limit of 50 items per request
- Future-ready `limit` and `offset` query support

### Habit Tracker

- Create, view, edit, and delete habits
- Daily check-in once per habit per day
- Monthly grid view
- Completion percentage
- Current streak
- Longest streak
- Daily habit score

### Dashboard

- Fixed V1 dashboard layout
- Welcome message
- Today's task summary
- Today's habit summary
- Productivity score
- Current streak
- Weekly overview chart

### Analytics

- Task completion rate
- Habit consistency
- Daily productivity score
- Weekly productivity chart for the last 7 days including today

### Theme System

- Light theme
- Dark theme
- CSS-variable token system for future community themes

## 3. Out of Scope

V1 will not include:

- OAuth
- Magic links
- Two-factor authentication
- Password reset
- Team accounts
- Admin panel
- Advanced RBAC
- Real-time collaboration
- Mobile app
- Plugin marketplace
- AI features
- Kanban drag-and-drop
- Subtasks
- Recurring tasks
- Team assignment
- File attachments
- Habit reminders
- Habit categories
- Habit sharing
- Habit templates
- Negative habits
- Advanced frequency rules
- Predictive analytics
- Yearly analytics
- Exportable reports
- Drag-and-drop dashboard customization

## 4. Known V1 Product Limitations

- Habit streaks and habit check-ins will use a UTC day boundary rather than the user's local day boundary.
- The dashboard layout will be fixed in V1. Modular means components will be independently built and swappable in the layout definition.
- Deleted tasks and habits will be permanently removed. Deleted data will no longer appear in historical analytics.
- Weekly analytics will cover the last 7 days including today.
- If a day has no tasks and no habits tracked, the score will be `null`, and the chart will show a gap rather than 0.

## 5. MVP Acceptance Criteria

- Users can authenticate and restore a valid session.
- Users can manage tasks and habits through responsive screens.
- Dashboard gives a useful same-day snapshot.
- Analytics gives a clear weekly trend.
- Theme support is token-based and prepared for contribution.
- Documentation is approved before implementation begins.
