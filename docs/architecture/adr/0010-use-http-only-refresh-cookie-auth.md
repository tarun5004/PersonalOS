# ADR-0010: Use HttpOnly Refresh Cookie Authentication

## Context

V1 authentication needs to avoid exposing long-lived credentials to frontend JavaScript.

The app will restore auth state through refresh-token rotation and protect APIs with short-lived access tokens.

## Decision

Store only the refresh token in an HttpOnly cookie.

Frontend JavaScript must not read or store access tokens or refresh tokens in localStorage or sessionStorage.

The access token may live in frontend memory only and must be sent to protected APIs through the `Authorization` header.

Refresh cookie configuration will be controlled by environment variables, including `COOKIE_SAME_SITE`, `COOKIE_SECURE`, `REFRESH_TOKEN_COOKIE_NAME`, and `REFRESH_TOKEN_MAX_AGE_MS`.

## Alternatives considered

- Store access token in localStorage
- Store access token in sessionStorage
- Store a single long-lived JWT in an HttpOnly cookie
- Server-side sessions
- OAuth for V1

## Consequences

HttpOnly refresh cookies reduce long-lived token exposure to frontend JavaScript.

Access-token-in-memory behavior means a page refresh requires a refresh call before protected data can load.

Same-domain deployments rely on `sameSite: "lax"` as the primary V1 CSRF mitigation for refresh-cookie endpoints. Cross-domain refresh-cookie deployments without CSRF protection are not recommended.

## Status

Accepted for V1.
