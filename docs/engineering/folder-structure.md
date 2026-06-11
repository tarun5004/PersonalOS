# Folder Structure

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved Phase 0-A docs

## 1. Repository Structure

The V1 repository will use one repo with separate frontend and backend folders:

```text
personal-os/
  client/
  server/
  docs/
  STEPS.md
  README.md
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  SECURITY.md
  CHANGELOG.md
  LICENSE
  .env.example
  docker-compose.yml
```

The project will not use separate repositories for client and server in V1.

The project will not introduce npm workspaces, Turborepo, or other workspace tooling unless explicitly approved.

## 2. Frontend Structure

The React app will be organized by shared UI and feature modules:

```text
client/
  src/
    app/
      routes/
      providers/
    components/
      ui/
      layout/
      shared/
    features/
      auth/
      tasks/
      habits/
      dashboard/
      analytics/
      settings/
    hooks/
    lib/
    themes/
```

## 3. Frontend Layer Mapping

Presentation layer:

- `components/ui/`
- `components/layout/`
- `components/shared/`
- Feature components
- Route pages

Application layer:

- Feature hooks such as `useTasks`, `useHabits`, `useAuth`, `useDashboard`, `useTheme`
- Form coordination
- Query and mutation coordination

Domain layer:

- Validation schemas
- Constants
- Enums
- Pure score and streak helpers where used by frontend

Infrastructure layer:

- API client
- Feature API functions
- Error normalization

## 4. Backend Structure

The Express app will follow route to middleware to controller to service to model:

```text
server/
  src/
    app.js
    server.js
    config/
    middleware/
    errors/
    utils/
    modules/
      auth/
      tasks/
      habits/
      dashboard/
      analytics/
    domain/
      habits/
      analytics/
```

## 5. Backend Module Pattern

Each backend feature module will use explicit file names:

```text
feature.routes.js
feature.controller.js
feature.service.js
feature.model.js
feature.validation.js
```

Examples:

- `task.routes.js`
- `task.controller.js`
- `task.service.js`
- `task.model.js`
- `task.validation.js`

## 6. Naming Rules

- React components use PascalCase, such as `TaskCard.jsx`.
- Hooks use camelCase and start with `use`, such as `useTasks.js`.
- API files use feature names, such as `taskApi.js`.
- Backend files use feature dot naming, such as `task.service.js`.
- Avoid vague names like `helper.js`, `utils2.js`, `data.js`, or `stuff.js`.

## 7. Phase Boundaries

Folders should be created when the active phase needs them.

Do not pre-build full feature structures before the approved implementation phase.
