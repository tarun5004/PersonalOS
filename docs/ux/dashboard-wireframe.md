# Dashboard Wireframe

Status: Approved for V1 planning  
Source of truth: Master Prompt V4

## 1. Dashboard Purpose

The dashboard will be the first authenticated screen. It will summarize today's productivity and provide a quick weekly trend without requiring the user to open every feature area.

## 2. V1 Layout Model

The V1 dashboard will use a fixed layout. Modular means cards and sections will be independently built and swappable in the layout definition. Users will not drag, resize, or rearrange dashboard modules in V1.

The layout will be based on CSS Grid with named template areas during implementation.

## 3. Visual Reference Notes

The provided dashboard reference supports a clean SaaS-style dashboard direction: a persistent navigation area, a simple topbar, rounded content regions, concise cards, and a light visual hierarchy.

The reference is composition inspiration only. It does not add V1 requirements for assignments, calendars, notifications, export actions, premium prompts, collaboration, boards, or integrations.

## 4. Desktop Wireframe

```text
+--------------------------------------------------------------+
| Topbar: page title, user menu, theme control                  |
+------------------+-------------------------------------------+
| Sidebar          | Welcome message                           |
|                  +------------------+------------------------+
| Dashboard        | Today's tasks    | Today's habits         |
| Tasks            +------------------+------------------------+
| Habits           | Productivity     | Current streak         |
| Analytics        | score            |                        |
| Settings         +-------------------------------------------+
|                  | Weekly overview chart                     |
+------------------+-------------------------------------------+
```

## 5. Mobile Priority

On smaller screens, dashboard sections will stack in this order:

1. Welcome message
2. Today's tasks summary
3. Today's habits summary
4. Productivity score
5. Current streak
6. Weekly overview chart

## 6. Required Dashboard Modules

### Welcome Message

The welcome area will greet the user and orient them to today's work.

### Today's Tasks Summary

This module will show task progress for the current day, including completed and remaining tasks.

The exact definition of "today's tasks" will be finalized in Phase 0-B API and domain rules.

### Today's Habits Summary

This module will show habit completion for the current UTC day.

### Productivity Score

This module will show the daily productivity score. If there are no tasks and no habits tracked today, it will show "No activity tracked today." It will not show 0 or 100 in that state.

### Current Streak

This module will highlight the current habit streak based on V1 UTC day-boundary rules.

### Weekly Overview Chart

This module will show the last 7 days including today. Days with no tasks and no habits will have a `null` score and will appear as gaps rather than 0.

The dashboard weekly overview chart will reuse the approved weekly analytics data contract rather than defining a separate scoring model.

## 7. States

Every dashboard module will support:

- Loading state
- Empty state
- Error state
- Success state

## 8. Visual Direction

The dashboard should feel like a personal life control center rather than a company analytics dashboard.

Use the provided dashboard references for layout hierarchy, information density, navigation organization, and compact dashboard modules. Do not copy their colors, branding, or startup-dashboard appearance.

Dashboard cards should be scannable, calm, and useful. The page should avoid marketing-style hero sections, decorative clutter, AI-style gradients, glow effects, and feature cards that are not connected to real V1 data.

Reference-inspired visual cards may be used as placeholders for the shell, dashboard composition, and reusable component structure. They do not add V1 requirements for boards, premium prompts, integrations, collaboration, or calendar-backed scheduling.

Phase 8 is blocked until PersonalOS visual review is approved.
