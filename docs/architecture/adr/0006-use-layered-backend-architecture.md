# ADR-0006: Use Layered Backend Architecture

## Context

The backend will include authentication, tasks, habits, dashboard summary, analytics, validation, security middleware, and error handling.

The codebase needs clear ownership boundaries for maintainability and testing.

## Decision

Use the backend flow:

```text
Route -> Middleware -> Controller -> Service -> Model
```

Routes bind paths and middleware. Controllers stay thin. Services hold business logic and database coordination. Models define schemas and indexes.

## Alternatives considered

- Controller-heavy Express routes
- Service-only modules without controllers
- Repository pattern for V1
- Microservices

## Consequences

Layering improves testability and keeps business logic out of routes.

The project must avoid adding abstractions that do not remove real complexity.

## Status

Accepted for V1.

