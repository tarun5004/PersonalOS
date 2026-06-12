# Contributing

Thank you for helping build Personal OS.

This project is docs-first and phase-based. Before contributing, read the approved docs in `docs/`, then check `STEPS.md` for the active phase and allowed files.

## How to Contribute

1. Read the relevant product, UX, engineering, and open-source docs.
2. Confirm the change fits the active phase.
3. Keep changes small and reviewable.
4. Avoid unrelated edits.
5. Add tests when the active phase requires them.
6. Document manual QA steps.

## Code Expectations

Future implementation code should be production-style, readable, and well-structured.

Use clear names. Avoid hidden magic, vague helper files, and unexplained abstractions.

Comments should explain why important decisions exist, especially around security, dates, scoring, streaks, and middleware. Avoid comments that only restate obvious code.

## Scope Expectations

Do not add packages, APIs, database fields, routes, features, or architecture changes unless they are documented and allowed by the active phase.

V1 does not use Redux, mandatory TypeScript, OAuth, microservices, or real-time collaboration.

The approved Next-Level OS track may add controlled shadcn/ui-derived primitives, premium UI patterns, motion/reward libraries, 3D, and server-side AI image generation. Follow `NEXT_LEVEL_OS_PLAN.md` and `NEXT_LEVEL_OS_TASKS.md` before changing those areas.

## Security

Do not commit secrets, real `.env` files, private keys, tokens, or production credentials.

Report suspected vulnerabilities privately using the process in `SECURITY.md`. Do not open public issues for suspected vulnerabilities until maintainers have reviewed them.

## Commit Messages

Use Conventional Commits with approved scopes from `docs/open-source/git-workflow.md`.

Examples:

```text
docs(docs): add repository setup files
feat(auth): add cookie-based login endpoint
fix(habits): correct UTC streak calculation
```

## Pull Requests

Pull requests should include:

- Summary
- Related phase or issue
- Files changed
- Architecture layer impact
- Validation added
- Security considerations
- State/cache behavior
- Tests run
- Manual QA steps
- Known limitations
