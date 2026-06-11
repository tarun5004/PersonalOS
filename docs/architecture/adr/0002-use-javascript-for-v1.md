# ADR-0002: Use JavaScript for V1

## Context

The project should be approachable for contributors and should not make TypeScript mandatory in V1.

The primary developer is strongest in JavaScript.

## Decision

Use JavaScript for V1 frontend and backend implementation.

TypeScript may be considered after V1, but it will not be required for V1.

## Alternatives considered

- TypeScript across frontend and backend
- TypeScript frontend with JavaScript backend
- Gradual JSDoc-heavy typing

## Consequences

JavaScript lowers initial setup complexity and keeps V1 focused.

The project must rely on good validation, clear naming, tests, and documentation to reduce ambiguity.

## Status

Accepted for V1.

