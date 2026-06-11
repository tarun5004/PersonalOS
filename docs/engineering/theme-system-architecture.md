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

Theme variables will live in the global Tailwind entry CSS file or a single imported theme token file if implementation requires it. The project should avoid multiple component-specific CSS files.

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
- `--color-sidebar-from`
- `--color-sidebar-to`
- `--color-primary`
- `--color-secondary`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-border`
- `--color-card-soft`
- `--color-success`
- `--color-error`
- `--color-warning`

Approved light theme values:

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

Approved dark theme values:

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

## 5. Tailwind Usage Rules

- Prefer reusable React components for repeated UI patterns.
- Prefer semantic variables surfaced through Tailwind utilities.
- Avoid hardcoded one-off color values in JSX.
- Avoid long, duplicated utility strings when a shared component should exist.
- Use Tailwind responsive utilities for mobile, tablet, and desktop behavior.
- Keep accessibility states visible with focus and disabled styles.
- Use the provided premium SaaS dashboard and monthly habit tracker references as the V1 visual direction.
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
