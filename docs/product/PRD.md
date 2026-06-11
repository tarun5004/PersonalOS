# Personal OS Product Requirements Document

Status: Approved for V1 planning  
Source of truth: Master Prompt V4

## 1. Product Summary

Personal OS will be an open-source personal productivity operating system for students, developers, job seekers, freelancers, and remote workers.

V1 will be a modular MERN productivity dashboard with authentication, tasks, habits, analytics, and theme support. The product will feel like a personal operating system through a unified dashboard, modular feature structure, reusable components, theme customization, clean architecture, and future extensibility. It will not be a real operating system.

## 2. Product Goals

- Help individuals plan daily work, track habits, and review progress in one dashboard.
- Provide a clean, modern, self-hostable productivity app that contributors can understand and extend.
- Keep V1 focused on core workflows rather than advanced collaboration, marketplace, AI, or mobile features.
- Establish a docs-first foundation so future implementation can be reviewed phase by phase.

## 3. Target Users

- Students managing assignments, study habits, and daily planning.
- Developers balancing coding tasks, learning goals, and recurring routines.
- Job seekers tracking applications, preparation tasks, and consistency habits.
- Freelancers organizing client work, routines, and weekly progress.
- Remote workers maintaining daily focus and personal accountability.

## 4. V1 Feature Set

### Authentication

Users will be able to register, log in, log out, and restore their session after page refresh. V1 will use cookie-based JWT authentication with an HttpOnly cookie.

### Task Management

Users will be able to create, view, edit, delete, and update tasks. Each task will include a title, optional description, priority, due date, and status.

### Habit Tracking

Users will be able to create, view, edit, delete, and complete habits once per day. The habit experience will include a monthly grid, completion percentage, current streak, longest streak, and daily habit score.

### Dashboard

Users will see a fixed modular dashboard with a welcome message, today's task summary, today's habit summary, productivity score, current streak, and a weekly overview chart.

### Analytics

Users will see V1 analytics for task completion rate, habit consistency, daily productivity score, and a weekly productivity chart.

### Theme Support

Users will be able to use light and dark themes. The architecture will support future community themes through CSS variables.

## 5. User Value

Personal OS will reduce the need for separate tools for daily tasks, habits, and basic progress review. It will make personal productivity visible without requiring complex setup or team workflows.

For contributors, the product will provide a clear folder structure, documented rules, and reusable components so new features can be added without major refactoring.

## 6. V1 Boundaries

V1 will not include OAuth, magic links, 2FA, password reset, team accounts, admin panels, real-time collaboration, drag-and-drop dashboard customization, Kanban boards, subtasks, recurring tasks, reminders, file attachments, plugin marketplaces, AI features, mobile apps, or advanced RBAC.

## 7. Success Criteria

- A new user can register, log in, and return later with their session restored.
- A user can manage tasks and habits through clear, responsive screens.
- A user can understand today's progress from the dashboard.
- A user can review the last 7 days of productivity through analytics.
- A contributor can understand product scope from docs before reading implementation code.

## 8. Product Principles

- Keep V1 small, useful, and maintainable.
- Prefer clear workflows over feature breadth.
- Make empty, loading, error, and success states visible and helpful.
- Use consistent language and reusable UI patterns.
- Avoid hidden complexity that would make the project harder for new contributors.
