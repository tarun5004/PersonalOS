# ADR-0003: Use CSS Variables for Theming

## Context

Personal OS needs light and dark themes in V1 and a future path for community themes.

Components must avoid hardcoded colors and use semantic design tokens.

## Decision

Use CSS variables for the theme system.

Theme files will override a shared semantic token set.

## Alternatives considered

- Tailwind-only color classes
- CSS-in-JS theme objects
- Installed design system dependency
- Hardcoded component colors

## Consequences

CSS variables provide a simple, framework-friendly way to support themes.

The project must define and preserve a complete token set so community themes remain consistent.

## Status

Accepted for V1.

