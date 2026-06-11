# Habit Tracker UX

Status: Approved for V1 planning  
Source of truth: Master Prompt V4

## 1. Habit Tracker Purpose

The habit tracker will help users build consistency through daily check-ins, streak visibility, and a monthly completion grid.

## 2. Visual Reference Notes

The provided paper tracker reference supports the V1 direction for a monthly habit grid: habits listed as rows, days shown as columns, and clear completed/missed states.

The reference also shows a daily habit score graph. In V1, the approved requirements are monthly grid view, completion percentage, current streak, longest streak, and daily habit score. A separate monthly habit-score graph will not be added unless explicitly approved in a later phase.

## 3. Primary Habit Screen

The Habits page will include:

- Habit list
- Create habit action
- Edit habit action
- Delete habit action
- Daily check-in control
- Monthly grid view
- Completion percentage
- Current streak
- Longest streak
- Daily habit score

## 4. Habit Card

Each habit card will show:

- Habit name
- Today's completion state
- Check-in control
- Current streak
- Completion signal for the selected period where useful

The card should not require the user to navigate away for the common daily check-in action.

## 5. Monthly Grid

The monthly grid will show habits as rows and one cell per day in the selected month. Completed days will be visually distinct from missed, incomplete, or future days. The UI must not rely on color alone; labels, icons, or accessible text should communicate state.

The grid should remain readable on smaller screens through responsive layout decisions made during implementation, such as horizontal scrolling or a compact mobile view.

## 6. Check-In Rule

A habit can be marked completed once per day. V1 will use UTC day boundaries for this rule.

When the habit is already completed for the current UTC day, the check-in control will show completed state rather than creating another check-in.

## 7. Streak Display

Current streak will count consecutive completed UTC days back from today. A missed day resets it to 0.

Longest streak will show the maximum consecutive completed-day sequence across all recorded history.

## 8. Completion Percentage

Completion percentage will be calculated as completed days in the selected month divided by total days in that month, multiplied by 100.

Edge cases, including habits created mid-month, will be finalized in Phase 0-B engineering domain rules.

## 9. Empty States

If the user has no habits, the page will explain that no habits exist yet and provide a direct create action.

## 10. Error States

If habits fail to load or a check-in fails, the UI will show a clear error with a retry path where useful. Form validation errors will appear near the relevant field.

## 11. Accessibility

The habit tracker will use semantic buttons, visible focus states, accessible labels, and non-color-only status indicators.
