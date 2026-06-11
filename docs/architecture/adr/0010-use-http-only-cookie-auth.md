# ADR-0010: Use HttpOnly Cookie Authentication

## Context

V1 authentication needs to avoid exposing JWTs to frontend JavaScript.

The app will restore auth state through `GET /api/auth/me` and rely on browser-sent cookies for protected requests.

## Decision

Store the JWT in an HttpOnly cookie.

Frontend JavaScript must not read or store the token in localStorage or sessionStorage.

Cookie configuration will be controlled by environment variables, including `COOKIE_SAME_SITE`, `COOKIE_SECURE`, and `COOKIE_MAX_AGE_MS`.

## Alternatives considered

- Store JWT in localStorage
- Store JWT in sessionStorage
- Server-side sessions
- OAuth for V1

## Consequences

HttpOnly cookies reduce token exposure to frontend JavaScript.

Same-domain deployments rely on `sameSite: "lax"` as the primary V1 CSRF mitigation. Cross-domain cookie deployments without CSRF tokens are a deliberate V1 tradeoff and should be avoided unless required.

## Status

Accepted for V1.

