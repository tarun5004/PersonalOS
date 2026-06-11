# ADR-0003: Use Tailwind CSS v4 for Styling and CSS Variables for Theming

## Context

Personal OS needs a polished, responsive V1 interface that can move faster than hand-written component CSS while preserving light and dark themes.

The project also needs a future path for community themes and should avoid hardcoded component colors.

## Decision

Use Tailwind CSS v4 as the primary styling system for V1.

Use semantic CSS variables for theme tokens and expose those variables through Tailwind utilities. Keep only the required global Tailwind CSS entry file for Tailwind import, resets, theme variables, and global tokens.

Replace component-level CSS files with Tailwind utility classes and reusable React components wherever possible.

The V1 interface must follow the approved premium SaaS dashboard references: a soft app background, white or dark canvas cards, a purple-to-teal icon sidebar, clean topbar hierarchy, rounded cards, restrained shadows, and monthly habit tracker visual direction.

Approved token names:

```text
--color-app-bg
--color-canvas
--color-sidebar-from
--color-sidebar-to
--color-primary
--color-secondary
--color-text-primary
--color-text-secondary
--color-border
--color-card-soft
--color-success
--color-error
--color-warning
```

Approved light theme:

```text
--color-app-bg: #F4F6FB
--color-canvas: #FFFFFF
--color-sidebar-from: #7C5CFF
--color-sidebar-to: #21B8A6
--color-primary: #6C63FF
--color-secondary: #20B8A6
--color-text-primary: #17142F
--color-text-secondary: #6B6F8A
--color-border: #E6E8F0
--color-card-soft: #F7F5FF
--color-success: #2EC77E
--color-error: #FF5C7A
--color-warning: #FFB84D
```

Approved dark theme:

```text
--color-app-bg: #0F1220
--color-canvas: #171A2D
--color-sidebar-from: #7C5CFF
--color-sidebar-to: #21B8A6
--color-primary: #8B7CFF
--color-secondary: #25D0BC
--color-text-primary: #F7F7FF
--color-text-secondary: #A7ABC4
--color-border: #2C3048
--color-card-soft: #1F2338
--color-success: #37D990
--color-error: #FF6B88
--color-warning: #FFC766
```

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

UI placeholders must be polished and honest about unsupported behavior. Generic placeholder pages should not remain once a page has an approved V1 visual direction.

## Status

Accepted for V1.
