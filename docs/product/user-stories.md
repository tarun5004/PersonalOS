# User Stories

Status: Approved for V1 planning  
Source of truth: Master Prompt V4

## Authentication

- As a new user, I want to register with my name, email, and password so I can create my personal dashboard.
- As a returning user, I want to log in so I can access my tasks, habits, and analytics.
- As a signed-in user, I want my session restored after refresh so I do not have to log in repeatedly during the valid session window.
- As a signed-in user, I want to log out so my session is cleared from the browser.
- As a user with an expired session, I want to be redirected to login without seeing a confusing error page.

## Tasks

- As a user, I want to create a task with a title so I can track work I need to complete.
- As a user, I want to add an optional description so I can capture useful context.
- As a user, I want to set priority as Low, Medium, or High so I can decide what matters most.
- As a user, I want to set a due date so time-sensitive work appears in my planning.
- As a user, I want to update task status as Todo, In Progress, or Completed so my progress is visible.
- As a user, I want to edit a task so I can correct or refine it.
- As a user, I want to delete a task so outdated work no longer affects my dashboard.

## Habits

- As a user, I want to create a habit so I can track repeated behavior.
- As a user, I want to edit a habit so I can rename or adjust it.
- As a user, I want to delete a habit so it no longer appears in my tracker.
- As a user, I want to mark a habit complete once per day so daily consistency is recorded.
- As a user, I want to see a monthly grid so I can scan habit history.
- As a user, I want to see current and longest streaks so I can understand consistency.
- As a user, I want to see completion percentage so I can evaluate the selected month.

## Dashboard

- As a user, I want a welcome message so the app feels personal.
- As a user, I want today's task summary so I can understand current workload.
- As a user, I want today's habit summary so I can keep routines visible.
- As a user, I want a productivity score so I can quickly understand today's progress.
- As a user, I want a current streak indicator so consistency is visible.
- As a user, I want a weekly overview chart so I can see trends across the last 7 days.

## Analytics

- As a user, I want to see task completion rate so I can measure execution.
- As a user, I want to see habit consistency so I can measure routine follow-through.
- As a user, I want to see a daily productivity score so tasks and habits are summarized together.
- As a user, I want the weekly chart to show gaps for days with no tracked activity so I do not mistake missing data for poor performance.

## Themes

- As a user, I want light and dark themes so the app works in different environments.
- As a contributor, I want themes to use Tailwind-backed semantic variables so new themes can be added consistently.
- As a contributor, I want theme rules documented so community themes follow the same token set.
