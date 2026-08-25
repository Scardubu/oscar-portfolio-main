# Original User Request

## 2026-08-25T00:01:41Z

Finalize, certify, and elevate `portfoliox` (https://www.scardubu.dev) as a distinctive, production-grade engineering portfolio positioning Oscar Ndugbu as a Staff Backend and Platform Engineer through the Reliability Ledger narrative ("Constraint → Decision → Outcome → Evidence"), verified Core Web Vitals performance, WCAG 2.2 AA accessibility, responsive mobile-first polish, and zero-defect release discipline.

Working directory: c:\Users\UBEC-DC-ANAMBRA\Documents\portfoliox
Integrity mode: development

## Requirements

### R1. Critical Path Performance & Bundle Optimization
- Optimize mobile critical render path: ensure dynamic deferred loading of heavy cinematic libraries (GSAP, ScrollTrigger, Lenis), lazy-load Framer Motion features, isolate CursorGlow to confirmed fine-pointer devices, and suppress decorative SVG grain on mobile/reduced-motion viewports.
- Maintain strict performance ceilings: Mobile LCP <= 2.5s (hard ceiling 3.0s), TBT <= 300ms, CLS <= 0.10, with zero console errors during initial paint and navigation.

### R2. Responsive Mobile Composition & Visual Hierarchy
- Enforce strict mobile-first geometry: IdentityCard mobile height < 520px at 375px viewport width, portrait width <= 130px, primary touch targets >= 48px, interactive targets >= 44px, and `document.documentElement.scrollWidth <= window.innerWidth` across all breakpoints (320px to 1440px+).
- Address layout polish from visual screenshot evidence: fix writing category filter clipping, ensure readable contrast for muted metadata, remove duplicated stack/availability badges, and ensure clear section rhythm between Skills, Open Source, About, and Writing.

### R3. Claims Integrity & "Reliability Ledger" Architecture
- Position Oscar Ndugbu consistently as a Staff Backend and Platform Engineer across metadata, hero copy, OG cards, and structured JSON-LD.
- Structure project case studies (TaxBridge, SabiScore, SwarmXQ) and open-source packages (`pg-tenant`, `audit-chain`, `node-debug-llm`, `llm-dispatch`) around the Reliability Ledger: "Constraint → Decision → Outcome → Evidence".
- Enforce claims ledger discipline: qualify or remove unverified metrics, replace stale update dates ("Updated June 2026") with derived freshness, and eliminate repetitive buzzwords.

### R4. Accessibility, Semantic Integrity & Release Certification
- Ensure WCAG 2.2 AA compliance across all routes (`/`, `/writing`, `/work/[slug]`, `/writing/[slug]`) with 0 Axe violations.
- Maintain exactly one canonical H1, valid BrandWordmark semantics with `aria-hidden` glyphs and screen-reader equivalents, and resilient live activity fallbacks.
- Execute full test automation and release gates without weakening existing assertions.

## Acceptance Criteria

### Performance & Budgets
- [ ] Lighthouse Mobile Performance score >= 0.90 (hard release floor), target >= 0.95.
- [ ] Lighthouse Mobile Accessibility >= 0.95 (target 1.00), Best Practices >= 0.95, SEO >= 0.95.
- [ ] Mobile LCP <= 2.5s (hard ceiling 3.0s), TBT <= 300ms, CLS <= 0.10.
- [ ] No regression in First Load JS bundle size.

### Accessibility & Semantics
- [ ] `pnpm run test:a11y` passes with 0 serious or critical Axe violations.
- [ ] Exactly one canonical H1 per page; clean landmark hierarchy (`header`, `main`, `footer`, `nav`).
- [ ] BrandWordmark renders valid accessible name without duplicate screen-reader announcements.

### Test Automation & Release Gates
- [ ] `pnpm run type-check` exits with code 0 (0 TypeScript errors).
- [ ] `pnpm run lint` exits with code 0 (0 ESLint errors/warnings).
- [ ] `pnpm run test:unit` passes 100% of unit tests.
- [ ] `pnpm run audit:copy` passes strict copy and claims audit.
- [ ] `pnpm run test:smoke`, `pnpm run test:e2e`, and `pnpm run test:mobile` pass in Playwright.
- [ ] Production build (`pnpm run build`) compiles cleanly with valid static route generation.
