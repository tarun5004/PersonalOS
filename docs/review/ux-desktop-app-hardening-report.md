# UX Desktop-App Hardening Report

Status: Completed for review  
Scope: UI shell, dashboard hierarchy, empty states, and measured frontend loading improvements before Phase 8

## Summary

This pass moved PersonalOS away from long-page dashboard behavior and toward a desktop-app shell:

- The app shell owns the viewport height.
- Sidebar, navigation, topbar, and profile area remain visible.
- Only the main content region scrolls.
- Dashboard emphasis moved from greeting-first to next-action-first.
- Heavy chart rendering was deferred until needed.

Phase 8 remains blocked pending UX and performance approval.

## Before Evidence

Baseline screenshot:

```text
C:\tmp\personalos-before-dashboard-shell.png
```

Baseline shell metrics:

```json
{
  "bodyScrollHeight": 1737,
  "viewportHeight": 1000,
  "bodyScrollable": true,
  "mainOverflowY": "visible",
  "mainClientHeight": 1566,
  "mainScrollHeight": 1566
}
```

The whole document scrolled, so navigation moved like a website instead of staying available like a workspace.

## After Evidence

After screenshots:

```text
C:\tmp\personalos-after-dashboard-shell.png
C:\tmp\personalos-after-dashboard-dark.png
C:\tmp\personalos-after-dashboard-mobile.png
```

After desktop shell metrics:

```json
{
  "bodyScrollHeight": 1000,
  "viewportHeight": 1000,
  "bodyScrollable": false,
  "mainOverflowY": "auto",
  "mainClientHeight": 853,
  "mainScrollHeight": 1532,
  "mainScrollable": true,
  "sidebarStableAfterMainScroll": true,
  "topbarStableAfterMainScroll": true
}
```

After mobile shell metrics:

```json
{
  "bodyScrollHeight": 844,
  "viewportHeight": 844,
  "bodyScrollable": false,
  "mainOverflowY": "auto",
  "mainClientHeight": 557,
  "mainScrollHeight": 3352,
  "mainScrollable": true,
  "sidebarStableAfterMainScroll": true,
  "topbarStableAfterMainScroll": true
}
```

## Performance Evidence

Before this pass, the dashboard loaded chart-related code eagerly:

- `ScoreChart` / Recharts chunk: about 324.94 KB uncompressed
- `DashboardCard` / `framer-motion` chunk: about 118.90 KB uncompressed

After this pass:

- `ScoreChart` remains split into its own lazy chunk: 327.72 KB uncompressed, 96.45 KB gzip
- Dashboard initial protected route assets did not include the `ScoreChart` chunk
- `DashboardCard` chunk is 0.67 KB uncompressed, 0.39 KB gzip
- `framer-motion` was removed because this pass only needed CSS transitions

Initial dashboard assets observed during browser QA:

```text
index-C73_yicw.js
classNames-BXza46oy.js
DashboardPage-Bv6oowuy.js
DashboardCard-BQQWj8Uf.js
Card-D7pzbUPF.js
DeferredScoreChart-BUJfnH5L.js
StatCard-w82HfDHd.js
TaskCard-zjVdlR28.js
```

## Manual QA Notes

Verified with production preview and mocked auth session:

- Dashboard renders.
- Tasks renders.
- Habits renders.
- Analytics renders.
- Settings renders.
- Login renders when no session is present.
- Register renders when no session is present.
- Theme toggles to dark and persists after refresh.
- Sidebar/topbar remain stable while main content scrolls.
- No protected-route console warnings or errors after chart sizing fix.

Known limitation:

- Public Login/Register still produce expected browser network messages when the refresh endpoint returns `401 Unauthorized`. This is part of the existing auth restore behavior and was not changed because this was a UI-only chunk.
