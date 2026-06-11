# ADR-0004: Use TanStack Query for Server State

## Context

Personal OS will rely on server data for tasks, habits, dashboard summary, analytics, and auth session restore.

The project needs caching, loading states, error states, mutations, and invalidation without introducing global state complexity.

## Decision

Use TanStack Query for server state in V1.

React Context will be reserved for auth user and theme state.

## Alternatives considered

- Redux
- Local component state for server data
- React Context for all server data
- Manual fetch and cache logic

## Consequences

TanStack Query gives clear server-state ownership and predictable invalidation.

Contributors must keep API calls centralized and avoid duplicating server state in local state.

## Status

Accepted for V1.

