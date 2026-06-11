# Feature Proposals

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved docs

## 1. Purpose

Feature proposals help keep Personal OS focused and maintainable.

V1 is intentionally small. Proposed changes must not bypass the docs-first workflow.

## 2. When to Propose

Create a proposal when a change would add or alter:

- Product behavior
- API routes
- Database fields or collections
- Security behavior
- Package dependencies
- Architecture patterns
- UI workflows

Small bug fixes that match approved docs may not need a full proposal.

## 3. Proposal Template

```text
Title:
Problem:
Users affected:
Proposed behavior:
V1 or post-MVP:
Docs that need updates:
Architecture impact:
Security impact:
Validation impact:
Testing plan:
Alternatives considered:
Known limitations:
```

## 4. Evaluation Criteria

A proposal should be accepted only when:

- The user problem is clear.
- The change fits V1 or is explicitly marked post-MVP.
- The architecture impact is understood.
- Security and privacy implications are documented.
- Testing expectations are realistic.
- The change can be split into a small reviewable phase or chunk.

## 5. Post-MVP Ideas

Out-of-scope V1 ideas should be captured as post-MVP candidates, not silently implemented.

Examples include OAuth, password reset, recurring tasks, reminders, dashboard drag-and-drop, plugin marketplace, AI features, and mobile apps.
