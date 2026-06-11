# ADR-0008: Use 7-Day JWT Without Refresh Tokens in V1

## Context

V1 needs simple authentication that is secure enough for a self-hostable personal productivity dashboard.

Refresh tokens add storage, rotation, invalidation, and security complexity.

## Decision

Use a 7-day JWT expiry with no refresh tokens in V1.

`JWT_EXPIRES_IN=7d` must align with `COOKIE_MAX_AGE_MS=604800000`.

## Alternatives considered

- Short-lived access tokens with refresh tokens
- Server-side sessions
- Long-lived tokens
- OAuth-only authentication

## Consequences

The auth model stays simpler for V1.

Users must log in again after token expiry. Startup validation must fail if JWT and cookie expiry configuration drift.

## Status

Accepted for V1.

