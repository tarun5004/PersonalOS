# Coding Standards

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, corrected Phase 0-B docs

## 1. General Style

Future implementation code should be production-style, readable, and well-structured.

Prefer boring clarity over clever abstractions. Avoid hidden magic, vague helper names, and unexplained framework tricks.

## 2. JavaScript

V1 will use JavaScript. TypeScript must not become mandatory for V1.

Use functional React components and hooks. Do not use React class components.

## 3. Architecture

Respect the four layers:

- Presentation: pages, layouts, UI components, route screens, states
- Application: hooks, form coordination, client validation, query coordination
- Domain: business rules, constants, validation schemas, scoring, streaks
- Infrastructure: API clients, Express routes, controllers, services, models, middleware, env config

Backend flow:

```text
Route -> Middleware -> Controller -> Service -> Model
```

Frontend API flow:

```text
Page -> Feature hook -> API client function -> Backend endpoint
```

## 4. Naming

Use specific names:

- `TaskCard.jsx`
- `TaskForm.jsx`
- `useTasks.js`
- `taskApi.js`
- `task.validation.js`
- `task.service.js`

Avoid vague names:

- `helper.js`
- `utils2.js`
- `data.js`
- `stuff.js`

## 5. Comments

Comments should explain why important decisions exist.

Required comment areas:

- Complex business rules
- Score and streak calculations
- Date and timezone handling
- Security-sensitive logic
- Middleware behavior

Avoid comments that merely repeat what obvious code already says.

## 6. Validation and Errors

Use documented validation before controllers reach services.

Use centralized error handling. Do not return random error shapes.

Frontend API errors should be normalized before reaching UI components.

## 7. UI Standards

Components must use theme variables. Do not hardcode component colors.

Every async UI should handle:

- Loading
- Empty
- Error
- Success

Inputs need labels, visible focus states, and accessible error messages.

## 8. Tests

Add focused tests where the active phase requires them.

Domain logic should be testable without UI or database dependencies.

Backend services and domain logic target 70% coverage for V1.
