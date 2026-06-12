# ADR-0003: Use Tailwind CSS v4 for Styling and CSS Variables for Theming

## Context

Personal OS needs a polished, responsive V1 interface that can move faster than hand-written component CSS while preserving light and dark themes.

The project also needs a future path for community themes and should avoid hardcoded component colors.

## Decision

Use Tailwind CSS v4 as the primary styling system for V1.

Use semantic CSS variables for theme tokens and expose those variables through Tailwind utilities. Keep only the required global Tailwind CSS entry file for Tailwind import, resets, theme variables, and global tokens.

Replace component-level CSS files with Tailwind utility classes and reusable React components wherever possible.

The V1 interface must follow the approved PersonalOS visual direction. PersonalOS should feel like a calm personal operating system, digital command center, and long-lived productivity cockpit rather than a generic SaaS dashboard or startup admin template.

The provided dashboard references are composition references only. Use them for layout hierarchy, information density, and navigation organization. The approved V1 palette is a mature productivity-tool palette with warm off-white light surfaces, deep graphite dark surfaces, and restrained teal accents.

Approved token names:

```text
--color-app-bg
--color-canvas
--accent
--accent-hover
--accent-subtle
--accent-text
--bg-page
--bg-surface
--bg-surface-2
--bg-surface-3
--text-primary
--text-secondary
--text-tertiary
--text-inverse
--border
--border-strong
--danger
--danger-subtle
--danger-text
--warning
--warning-subtle
--warning-text
--success
--success-subtle
--success-text
--pomo-focus
--pomo-focus-subtle
--pomo-break
--pomo-break-subtle
--pomo-idle
--habit-done
--habit-done-bg
--habit-missed
--habit-missed-bg
--habit-future
--habit-today
--habit-today-bg
--color-sidebar-from
--color-sidebar-to
--color-sidebar-text
--color-sidebar-muted
--color-primary
--color-primary-soft
--color-secondary
--color-secondary-soft
--color-text-primary
--color-text-secondary
--color-border
--color-card-soft
--color-success
--color-error
--color-warning
--shadow-card
--shadow-floating
```

Approved light theme:

```text
--accent: #1D9E75
--accent-hover: #0F6E56
--accent-subtle: #E1F5EE
--accent-text: #085041
--bg-page: #F7F6F3
--bg-surface: #FFFFFF
--bg-surface-2: #F2F1EE
--bg-surface-3: #ECEAE5
--text-primary: #1C1B19
--text-secondary: #5A5955
--text-tertiary: #8F8D89
--text-inverse: #FFFFFF
--border: rgba(28,27,25,0.10)
--border-strong: rgba(28,27,25,0.20)
--danger: #C0392B
--danger-subtle: #FDEDEC
--danger-text: #922B21
--warning: #D68910
--warning-subtle: #FEF9E7
--warning-text: #9A6109
--success: #1D9E75
--success-subtle: #E1F5EE
--success-text: #085041
```

Approved dark theme:

```text
--bg-page: #141413
--bg-surface: #1E1D1B
--bg-surface-2: #262522
--bg-surface-3: #2E2C29
--text-primary: #F0EEE9
--text-secondary: #A8A69F
--text-tertiary: #6B6965
--border: rgba(240,238,233,0.08)
--border-strong: rgba(240,238,233,0.16)
--accent-subtle: #0A2E22
--accent-text: #5DCAA5
--danger-subtle: #2A0D0B
--danger-text: #F09595
--warning-subtle: #2A1E05
--warning-text: #EF9F27
--success-subtle: #0A2E22
--success-text: #5DCAA5
```

Theme variables are implemented in `client/src/styles/tokens.css`. The theme provider writes `data-theme="light"` or `data-theme="dark"` to the document element and persists the visual preference with the `pos-theme` local storage key.

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
