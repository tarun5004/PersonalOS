# ADR-0011: Use npm as Package Manager

## Context

The project should use one package manager for V1 to keep setup simple.

Master Prompt V4 requires npm.

## Decision

Use npm for V1.

Do not switch to yarn or pnpm unless explicitly approved.

## Alternatives considered

- pnpm
- yarn
- npm workspaces

## Consequences

Using npm keeps setup familiar and avoids package-manager drift.

Scripts must be documented in `README.md` during later phases.

## Status

Accepted for V1.

