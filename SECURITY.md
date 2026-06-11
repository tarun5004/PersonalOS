# Security Policy

## Supported Versions

Personal OS is in early V1 development. Security fixes will focus on the active V1 codebase once implementation begins.

## Reporting a Vulnerability

Please report suspected security vulnerabilities privately.

Do not open a public issue, pull request, discussion, or comment for a suspected vulnerability until maintainers have reviewed it.

Preferred reporting process:

1. Use the repository hosting platform's private security advisory flow if it is available.
2. If private advisories are not available, contact the repository maintainer privately through the available project contact channel.
3. Include a clear description, affected area, reproduction steps, expected impact, and any suggested mitigation.

Maintainers should acknowledge valid reports as soon as practical, investigate privately, and coordinate disclosure after a fix or mitigation plan is ready.

## Security Expectations for V1

V1 security decisions include:

- Short-lived access tokens kept in frontend memory only
- Rotated refresh tokens stored in secure HttpOnly cookies
- Refresh tokens stored only as hashes in MongoDB
- No token storage in localStorage or sessionStorage
- Exact CORS origin with credentials
- Rate limiting on register, login, and refresh
- Zod validation for requests and environment variables
- Sanitized production errors
- No secrets committed to the repository

## Known V1 Tradeoffs

V1 same-domain refresh-cookie deployments rely on `sameSite: "lax"` as the primary CSRF mitigation for refresh and logout endpoints.

Cross-domain refresh-cookie deployment should use exact CORS, `secure: true`, `sameSite: "none"`, and CSRF protection before production use.
