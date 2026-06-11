# Theme System Architecture

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved Phase 0-A docs

## 1. Goals

The theme system will support light and dark themes in V1 and allow future community themes through CSS variables.

Components will use semantic design tokens. Components must not hardcode colors.

## 2. V1 Themes

V1 will include:

- Light theme
- Dark theme

Theme files will live under:

```text
client/src/themes/
```

## 3. Token Categories

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

Exact CSS variable names will be implemented in Phase 4, but they must be semantic rather than component-specific.

## 4. Theme Application

The selected theme will be applied at the document or app root using a stable theme attribute or class.

Components will consume tokens through CSS variables.

## 5. Theme Persistence

The selected theme should persist across page refreshes. The implementation mechanism will be chosen in Phase 4 without storing secrets or auth data.

## 6. Community Theme Flow

Future contributors will be able to:

1. Create a `.css` file in `/client/src/themes/`
2. Override the full CSS variable set
3. Submit a pull request with a before/after screenshot

This flow will be documented in open-source docs during Phase 0-C.

## 7. Accessibility

Each theme must preserve:

- Sufficient text contrast
- Visible focus states
- Readable form states
- Clear disabled states
- Non-color-only status communication

## 8. Motion

Theme transitions may use CSS transitions in the 200-300ms range.

No animation library will be used for theme behavior in V1.
