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

- JWT stored in an HttpOnly cookie
- No JWT storage in localStorage or sessionStorage
- Exact CORS origin with credentials
- Rate limiting on register and login
- Zod validation for requests and environment variables
- Sanitized production errors
- No secrets committed to the repository

## Known V1 Tradeoffs

V1 does not implement CSRF tokens. Same-domain deployments rely on `sameSite: "lax"` as the primary CSRF mitigation.

Cross-domain cookie deployment without CSRF tokens is a deliberate V1 tradeoff and should be avoided unless required.

