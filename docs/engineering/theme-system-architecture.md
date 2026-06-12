# Theme System Architecture

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Goals

The theme system will support light and dark themes in V1 and allow future community themes through semantic CSS variables.

V1 will use Tailwind CSS v4 as the primary styling system. Components should use Tailwind utility classes and reusable component abstractions instead of component-level CSS files.

## 2. Tailwind Entry Point

The frontend will keep one required global CSS entry file for:

- Tailwind v4 import
- Global resets
- Theme variables
- Global tokens
- Minimal document-level base styles

Component-level CSS files should be removed during the Tailwind migration unless there is a documented exception.

## 3. V1 Themes

V1 will include:

- Light theme
- Dark theme

Theme variables will live in `client/src/styles/tokens.css`, the single global Tailwind entry file. The project should avoid multiple component-specific CSS files.

## 4. Token Categories

The token set will cover:

- App background
- Surface background
- Muted surface
- Primary action
- Secondary action
- Text
- Muted text
- Border
- Focus ring
- Success state
- Warning state
- Error state
- Info state

Tokens must be semantic rather than component-specific.

The V1 approved CSS variable names are:

- `--color-app-bg`
- `--color-canvas`
- `--accent`
- `--accent-hover`
- `--accent-subtle`
- `--accent-text`
- `--bg-page`
- `--bg-surface`
- `--bg-surface-2`
- `--bg-surface-3`
- `--text-primary`
- `--text-secondary`
- `--text-tertiary`
- `--text-inverse`
- `--border`
- `--border-strong`
- `--danger`
- `--danger-subtle`
- `--danger-text`
- `--warning`
- `--warning-subtle`
- `--warning-text`
- `--success`
- `--success-subtle`
- `--success-text`
- `--pomo-focus`
- `--pomo-focus-subtle`
- `--pomo-break`
- `--pomo-break-subtle`
- `--pomo-idle`
- `--habit-done`
- `--habit-done-bg`
- `--habit-missed`
- `--habit-missed-bg`
- `--habit-future`
- `--habit-today`
- `--habit-today-bg`
- `--color-sidebar-text`
- `--color-sidebar-muted`
- `--color-primary`
- `--color-primary-soft`
- `--color-secondary`
- `--color-secondary-soft`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-border`
- `--color-card-soft`
- `--color-success`
- `--color-error`
- `--color-warning`
- `--shadow-card`
- `--shadow-floating`

Approved light theme values:

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

Approved dark theme values:

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

These values intentionally use a mature productivity palette. The light theme should read as warm off-white, clean white surfaces, near-black text, and restrained teal accents. The dark theme should read as deep graphite, elevated dark surfaces, soft white text, and refined teal accents.

The sidebar is always dark in V1. Light theme uses a near-black sidebar and dark theme uses deep graphite. This keeps navigation feeling like a stable command center across themes.

## 5. Tailwind Usage Rules

- Prefer reusable React components for repeated UI patterns.
- Prefer semantic variables surfaced through Tailwind utilities.
- Avoid hardcoded one-off color values in JSX.
- Avoid long, duplicated utility strings when a shared component should exist.
- Use Tailwind responsive utilities for mobile, tablet, and desktop behavior.
- Keep accessibility states visible with focus and disabled styles.
- Use the provided dashboard references for hierarchy, density, and navigation organization only.
- Do not copy the reference colors, branding, or startup-dashboard styling.
- Avoid random gradients, glow effects, glassmorphism, excessive rounded corners, and template-looking visual patterns.
- Keep the app closer to a premium desktop productivity application than a marketing website.
- Do not create generic placeholder UI when a polished placeholder-safe page can communicate future structure without fake backend behavior.

## 6. Theme Application

The selected theme will be applied at the document or app root using a stable theme attribute or class.

Tailwind utility classes may reference semantic CSS variables through the theme configuration or CSS-first Tailwind v4 token definitions.

## 7. Theme Persistence

The selected theme should persist across page refreshes. The implementation mechanism must not store secrets or auth tokens.

## 8. Community Theme Flow

Future contributors will be able to:

1. Update the approved semantic variable set
2. Verify light and dark theme contrast
3. Submit a pull request with a before/after screenshot

Community themes should preserve the Tailwind utility-first component architecture and should not introduce component-level CSS files by default.

## 9. Accessibility

Each theme must preserve:

- Sufficient text contrast
- Visible focus states
- Readable form states
- Clear disabled states
- Non-color-only status communication

## 10. Motion

Theme transitions may use CSS transitions in the 200-300ms range.

No animation library will be used for theme behavior in V1.
