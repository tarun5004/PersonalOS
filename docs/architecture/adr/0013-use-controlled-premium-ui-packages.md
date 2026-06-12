# ADR-0013: Use Controlled Premium UI Packages

## Context

PersonalOS now needs a richer, more emotional interface while keeping the existing daily-use productivity cockpit identity. The requested package track includes shadcn/ui, Magic UI, Aceternity UI, Framer Motion, Auto Animate, Lottie, Canvas Confetti, React CountUp, React Three Fiber, and Three.js.

Earlier V1 docs excluded shadcn/ui as a dependency to avoid becoming a generic template application. That concern remains valid, but the project now has a documented Next-Level OS track that can use these packages in a controlled way.

## Decision

Use premium UI and motion packages only as controlled implementation tools. They must be adapted into local PersonalOS components, theme tokens, and interaction rules.

Approved roles:

- shadcn/ui: source for local primitive patterns, not a replacement design system.
- Magic UI and Aceternity UI: source for selective premium patterns, not whole-page templates.
- Framer Motion: meaningful page, card, modal, and achievement transitions.
- Auto Animate: lightweight list and layout transitions.
- Lottie: optional empty-state and reward animations.
- Canvas Confetti: rare milestone celebrations.
- React CountUp: meaningful metric transitions.
- React Three Fiber and Three.js: lazy-loaded optional 3D experiences.

Tailwind CSS v4 and semantic CSS variables remain the styling foundation.

## Alternatives Considered

- Continue with only hand-built Tailwind components.
- Adopt a full third-party design system.
- Use animation and 3D libraries globally.
- Use no motion/reward layer.

## Consequences

The UI can become more polished and expressive without losing source-of-truth control.

The team must prevent dependency-driven design drift. Every imported primitive or pattern must be reviewed for accessibility, bundle impact, theme-token usage, and PersonalOS visual fit.

Heavy visual experiences must be lazy-loaded and must include fallback UI.

## Status

Accepted for the Next-Level OS implementation track.
