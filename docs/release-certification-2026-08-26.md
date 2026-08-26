# Portfolio Production Certification — 2026-08-26

## Scope

This record captures the final production-certification pass for `scardubu.dev` on PR #7 (`refine/final-evidence-certification-20260826`). The pass is intentionally surgical: it closes verified release blockers and removes interaction/accessibility friction without redesigning healthy architecture.

## Release invariants

The portfolio remains fail-closed until the exact PR head satisfies all of the following:

- lint, TypeScript, unit tests, and production build pass;
- full Chromium E2E passes with the desktop Lenis scroll contract intact;
- mobile Chromium/WebKit regression coverage passes;
- Conviction CI passes;
- Lighthouse Performance is at least 90;
- Lighthouse Accessibility, Best Practices, and SEO are each at least 95;
- FCP is at most 2500 ms;
- LCP is at most 3000 ms;
- TBT is at most 300 ms;
- CLS is at most 0.10;
- the Vercel preview for the exact head is Ready;
- no unresolved review thread blocks release.

## Remediation completed

### Navigation and scroll correctness

- Unified sticky-navbar geometry around the canonical `--nav-height` token.
- Aligned the mobile navigation panel with the same token.
- Added bounded Lenis post-scroll settlement for layout changes that occur after smooth-scroll completion.
- Corrected the Projects navigation regression contract to measure the user-visible destination heading below the sticky navigation rather than an invisible section padding boundary.

### Critical rendering performance

- Removed late font-swap behavior from critical display/body fonts with `font-display: optional`.
- Removed optional font preloads from the critical request path.
- Removed balanced-text layout work from the mobile LCP heading.
- Decoupled the mobile hero H1 from the custom display font while retaining the branded display face from tablet-sized viewports upward.

### Accessibility and interaction quality

- Removed duplicate reduced-motion ownership so the cinematic provider remains the single runtime authority.
- Removed the unsolicited delayed bookmark overlay and its loader.
- Removed noisy internal chapter announcements from the scroll provider.
- Updated Open Source action names so accessible names contain their visible labels while retaining contextual screen-reader detail.
- Preserved minimum CTA/touch-target and reduced-motion contracts already enforced by the regression suite.

### Evidence integrity

- Public Open Source claims remain bounded to inspectable source evidence.
- Unsupported absolute outcome language remains blocked by the copy audit and claim ledger.
- The Reliability Ledger narrative remains the canonical public evidence grammar: Constraint → Decision → Outcome → Evidence.

## Verification source of truth

GitHub Actions and the Vercel GitHub deployment status are the executable release evidence for this branch. Local browser-network validation is not treated as authoritative when the connected environment cannot reproduce the hosted CI/deployment surface.

The merge must use the exact validated head SHA. If the head changes after a green run, all required exact-head gates must run again before release.
