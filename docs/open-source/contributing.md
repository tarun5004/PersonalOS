# Contributing to Personal OS

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, corrected Phase 0-B docs

## 1. Contribution Principles

Personal OS will be built docs-first, phase by phase.

Contributors should optimize for readable, maintainable, production-style JavaScript. Code should be clear enough for a new contributor to follow without hidden magic or unexplained abstractions.

## 2. Before Contributing

Before proposing or implementing a change:

1. Read the relevant product, UX, and engineering docs.
2. Confirm the change fits V1 scope.
3. Check whether the active phase allows the files you want to edit.
4. Ask before adding packages, routes, fields, collections, or new feature behavior.

## 3. Scope Rules

Do not introduce V1-excluded features:

- TypeScript as mandatory
- Redux
- shadcn/ui as an installed dependency
- OAuth
- Microservices
- Kubernetes
- Redis unless a documented need appears
- Real-time collaboration
- Plugin marketplace
- AI features
- Mobile app
- Advanced RBAC

## 4. Documentation First

Documentation is the intended design. If implementation reveals that an approved doc is wrong or incomplete, stop and report the doc gap before changing the behavior.

Approved docs should not be changed silently during implementation.

## 5. Security Expectations

Contributors must not commit secrets, real `.env` files, tokens, passwords, private keys, or production credentials.

V1 authentication uses short-lived access tokens in memory and rotated refresh tokens in secure HttpOnly cookies. Tokens must not be stored in localStorage or sessionStorage.

Security-sensitive behavior should be validated, documented, and reviewed.

Security issues should be reported privately through the responsible security reporting process documented in root `SECURITY.md`.

Contributors should not open public issues for suspected vulnerabilities until maintainers have reviewed them.

## 6. Theme Contributions

Future community themes should:

1. Use the approved Tailwind CSS v4 styling architecture
2. Override or extend the semantic theme variable set
3. Include a before/after screenshot in the pull request

Theme files must preserve contrast, focus states, readable form states, and non-color-only status indicators.

## 7. Code Style Expectations

Future code should:

- Use clear names.
- Avoid vague helpers like `utils2`, `data`, `stuff`, or generic `helper`.
- Prefer small modules with explicit responsibilities.
- Follow the documented 4-layer architecture.
- Explain why important decisions exist.
- Avoid comments that restate obvious line-by-line behavior.

## 8. Review Expectations

Pull requests should be small enough to review carefully.

Every PR should include:

- What changed
- Why it changed
- Files or areas affected
- Tests run
- Manual QA performed
- Any known limitations
