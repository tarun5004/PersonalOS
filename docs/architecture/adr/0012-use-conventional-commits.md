# ADR-0012: Use Conventional Commits

## Context

Personal OS needs a predictable contribution workflow and changelog preparation path.

Commit messages should communicate intent clearly.

## Decision

Use Conventional Commits with the approved types and scopes documented in the git workflow.

## Alternatives considered

- Free-form commit messages
- Strict issue-number-only commit messages
- Commitlint from the start

## Consequences

Conventional Commits make history easier to scan and support future release notes.

Optional tooling such as Commitlint can be considered later, but it is not required for Phase 0-C.

## Status

Accepted for V1.

