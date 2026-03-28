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
