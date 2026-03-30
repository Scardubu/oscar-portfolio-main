# Corrections

This file is reserved for release corrections and follow-up notes for the portfolio production surface.

## 2026-03-28

- Fixed home navigation so `Projects`, `About`, and `Contact` resolve correctly from subpages instead of pointing to broken in-page anchors.
- Added consistent top navigation and footer coverage to writing index, writing detail, and work detail pages.
- Brought hero, projects, about, and contact sections closer to the release spec with clearer production-facing copy and reveal semantics.
- Expanded `GlassCard` to forward HTML and `data-*` props so reveal/state annotations can be applied without wrapper div churn.
- Cleaned `package.json` duplicate keys and aligned `type-check` with `tsconfig.typecheck.json`.

## 2026-03-29

- Hardened `/api/contact` to return consistent error payloads, normalize rate-limit keys, and avoid exposing placeholder service language.
- Replaced demo-style API behavior in `/api/live-metrics` with deterministic public-safe status data and documented `/api/portfolio-metrics` as benchmark-backed output.
- Changed `/api/sabiscore-preview` from a placeholder `501` response to an intentional `410 Gone` contract for the non-public preview surface.
- Removed debug-only metric logging from shipped code and moved metric view tracking out of render-time execution.
- Removed broken placeholder image references from published blog posts so the public blog no longer points at missing assets.
- Added outside-click and focus management refinements to the mobile navigation, strengthened the homepage project and writing sections, and added related-navigation rails to writing and work detail pages.

## 2026-03-30 — Conviction Engine v7.0

- **E2E smoke suite (20/20)** — Fixed the one remaining command-palette test failure.
  Root cause: `document.dispatchEvent(keydownEvent)` makes `document` the AT_TARGET
  (phase 2), so the ordering between the layout inline-script capture listener and
  the React `useEffect`-registered capture listener was implementation-defined in
  Blink — causing double-toggle (open→close) in the same render batch. Fixed by
  switching to `page.waitForLoadState('networkidle')` + `page.keyboard.press('Control+k')`,
  which injects a trusted CDP key event that propagates through CAPTURING_PHASE (1)
  exactly as a real user keystroke does.
- **Design system globals.css** — Merged Conviction Engine v7 glass architecture tokens:
  7-step fluid type scale, 8px spacing grid, glass system (backdrop-blur + refraction),
  full dark/light/system theme support, reduced-motion override, prose styles, print styles,
  skip-nav, reading-progress bar, badge-live / badge-wip / dot-live animations.
- **lib/projects.ts** — Single source of truth for all three projects with typed
  `Chosen / Over / Because` architecture-decision fields.
- **lib/writing.ts** — MDX frontmatter parser with reading-time computation via
  `reading-time` package.
- **app/providers.tsx** — Minimal ThemeContext (dark/light/system) with localStorage
  persistence and `data-theme` attribute sync.
- **app/api/og/** — Homepage OG image route (edge runtime, 1200×630).
- **app/work/[slug]/og/** — Per-project OG image route with title, status badge, stack pills.
- **app/api/activity/** — GitHub last-commit feed (edge + ISR 3600s) replacing the
  previous activity endpoint; returns `{ sha, message, date, ago }`.
- **Liveactivitybar.tsx** — Renamed to canonical casing `Liveactivitybar.tsx` (repo
  tracks this casing); import paths normalised for case-sensitive CI environments.
- **playwright.config.ts** — `webServer` split so `pnpm start` (not `build && start`)
  is the server command; `reuseExistingServer: !process.env.CI` prevents timeout on
  local re-runs.

## 2026-03-29 (pass 2)

- **Footer** — expanded from a minimal 2-icon strip to a full production footer: auto-updating copyright year, résumé PDF download CTA, back-to-top anchor, and X (Twitter) + email icons alongside GitHub and LinkedIn.
- **Writing index page** (`/writing`) — added featured-article banner card with tag pills, summary, and date; added tag pills per post in the year-bucketed archive; replaced all inline style objects with Tailwind utility classes backed by CSS custom properties for maintainability.
- **LiveBuildFeed** — removed `console.error` from the production bundle; added an explicit `fetchError` state so failed fetches surface a human-readable message ("Activity feed unavailable — check back soon.") instead of silently showing "No recent activity".
- **LiveActivityBar** — guarded the GitHub API fetch against non-OK responses and network failures via `.catch()` so the component silently hides rather than throwing an unhandled rejection.
