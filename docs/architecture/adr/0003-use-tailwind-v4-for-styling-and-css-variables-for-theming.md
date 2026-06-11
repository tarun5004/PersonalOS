# ADR-0003: Use Tailwind CSS v4 for Styling and CSS Variables for Theming

## Context

Personal OS needs a polished, responsive V1 interface that can move faster than hand-written component CSS while preserving light and dark themes.

The project also needs a future path for community themes and should avoid hardcoded component colors.

## Decision

Use Tailwind CSS v4 as the primary styling system for V1.

Use semantic CSS variables for theme tokens and expose those variables through Tailwind utilities. Keep only the required global Tailwind CSS entry file for Tailwind import, resets, theme variables, and global tokens.

Replace component-level CSS files with Tailwind utility classes and reusable React components wherever possible.

## Alternatives considered

- CSS variables with hand-written component CSS only
- Tailwind-only hardcoded color classes
- CSS-in-JS theme objects
- Installed design system dependency
- Hardcoded component colors

## Consequences

Tailwind v4 should speed up UI iteration and make responsive design easier.

The project must keep utility usage maintainable by creating reusable components for repeated patterns.

The project must preserve semantic theme variables so light, dark, and future community themes remain consistent.

Component-level CSS files should be removed during the Tailwind migration unless a documented exception is approved.

## Status

Accepted for V1.
