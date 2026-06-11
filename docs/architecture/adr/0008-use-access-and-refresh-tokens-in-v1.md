# ADR-0008: Use Access and Refresh Tokens in V1

## Context

V1 needs secure authentication for a self-hostable personal productivity dashboard.

The earlier 7-day single-JWT approach was simple, but it kept one token valid for the whole session lifetime and made session renewal less explicit.

The revised V1 direction requires short-lived access tokens and secure refresh tokens.

## Decision

Use short-lived access tokens plus rotated refresh tokens in V1.

- Access token: short-lived JWT returned to the frontend and stored in memory only.
- Refresh token: opaque token stored in a secure HttpOnly cookie and stored in MongoDB only as a hash.
- Refresh token rotation is required on login/register refresh issuance and on refresh.
- Protected backend routes validate the access token.

Default lifetimes:

```text
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_MAX_AGE_MS=604800000
```

## Alternatives considered

- 7-day JWT with no refresh tokens
- Server-side sessions
- Long-lived access tokens
- OAuth-only authentication

## Consequences

Short-lived access tokens reduce the blast radius of an exposed access token.

Refresh token rotation adds backend model/service complexity and requires a `refresh_tokens` collection.

The frontend must handle access-token expiry by attempting refresh once, retrying the original request once, and clearing auth state if refresh fails.

## Status

Accepted for V1.
