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
  portfolio-data.ts → PROFILE, HERO, CONVICTION_STATS, LIVE_METRICS, ACTIVITY_FEED
  projects.ts  → PROJECTS — canonical source for all project data
  data/
    skills.ts  → SKILLS (62 skills, 8 pillars)
    blog-articles.ts → article metadata
e2e/           → Playwright smoke tests
public/
  cv/oscar-ndugbu-resume.pdf  → resume download
```

## Site sections

| # | Section | ID | What it proves |
|---|---|---|---|
| 00 | Hero | — | Positioning, conviction stats, proof carousel |
| 01 | Projects | `section-projects` | 4 case studies with arch decisions |
| 01.5 | Production record | `section-testimonials` | Verified system outcomes (not unverified quotes) |
| 02 | Open Source | `open-source` | 4 production packages |
| 03 | Skills | `skills` | 62 skills across 8 pillars, each traced to a live system |
| 04 | About | `section-about` | Operating context and credibility |
| 05 | Writing | `section-writing` | 6 technical posts |
| 06 | Contact | `section-contact` | 3 engagement types + contact form |

## Data layer

Each domain has one canonical source. Do not duplicate across files.

| Domain | Canonical source |
|---|---|
| Projects | `lib/projects.ts` |
| Skills | `lib/data/skills.ts` |
| Hero / Profile | `lib/portfolio-data.ts` |
| Production proof cards | `components/TestimonialsSection.tsx` → `PROOF_CARDS` |
| Writing posts | `content/writing/*.mdx` via `lib/content.ts` |
| Config / URLs | `lib/config.ts` |

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
- Metadata and OG routes resolve correctly

## Contact

**oscar@scardubu.dev** — response within 24 hours.

---

*Personal portfolio. All content copyright Oscar Ndugbu.*