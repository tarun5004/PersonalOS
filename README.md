# Personal OS

Personal OS is an open-source personal productivity dashboard for students, developers, job seekers, freelancers, and remote workers.

V1 will be a modular MERN productivity dashboard with authentication, tasks, habits, analytics, and theme support.

## V1 Scope

V1 will include:

- Cookie-based authentication
- Task management
- Habit tracking
- Dashboard summary
- Weekly analytics
- Light and dark theme support
- Open-source contribution workflow

The "OS" idea means a unified dashboard experience, modular feature structure, reusable components, theme customization, clean architecture, and future extensibility. Personal OS will not be a real operating system.

## Non-Goals for V1

V1 will not include:

- OAuth
- Password reset
- Two-factor authentication
- Team accounts
- Admin panel
- Real-time collaboration
- Plugin marketplace
- AI features
- Mobile app
- Advanced RBAC
- Redux
- TypeScript as a mandatory requirement
- shadcn/ui as an installed dependency
- Microservices
- Kubernetes

## Architecture Direction

Personal OS follows a docs-first, four-layer architecture:

- Presentation: pages, layouts, UI components, route screens, states
- Application: hooks, form coordination, validation, server-state coordination
- Domain: business rules, constants, validation schemas, score and streak rules
- Infrastructure: API clients, Express routes, controllers, services, models, middleware, config

Backend flow:

```text
Route -> Middleware -> Controller -> Service -> Model
```

Frontend API flow:

```text
Page -> Feature hook -> API client function -> Backend endpoint
```

## Repository Status

This repository is being built phase by phase.

Phase 1 establishes the repository foundation only. Application implementation will be added in later approved phases.

## Local Setup Direction

Implementation setup commands will be finalized as the frontend and backend are created in later phases.

Current direction:

1. Review the approved docs in `docs/`.
2. Copy `.env.example` into the appropriate local environment files when implementation phases begin.
3. Use npm for V1.
4. Use Docker Compose only as a self-hosting direction stub until app services are implemented.

## Phase-Based Workflow

Work is controlled by `STEPS.md`.

Do not jump phases. Each phase should be small, reviewable, testable, and production-minded.

Developer approval is required before moving to the next phase.

## Documentation

Important docs:

- `docs/product/`
- `docs/ux/`
- `docs/engineering/`
- `docs/open-source/`
- `docs/architecture/adr/`
- `docs/review/`
- `STEPS.md`
- `AGENTS.md`

## Security

Security issues should be reported privately through the process in `SECURITY.md`.

Please do not open public issues for suspected vulnerabilities until maintainers have reviewed them.

## License

Personal OS is licensed under the MIT License.

