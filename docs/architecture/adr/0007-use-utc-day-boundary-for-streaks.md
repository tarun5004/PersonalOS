# ADR-0007: Use UTC Day Boundary for Streaks

## Context

Habit check-ins, streaks, dashboard daily summaries, and weekly analytics need a consistent day boundary.

Local timezone handling adds complexity and edge cases that are out of scope for V1.

## Decision

Use UTC day boundaries for V1 habit check-ins, streak calculations, dashboard daily summaries, and weekly analytics.

## Alternatives considered

- User-local timezone boundaries
- Browser-derived timezone boundaries
- Per-user timezone setting
- Server-local timezone boundaries

## Consequences

UTC boundaries keep V1 simpler and deterministic.

This is a known V1 limitation. Users near day boundaries may see behavior that differs from their local calendar day.

## Status

Accepted for V1.

