# Theme System UX

Status: Approved for V1 planning  
Source of truth: Master Prompt V4 and approved architecture update for Tailwind/auth migration

## 1. Theme UX Goal

The theme system will let users choose a comfortable visual mode while giving contributors a predictable way to maintain future themes.

## 2. V1 Themes

V1 will support:

- Light theme
- Dark theme

Future community themes will be possible through the documented semantic variable set used by Tailwind utilities.

## 3. User Controls

Theme selection will live in Settings and may also be exposed through an app-level theme control if approved during implementation. Settings in V1 is limited to theme selection and basic authenticated user context where required. Full account management is out of scope. Controls should be simple and should not distract from daily productivity workflows.

## 4. Visual Requirements

The UI will use Tailwind CSS v4 utility classes backed by semantic theme variables for colors, surfaces, borders, text, focus states, and status indicators. Components will not hardcode colors.

The experience should feel calm, dense, durable, and closer to a daily productivity cockpit than a startup dashboard or marketing surface.

The final V1 palette uses a warm off-white light theme, clean white cards, near-black text, and restrained teal as the primary accent. Dark theme uses deep graphite surfaces, soft white text, low-contrast borders, and refined teal accents.

The sidebar remains dark in both themes. This is intentional: navigation should feel stable, command-center-like, and always available rather than decorative.

## 5. Accessibility Requirements

Themes should preserve:

- Sufficient text contrast
- Visible focus states
- Non-color-only status communication
- Readable form states
- Clear disabled states

## 6. Community Theme Contribution Experience

Contributors will eventually be able to update a theme by:

1. Editing the approved semantic variable set
2. Verifying Tailwind-backed components in light and dark modes
3. Submitting a pull request with a before/after screenshot

Component-level CSS files should not be introduced for theme changes by default.

## 7. Persistence

The selected theme should persist across page refreshes with the `pos-theme` local storage key. This key stores only the visual preference and must not be used for auth or sensitive data.

## 8. Motion

Theme transitions may use CSS transitions in the 200-300ms range. No animation library will be used for V1 theme behavior.
