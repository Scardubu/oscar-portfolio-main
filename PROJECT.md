# Project: portfoliox (scardubu.dev)

## Architecture
- **Framework**: Next.js (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion (LazyMotion), Lucide Icons.
- **Data Flow & State**:
  - Centralized portfolio metadata and profile configuration in `lib/portfolio-data.ts`.
  - Structured engineering records and case studies in `lib/projects.ts`, `content/work/*.mdx`, `content/writing/*.mdx`.
  - Claims Ledger rule definitions in `docs/claim-ledger.md` and validator in `scripts/audit-copy.mjs`.
  - Dynamic cinematic engine with mobile/reduced-motion bypass in `components/cinematic/ScrollCinemaProvider.tsx`.
  - SEO, JSON-LD, and OpenGraph generators in `app/layout.tsx`, `app/lib/structured-data.ts`, and `app/og/route.tsx`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | GSAP / Lenis Mobile Deferral | Bypass heavy cinematic libs on mobile/touch/reduced-motion | M1 | ORIGINAL_REQUEST §R1 |
| 2 | LazyMotion Strict Integration | Dynamic domAnimation loading and m-components | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Fine-Pointer Cursor Glow | CursorGlow isolated to (pointer: fine) devices | M1 | ORIGINAL_REQUEST §R1 |
| 4 | SVG Grain Mobile Suppression | Display none for background grain on <= 767px viewports | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Mobile Geometry Ceilings | IdentityCard height < 520px at 375px, portrait width <= 130px | M2 | ORIGINAL_REQUEST §R2 |
| 6 | Touch Target Upgrades | Navbar menu button (44px) and Skills view tabs (44px) | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Zero Horizontal Overflow | scrollWidth <= innerWidth across 320px–1440px+ | M2 | ORIGINAL_REQUEST §R2 |
| 8 | Muted Text Contrast | Ensure 4.5+:1 WCAG AA text contrast on muted links/tags | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Writing Filter Chip Wrap | Filter chips wrap cleanly without clipping on mobile | M2 | ORIGINAL_REQUEST §R2 |
| 10 | Staff Backend Persona | Consistent positioning across metadata, hero, OG, JSON-LD | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Reliability Ledger Pattern | "Constraint → Decision → Outcome → Evidence" on all case studies & OSS | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Claims Ledger Discipline | Zero unverified metrics, strict audit-copy pass | M3 | ORIGINAL_REQUEST §R3 |
| 13 | WCAG 2.2 AA Route Compliance | 0 Axe violations across /, /writing, /work/[slug], /writing/[slug] | M4 | ORIGINAL_REQUEST §R4 |
| 14 | Single Canonical H1 Hierarchy | Exactly 1 H1 per route with structured H2/H3 landmarks | M4 | ORIGINAL_REQUEST §R4 |
| 15 | BrandWordmark Semantics | Accessible name with aria-hidden glyphs | M4 | ORIGINAL_REQUEST §R4 |
| 16 | Polite Live Activity Fallback | Resilient GitHub live activity status with static fallbacks | M4 | ORIGINAL_REQUEST §R4 |
| 17 | Zero-Defect Release Suite Pass | Type-check, lint, unit tests, audit:copy, a11y, smoke, mobile, build | M5 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Critical Path Performance & Bundle Optimization | Features 1, 2, 3, 4: verify mobile deferrals, lazy motion, and runtime budgets | none | DONE |
| M2 | Responsive Mobile Geometry & Visual Polish | Features 5, 6, 7, 8, 9: upgrade 44px touch targets, restore muted contrast, verify card geometry | M1 | DONE |
| M3 | Claims Integrity & Reliability Ledger Architecture | Features 10, 11, 12: verify persona uniformity, 4-part ledger format, claims script | none | DONE |
| M4 | Accessibility, Semantic Integrity & Fallbacks | Features 13, 14, 15, 16: verify WCAG AA, single H1, wordmark semantics, live bar | M2, M3 | DONE |
| M5 | Release Gates & Zero-Defect Certification | Feature 17: run all static and automated test suites, verify production build | M1, M2, M3, M4 | DONE |

## Interface Contracts
### `components/Navbar.tsx` ↔ Mobile Layout & A11y
- Mobile menu button `hero-nav-menu-button`: `min-h-[44px] min-w-[44px]`, `aria-label="Open mobile menu"`, `aria-expanded={isOpen}`.

### `components/SkillsSection.tsx` ↔ Touch Target Standards
- View toggle buttons `skills-list-tab` and `skills-radar-tab`: `min-h-[44px] min-w-[44px]`.

### `components/ReliabilityLedger.tsx` ↔ Case Studies (`lib/projects.ts`)
- Ledger Record Interface:
  ```ts
  interface ReliabilityLedgerRecord {
    constraint: string;
    decision: string;
    outcome: string;
    evidence: string;
  }
  ```

### `components/BrandWordmark.tsx` ↔ Accessible Tree
- Output DOM:
  ```tsx
  <span className="brand-wordmark ...">
    <span className="sr-only">Scardubu</span>
    <span aria-hidden="true" className="brand-wordmark__inner">...</span>
  </span>
  ```

## Code Layout
- `app/` — Next.js App Router routes (`page.tsx`, `layout.tsx`, `work/[slug]`, `writing/`, `og/`, `globals.css`)
- `components/` — React UI components (`Navbar.tsx`, `IdentityCard.tsx`, `ReliabilityLedger.tsx`, `SkillsSection.tsx`, `WritingSection.tsx`, `BrandWordmark.tsx`, `Liveactivitybar.tsx`, `MotionProvider.tsx`)
- `lib/` — Domain data, utilities, structured data (`portfolio-data.ts`, `projects.ts`, `writing.ts`, `utils.ts`)
- `content/` — MDX articles and case studies (`work/*.mdx`, `writing/*.mdx`)
- `docs/` — Authoritative claims policy (`claim-ledger.md`)
- `scripts/` — Audit scripts (`audit-copy.mjs`, `verify-app-router.mjs`)
- `tests/` & `e2e/` — Unit tests, smoke tests, a11y tests, scroll-engine tests, portfolio specs
