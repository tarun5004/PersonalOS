# Theme System UX

Status: Approved for V1 planning  
Source of truth: Master Prompt V4

## 1. Theme UX Goal

The theme system will let users choose a comfortable visual mode while giving contributors a predictable way to add future themes.

## 2. V1 Themes

V1 will support:

- Light theme
- Dark theme

Future community themes will be possible through a documented CSS variable set.

## 3. User Controls

Theme selection will live in Settings and may also be exposed through an app-level theme control if approved during implementation. Settings in V1 is limited to theme selection and basic authenticated user context where required. Full account management is out of scope. Controls should be simple and should not distract from daily productivity workflows.

## 4. Visual Requirements

The UI will use semantic theme variables for colors, surfaces, borders, text, focus states, and status indicators. Components will not hardcode colors.

The experience should feel clean, modern, professional, and dashboard-first in both light and dark modes.

## 5. Accessibility Requirements

Themes should preserve:

- Sufficient text contrast
- Visible focus states
- Non-color-only status communication
- Readable form states
- Clear disabled states

## 6. Community Theme Contribution Experience

Contributors will eventually be able to add a theme by:

1. Creating a `.css` file in `/client/src/themes/`
2. Overriding the full CSS variable set
3. Submitting a pull request with a before/after screenshot

The exact token list will be defined in engineering theme architecture docs before implementation.

## 7. Persistence

The selected theme should persist across page refreshes. The exact persistence mechanism will be defined in engineering docs.

## 8. Motion

Theme transitions may use CSS transitions in the 200-300ms range. No animation library will be used for V1 theme behavior.
