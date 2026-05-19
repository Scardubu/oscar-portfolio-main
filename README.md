# Oscar Ndugbu — scardubu.dev

Staff+ Full-Stack / Infra / AI portfolio. Production systems that stay alive when it matters most — compliant, fast, and relentlessly reliable. Built under Lagos constraints. Deployed to global standards.

**Live site:** [https://scardubu.dev](https://scardubu.dev)

**Canonical system spec:** [CONVICTION_ENGINE_V1_0.md](CONVICTION_ENGINE_V1_0.md)

---

## What it is

A proof system, not a brag sheet. Four production case studies, four open-source packages, 62 verified skills, and writing that explains the decisions behind the work.

## Documentation and governance

- **Primary operating standard:** `CONVICTION_ENGINE_V1_0.md`
- **Release correction history:** `docs/deployment-history/CORRECTIONS.md`
- **Legacy guidance:** archived inside the `## ARCHIVE — v32.0` section of `CONVICTION_ENGINE_V1_0.md` (historical context only)

## Tech stack

- **Framework:** Next.js 15 (App Router, Partial Prerendering, Streaming)
- **UI:** React 19, Tailwind CSS v4, Framer Motion 11 (LazyMotion + domAnimations)
- **Language:** TypeScript strict across all layers
- **Content:** MDX — case studies and writing posts
- **Testing:** Playwright E2E (Chromium smoke suite)
- **Deployment:** Vercel (main branch auto-deploys)

## Testing strategy

- `e2e/smoke.spec.ts` is the fast smoke suite for the core home-page journey and API health checks.
- `tests/portfolio.spec.ts` is the broader V1.0 contract suite for copy, flow hooks, accessibility, and trust-signal regressions.
- `tests/e2e/smoke.spec.ts` and `tests/e2e/user-journey.spec.ts` cover the V1.0 recruiter journey and section-level rendering.
- `pnpm lint` covers `app`, `components`, `hooks`, `lib`, `constants`, `scripts`, `e2e`, and `tests` so runtime code and active test paths stay aligned.

### Playwright strict-mode and Suspense skeletons

Sections use Next.js `<Suspense>` deferred loading. The skeleton fallback renders with `aria-busy="true"` and the real section shares the same `id`. When writing Playwright locators for sections, always scope to the loaded state to avoid strict-mode violations:

```typescript
// ✅ Correct — targets the real section only
page.locator('section#section-writing[aria-labelledby="writing-heading"]')

// ❌ Incorrect — resolves to 2 elements (skeleton + real) during Suspense
page.locator('#section-writing')
```

**Current status:** 81 passed · 2 skipped (command palette — intentional) · 0 failed.

## Local setup

**Requirements:** Node.js ≥ 20, pnpm ≥ 9

```bash
pnpm install
pnpm dev
```

App starts at `http://localhost:3000`.

## Scripts

```bash
pnpm dev          # local dev server
pnpm build        # production build
pnpm start        # run built app
pnpm lint         # ESLint checks
pnpm lint:fix     # auto-fix lint issues
pnpm type-check   # strict TypeScript checks
pnpm test:e2e     # Playwright smoke suite (Chromium)
pnpm test:all     # full Playwright matrix
pnpm audit:copy   # content compliance checks
pnpm lhci         # Lighthouse CI
```

## Project structure

```
app/           → routes, metadata, API endpoints, Suspense orchestration
components/    → section components and shared UI primitives
content/
  writing/     → MDX technical posts (6 articles)
  work/        → MDX case studies (TaxBridge, SabiScore, SwarmXQ, UBEC, Hashablanca)
lib/
  config.ts    → CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl(), canonicalSectionUrl()
  portfolio-data.ts → PROFILE, HERO, CONVICTION_STATS, LIVE_METRICS
  projects.ts  → PROJECTS — canonical source for all project data
  data/
    skills.ts  → SKILLS (62 skills, 8 pillars)
    blog-articles.ts → article metadata
e2e/           → Playwright smoke tests
public/
  cv/oscar-ndugbu-resume.pdf  → resume download
```

## Site sections

| #    | Section           | ID                     | What it proves                                           |
| ---- | ----------------- | ---------------------- | -------------------------------------------------------- |
| 00   | Hero              | —                      | Positioning, conviction stats, proof carousel            |
| 01   | Projects          | `section-projects`     | 4 case studies with arch decisions                       |
| 01.5 | Production record | `section-testimonials` | Verified system outcomes (not unverified quotes)         |
| 02   | Open Source       | `open-source`          | 4 production packages                                    |
| 03   | Skills            | `skills`               | 62 skills across 8 pillars, each traced to a live system |
| 04   | About             | `section-about`        | Operating context and credibility                        |
| 05   | Writing           | `section-writing`      | 6 technical posts                                        |
| 06   | Contact           | `section-contact`      | 3 engagement types + contact form                        |

## Data layer

Each domain has one canonical source. Do not duplicate across files.

| Domain                 | Canonical source                                     |
| ---------------------- | ---------------------------------------------------- |
| Projects               | `lib/projects.ts`                                    |
| Skills                 | `lib/data/skills.ts`                                 |
| Hero / Profile         | `lib/portfolio-data.ts`                              |
| Production proof cards | `components/TestimonialsSection.tsx` → `PROOF_CARDS` |
| Writing posts          | `content/writing/*.mdx` via `lib/content.ts`         |
| Config / URLs          | `lib/config.ts`                                      |

`lib/data.ts` is a deprecated orphan from pre-v24. It is not imported by anything. Do not import from it. See the deprecation header in that file for canonical alternatives.

## Deployment (Vercel)

1. Push to `main` → Vercel auto-builds with `pnpm build`
2. Verify production routes: `/`, `/work/[slug]`, `/writing`, `/api/og`
3. Confirm resume download: `/cv/oscar-ndugbu-resume.pdf`
4. Confirm Skills section at `/#skills` renders all 8 pillars

## Quality gates

- Build passes: `pnpm build`
- Type checks pass: `pnpm type-check`
- Lint passes: `pnpm lint`
- Smoke tests pass: `pnpm test:e2e`
- Full Playwright suite passes: `pnpm test:all`
- Metadata and OG routes resolve correctly

## Validation notes

- If Playwright browsers are missing locally, install them with `pnpm exec playwright install chromium` before running Chromium smoke coverage.
- The live activity feed is owned by `app/api/activity/route.ts`; it is no longer mirrored in `lib/portfolio-data.ts`.
- Footer live status is driven by the `<SystemStatus labelMode="full" />` component — no hardcoded copy.
- Skills bar fill animation is capped at 280ms (`--dur-slow`) to comply with the ≤300ms motion rule.

## Contact

**oscar@scardubu.dev** — response within 24 hours.

---

*Personal portfolio. All content copyright Oscar Ndugbu.*
