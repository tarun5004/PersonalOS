# ADR-0005: Avoid Redux in V1

## Context

V1 does not need complex client-side global state.

The approved state model is local React state for UI state, React Context for auth and theme, and TanStack Query for server state.

## Decision

Do not use Redux in V1.

## Alternatives considered

- Redux Toolkit
- Zustand
- React Context for all state
- TanStack Query plus local state

## Consequences

Avoiding Redux reduces boilerplate and keeps V1 simpler.

If future requirements create complex client-only global state, the decision can be revisited after V1.

## Status

Accepted for V1.

