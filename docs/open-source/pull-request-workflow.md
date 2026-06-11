# Pull Request Workflow

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved docs

## 1. PR Size

Pull requests should be small, reviewable, and tied to one phase or chunk.

Avoid mixing unrelated docs, tooling, UI, backend, and dependency changes.

## 2. PR Checklist

Each PR should include:

- Summary of changes
- Related phase or issue
- Files changed
- Architecture layer impact
- Validation added
- Security considerations
- State/cache behavior
- Tests added or run
- Manual QA steps
- Known limitations
- What was intentionally not included

## 3. Review Focus

Reviewers should prioritize:

- Bugs and regressions
- Security issues
- Scope creep
- Missing validation
- Inconsistent API response shapes
- Missing loading, empty, error, or success states
- Duplicated UI patterns
- Hardcoded colors or secrets
- Vague abstractions
- Missing or weak tests

## 4. Merge Expectations

Before merge:

- The change should match approved docs.
- Tests required by the phase should pass.
- Manual QA should be documented.
- No real secrets should be present.
- Generated artifacts should not be committed unless documented.

Suspected vulnerabilities should not be disclosed through public issues or pull request comments before maintainer review. Use the responsible reporting process documented in root `SECURITY.md`.

## 5. Docs Changes

If implementation requires changing an approved doc, report the gap first.

Do not silently update approved docs inside an implementation PR unless the requested change explicitly includes docs updates.
