# ADR-0003: Use Tailwind CSS v4 for Styling and CSS Variables for Theming

## Context

Personal OS needs a polished, responsive V1 interface that can move faster than hand-written component CSS while preserving light and dark themes.

The project also needs a future path for community themes and should avoid hardcoded component colors.

## Decision

Use Tailwind CSS v4 as the primary styling system for V1.

Use semantic CSS variables for theme tokens and expose those variables through Tailwind utilities. Keep only the required global Tailwind CSS entry file for Tailwind import, resets, theme variables, and global tokens.

Replace component-level CSS files with Tailwind utility classes and reusable React components wherever possible.

The V1 interface must follow the approved PersonalOS visual direction. PersonalOS should feel like a calm personal operating system, digital command center, and long-lived productivity cockpit rather than a generic SaaS dashboard or startup admin template.

The provided dashboard references are composition references only. Use them for layout hierarchy, information density, and navigation organization. Do not copy their colors, branding, purple-first palette, or generic dashboard appearance.

Approved token names:

```text
--color-app-bg
--color-canvas
--color-sidebar-from
--color-sidebar-to
--color-sidebar-text
--color-sidebar-muted
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
--color-app-bg: #F3F4F1
--color-canvas: #FFFFFF
--color-sidebar-from: #202824
--color-sidebar-to: #143A36
--color-sidebar-text: #F7FAF6
--color-sidebar-muted: #B8C7C0
--color-primary: #2D7D73
--color-secondary: #57706A
--color-text-primary: #171B19
--color-text-secondary: #636D68
--color-border: #DFE4E0
--color-card-soft: #F7F8F5
--color-success: #2F7D57
--color-error: #B84F61
--color-warning: #A36B2C
```

Approved dark theme:

```text
--color-app-bg: #0E1416
--color-canvas: #171D20
--color-sidebar-from: #0F1719
--color-sidebar-to: #12312E
--color-sidebar-text: #F1F6F3
--color-sidebar-muted: #90A29B
--color-primary: #55B5A9
--color-secondary: #8BA7A0
--color-text-primary: #F3F6F3
--color-text-secondary: #A6B1AC
--color-border: #293335
--color-card-soft: #1F272A
--color-success: #6BC58E
--color-error: #E07083
--color-warning: #D2A05A
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

Phase 8 Task Backend must remain blocked until PersonalOS visual review is approved.

## Status

Accepted for V1.
