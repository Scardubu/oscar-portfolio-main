# Oscar Scardubu — Portfolio
Production portfolio · [scardubu.dev](https://scardubu.dev)

## Stack
Next.js 15 · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Framer Motion · MDX · Vercel Edge

## Development
```bash
pnpm install         # install dependencies
pnpm dev             # localhost:3000  (Turbopack)
pnpm type-check      # tsc --noEmit against tsconfig.typecheck.json
pnpm lint            # ESLint across app/ components/ data/ e2e/
pnpm build           # production build
pnpm audit:copy      # validate no first-person / unverifiable metric copy
pnpm test:e2e        # build + Playwright Chromium smoke suite (22 tests)
pnpm test:all        # build + full 5-browser Playwright suite
pnpm lhci            # Lighthouse CI — requires @lhci/cli globally installed
```

## Key routes
| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, projects, about, writing, contact |
| `/work/sabiscore` | SabiScore case study — ensemble ML, FastAPI, Redis |
| `/work/hashablanca` | Hashablanca case study — Kafka, dbt, blockchain analytics |
| `/work/taxbridge` | TaxBridge case study — OCR, Spring Boot, audit events |
| `/writing` | Writing index |
| `/writing/[slug]` | Article detail with reading progress |
| `/blog/[slug]` | Blog posts (MDX, statically generated) |
| `/api/og` | Homepage OG image (edge) |
| `/work/[slug]/og` | Per-project OG image (edge) |
| `/api/activity` | Last GitHub commit — ISR 1h |

## Architecture
| Layer | Module | Notes |
|-------|--------|-------|
| Data | `data/projects.ts` | Raw project records (single source of truth) |
| Normalised | `lib/projects.ts` | Maps raw data → typed `Project` with inferred pipeline, decision triad |
| Render | `components/ProjectsSection.tsx` | Featured card + 2-col grid, `ArchDecision` inline |
| Decisions | `components/ArchDecision.tsx` | CHOSEN / OVER / BECAUSE — always visible, no interaction needed |
| Reveal | `hooks/useScrollReveal.ts` + `lib/useReveal.ts` | `[data-reveal]` IntersectionObserver, respects `prefers-reduced-motion` |
| Motion | `components/MotionProvider.tsx` | `LazyMotion + domAnimation` — ~35 kB bundle reduction vs full bundle |
| Ambient | `components/GradientMesh.tsx` + `components/GrainOverlay.tsx` | Fixed-position depth layers, wired in `app/layout.tsx` |

## Design system
`app/globals.css` — v8.0. Contains design tokens (8px grid, 7-step fluid type, motion tokens),
glass system (`.glass`, `.glass-full`, `.glass-medium`), scroll reveal utilities (`[data-reveal]`),
arch decision table (`.arch-grid`, `.arch-label`), CTA tier hover states, ambient depth classes,
badge/dot/pill variants, and HSTS + security headers via `next.config.ts`.

## Testing
Playwright smoke suite: `e2e/smoke.spec.ts` — **22 tests** covering:
skip-nav focus order, hero visibility, copy integrity (no unicode escapes or unverifiable metrics),
375 px overflow, project count (3 cards), nav scroll-to-section, command palette keyboard,
theme toggle, mailto CTA, `noopener noreferrer` on all external links, metric card headings,
ArchDecision panel visible without interaction, conviction pillar top-borders,
three CTA button tiers (`primary`/`secondary`/`ghost`), writing page article list,
sitemap 200, OG images (homepage + per-project), reading progress bars,
JSON-LD Person schema, and activity API JSON shape.

## License
Personal portfolio. All content © Oscar Scardubu.
