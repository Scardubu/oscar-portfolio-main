# Oscar Ndugbu — scardubu.dev

Staff+ Full-Stack / Infra / AI portfolio. Production systems that stay alive when it matters most — compliant, fast, and relentlessly reliable. Built under Lagos constraints. Deployed to global standards.

**Live site:** [https://scardubu.dev](https://scardubu.dev)

**Canonical system spec:** [CONVICTION_ENGINE_V1_0.md](CONVICTION_ENGINE_V1_0.md)

---

## What it is

A proof system, not a brag sheet. Four production case studies, four open-source packages, 62 verified skills, and writing that explains the decisions behind the work.

---

## Tech stack

| Layer      | Technology                                                         |
| ---------- | ------------------------------------------------------------------ |
| Framework  | Next.js 15 — App Router, Partial Prerendering, Streaming           |
| UI         | React 19, Tailwind CSS v4, Framer Motion 11                        |
| Language   | TypeScript strict across all layers                                |
| Scroll     | Lenis smooth scroll + GSAP ScrollTrigger (Cinematic Scroll System) |
| WebGL      | Three.js — atmospheric brush field (ThreeBrushField)               |
| Content    | MDX — case studies and writing posts                               |
| Testing    | Playwright E2E (smoke + full journey suites)                       |
| CI         | Lighthouse CI, husky pre-commit (lint + type-check + smoke)        |
| Deployment | Vercel — main branch auto-deploys                                  |

---

## Cinematic Scroll System

The homepage uses an 8-chapter cinematic scroll architecture. Understanding it is required before touching any section component, the scroll provider, or the WebGL canvas.

### Architecture overview

```
ScrollCinemaProvider          — Lenis instance, activeChapter state, scrollProgressRef
  └── GSAP ticker             — single RAF loop shared by Lenis + ScrollTrigger
       └── ScrollTrigger      — per-section reveal timelines (via useChapterTimeline)
  └── ThreeBrushField         — Three.js WebGL atmospheric shader
       ├── Renderer RAF       — reads scrollProgressRef, updates uniforms
       └── Palette effect     — imperative uniform mutation on activeChapter change
  └── ScrollProgress          — chapter-aware vertical rail (reads context)
  └── Navbar                  — useScrollCinema context for active dot
```

### The 8 chapters

| Index | Chapter ID    | Section              | Accent           |
| ----- | ------------- | -------------------- | ---------------- |
| 0     | `prologue`    | hero                 | `#67e8f9` teal   |
| 1     | `proof`       | section-projects     | `#5eead4` mint   |
| 2     | `credibility` | section-testimonials | `#fbbf24` amber  |
| 3     | `craft`       | open-source          | `#38bdf8` sky    |
| 4     | `range`       | skills               | `#c084fc` violet |
| 5     | `human`       | section-about        | `#fde68a` gold   |
| 6     | `judgment`    | section-writing      | `#93c5fd` blue   |
| 7     | `epilogue`    | section-contact      | `#34d399` green  |

Chapter configuration is canonical in `lib/cinematic/chapters.ts`. Do not modify it.

### Animation ownership — critical constraint

**GSAP ScrollTrigger** owns all section-level scroll reveals.
**Framer Motion** owns the hero section, micro-interactions (hover, accordion, mobile menu), and carousels.
They do not overlap. Mixing them inside the same element causes competing animation ownership.

```
✅ DO:     whileHover, whileTap, AnimatePresence inside any component
✅ DO:     data-cinematic="title|eyebrow|panel|card|media|cta" on elements inside ChapterFrame
✅ DO:     setActiveChapter() inside ScrollTrigger onEnter/onEnterBack callbacks

❌ DO NOT: whileInView, initial="hidden", animate="visible" inside ChapterFrame sections
❌ DO NOT: framer-motion useScroll/useTransform on any homepage-mounted component
❌ DO NOT: add activeChapter to the ThreeBrushField main effect dependency array
```

### Adding a new section

1. Add a chapter config to `lib/cinematic/chapters.ts`.
2. Wrap the section in `<ChapterFrame chapter={chapter}>`.
3. Add `data-cinematic="[target]"` attributes to animatable elements.
4. `useChapterTimeline` runs automatically from `ChapterFrame`.
5. Do not add `whileInView` or scroll animations — GSAP handles everything inside `ChapterFrame`.

### ThreeBrushField performance budget

Three RAF loops share one frame budget:
- Lenis: smooth scroll interpolation
- GSAP ticker: ScrollTrigger calculations
- ThreeBrushField: WebGL render

Lenis feeds into GSAP ticker via `gsap.ticker.add(raf)`. `ScrollTrigger.update()` is intentionally NOT called manually — GSAP drives it from the ticker. On mobile, `mix-blend-mode: screen` is disabled (costs a GPU compositor pass per frame on low-power devices).

---

## Patch changelog — Cinematic Scroll v1.1

Seven files were patched to fix critical bugs and add polish enhancements. The patch is available in `oscar-portfolio-cinematic-patch.zip`.

### Bug fixes (scroll behaviour was broken)

| File                       | Bug                                 | Impact                                             |
| -------------------------- | ----------------------------------- | -------------------------------------------------- |
| `ScrollCinemaProvider.tsx` | `immediate: true` in `scrollTo()`   | Every navbar click teleported instead of gliding   |
| `ThreeBrushField.tsx`      | `activeChapter` in main effect deps | Canvas flashed black on every chapter change       |
| `HeroSection.tsx`          | No ScrollTrigger for hero section   | Prologue chapter never re-activated on scroll-back |

### Enhancements (visual quality + performance)

| File                       | Enhancement                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `ChapterFrame.tsx`         | `noBorderTop` prop to remove hero/projects visual seam                                     |
| `ProjectsSection.tsx`      | Passes `noBorderTop` — brush field flows continuously into first section                   |
| `globals.css`              | `@property` declarations + `html[data-active-chapter]` CSS cross-fades over 0.65s expo-out |
| `globals.css`              | Scrollbar thumb uses `color-mix(--chapter-accent)` instead of hardcoded teal               |
| `ThreeBrushField.tsx`      | `sm:[mix-blend-mode:screen]` — blend mode disabled on mobile                               |
| `ScrollCinemaProvider.tsx` | Removed `ScrollTrigger.update()` from Lenis callback (was double-processing)               |
| `ScrollCinemaProvider.tsx` | Added `aria-live="polite"` region for screen reader chapter announcements                  |
| `useChapterTimeline.ts`    | `typeof window === 'undefined'` guard (SSR/RSC analysis safety)                            |

### Integration quick wins — UX polish v1.2

| File              | Quick win                                                                                               | Benefit                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `HeroSection.tsx` | Added tab-panel relationships (`aria-controls`, `aria-labelledby`, active `tabIndex`) to proof carousel | Better keyboard and screen-reader navigation     |
| `globals.css`     | Refined proof-dot touch targets to 24x24 with visual 6px center indicator                               | WCAG-friendly tap areas on mobile                |
| `globals.css`     | Added ultra-narrow hero safeguards (`max-width: 389px`) for availability metadata and stat wrapping     | Cleaner 320-390px rendering with no clipping     |
| `globals.css`     | Added `min-width: 1920px` hero scale and spacing tuning                                                 | Better composition on ultrawide desktop displays |
| `Footer.tsx`      | Removed no-op inline style object from primary CTA                                                      | Cleaner code and reduced maintenance overhead    |

Validation pass after v1.2 polish:
- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- `pnpm run build` ✅

### Stability fixes — runtime guard v1.3

| File                    | Fix                                                                                          | Impact                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `lib/motionVariants.ts` | Corrected `AnimatePresence` mode from invalid `popout` to valid `popLayout`                  | Prevents client runtime crashes in motion paths                                 |
| `tests/setup.ts`        | Added `scrollMargin` to `MockIntersectionObserver` and removed unresolved side-effect import | Clears editor diagnostics and keeps test setup aligned with current DOM typings |

Validation pass after v1.3 stability fix:
- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- `pnpm run build` ✅
- Browser runtime probe on `/` reported `NO_CLIENT_ERRORS_DETECTED` ✅

### Production hardening — local font resilience + responsive audit v1.4

| File              | Change                                                                                 | Impact                                                                     |
| ----------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `app/layout.tsx`  | Migrated to local-only CSS font variable strategy for root typography token assignment | Eliminates build/runtime fragility from remote Google Fonts fetch timeouts |
| `app/globals.css` | Kept targeted small-screen and ultrawide guards from the surgical responsive audit     | Preserves stable hero/navigation composition across edge viewport classes  |

Validation pass after v1.4 hardening:
- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- Responsive sweep at `320, 375, 390, 430, 768, 1024, 1280, 1920` ✅
- Sweep checks: horizontal overflow, hero/nav edge bounds, proof-dot wrapping ✅

### Landing page consistency — shared intro + formatter v1.5

| File                                 | Change                                                    | Impact                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `components/shared/SectionIntro.tsx` | Added a shared motion-aware editorial intro primitive     | Removes repeated section header markup and keeps Projects, Testimonials, Open Source, Skills, About, Writing, and Contact aligned |
| `lib/utils.ts`                       | Added `formatMonthYear()`                                 | Reuses the hero/about availability date formatting in one place                                                                   |
| `components/*Section.tsx`            | Migrated the landing sections to the shared intro pattern | Visual rhythm is now consistent across the full page                                                                              |

Validation pass after v1.5 consistency refactor:
- `pnpm test:smoke` ✅

### Runtime hygiene + browser data refresh v1.6

| File             | Change                                                                         | Impact                                                                                       |
| ---------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `app/layout.tsx` | Removed duplicate `fixes.css` import                                           | Prevents redundant stylesheet loading and keeps root layout intent clean                     |
| `app/layout.tsx` | Preserved pre-seeded `window.__commandPaletteRequested` flag during early boot | Keeps command palette bootstrap reliable across early key interception and test init scripts |
| `pnpm-lock.yaml` | Refreshed `caniuse-lite` and `baseline-browser-mapping`                        | Removes stale browser dataset warnings from routine builds                                   |

Validation pass after v1.6 maintenance:
- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- `pnpm run build` ✅
- `pnpm run test:smoke` ✅

---

## Local setup

**Requirements:** Node.js ≥ 20.0.0 < 24.0.0, pnpm ≥ 9.0.0

```bash
# Clone and install
git clone https://github.com/Scardubu/oscar-portfolio.git
cd oscar-portfolio
pnpm install

# Start development server
pnpm dev
# → http://localhost:3000

# If Playwright browsers are not installed
pnpm exec playwright install chromium
```

---

## Scripts

```bash
pnpm dev            # development server (localhost:3000)
pnpm build          # production build — required integration check
pnpm start          # serve the production build locally
pnpm type-check     # strict TypeScript, zero tolerance
pnpm lint           # ESLint across all source paths
pnpm lint:fix       # auto-fix lint issues
pnpm test:smoke     # build + Playwright smoke suite (fast, Chromium only)
pnpm test:e2e       # full Playwright suite (Chromium)
pnpm test:mobile    # Playwright mobile (Chrome + Safari)
pnpm test:all       # complete matrix across all configured projects
pnpm audit:copy     # content compliance verification (NRS, metric sources)
pnpm lhci           # Lighthouse CI audit
pnpm analyze        # bundle analyser (set ANALYZE=true)
```

## Maintenance

Refresh browser compatibility metadata when build output reports stale `caniuse-lite` or Baseline data:

```bash
npx update-browserslist-db@latest
```

This updates the lockfile entries used by `browserslist`, `autoprefixer`, and Next.js build tooling without changing your declared application dependencies.

---

## Project structure

```
oscar-portfolio/
│
├── app/
│   ├── globals.css              ← design tokens, cinematic chapter CSS, scrollbar
│   ├── layout.tsx               ← fonts, metadata, JSON-LD, layer stack
│   ├── page.tsx                 ← homepage (Suspense-deferred sections)
│   ├── providers.tsx            ← ThemeProvider → MotionProvider → ScrollCinemaProvider
│   ├── api/
│   │   ├── activity/route.ts    ← GitHub activity proxy (LiveActivityBar)
│   │   ├── contact/route.ts     ← contact form (Resend)
│   │   └── og/route.ts          ← Open Graph image generation
│   └── work/[slug]/             ← case study MDX routes
│       └── writing/             ← writing MDX routes
│
├── components/
│   ├── cinematic/
│   │   ├── ScrollCinemaProvider.tsx ← Lenis + GSAP ticker + activeChapter context
│   │   ├── ThreeBrushField.tsx      ← WebGL atmospheric shader
│   │   └── ChapterFrame.tsx         ← section wrapper (calls useChapterTimeline)
│   ├── HeroSection.tsx          ← framer-motion hero (owns prologue ScrollTrigger)
│   ├── ProjectsSection.tsx      ← proof chapter (ChapterFrame + noBorderTop)
│   ├── TestimonialsSection.tsx  ← credibility chapter
│   ├── OpenSourceSection.tsx    ← craft chapter
│   ├── SkillsSection.tsx        ← range chapter
│   ├── AboutSection.tsx         ← human chapter
│   ├── WritingSection.tsx       ← judgment chapter
│   ├── ContactSection.tsx       ← epilogue chapter
│   ├── Navbar.tsx               ← useScrollCinema active dot
│   ├── ScrollProgress.tsx       ← chapter-aware vertical rail
│   └── ...
│
├── hooks/
│   ├── useChapterTimeline.ts    ← GSAP ScrollTrigger per-section reveals
│   ├── useMagnetic.ts           ← spring motion values for magnetic buttons
│   ├── useSpotlight.ts          ← rAF-throttled cursor spotlight
│   ├── useReducedMotion.ts      ← prefers-reduced-motion + motion tier
│   └── ...
│
├── lib/
│   ├── cinematic/
│   │   └── chapters.ts          ← 8-chapter registry (canonical — do not modify)
│   ├── motionVariants.ts        ← complete framer-motion vocabulary
│   ├── portfolio-data.ts        ← PROFILE, HERO, CONVICTION_STATS (canonical)
│   ├── projects.ts              ← PROJECTS (canonical)
│   ├── data/
│   │   ├── skills.ts            ← 62 skills, 8 pillars (canonical)
│   │   └── blog-articles.ts     ← article metadata
│   └── config.ts                ← CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl()
│
├── content/
│   ├── writing/*.mdx            ← 6 technical posts
│   └── work/*.mdx               ← case studies (TaxBridge, SabiScore, SwarmXQ...)
│
├── public/
│   ├── cv/oscar-ndugbu-resume.pdf
│   ├── headshot.webp
│   └── images/
│
└── tests/ + e2e/                ← Playwright suites
```

---

## Data layer — single source of truth

Each domain has exactly one canonical source. Never duplicate across files.

| Domain                       | Canonical source                                     |
| ---------------------------- | ---------------------------------------------------- |
| Projects                     | `lib/projects.ts`                                    |
| Skills (62 skills)           | `lib/data/skills.ts`                                 |
| Hero copy + CONVICTION_STATS | `lib/portfolio-data.ts`                              |
| Production proof cards       | `components/TestimonialsSection.tsx` → `PROOF_CARDS` |
| Chapter config               | `lib/cinematic/chapters.ts`                          |
| Motion vocabulary            | `lib/motionVariants.ts`                              |
| Writing posts                | `content/writing/*.mdx` via `lib/content.ts`         |
| Config / URLs                | `lib/config.ts`                                      |

`lib/data.ts` is a **deprecated orphan** — not imported by anything. Do not import from it.

---

## Testing strategy

### Playwright strict-mode + Suspense

Sections use Next.js `<Suspense>` deferred loading. Skeletons render with `aria-busy="true"` and share the same section `id` as the real section.

```typescript
// ✅ Target the loaded section only
page.locator('section#section-writing[aria-labelledby="writing-heading"]')

// ❌ Resolves to 2 elements during Suspense (skeleton + real)
page.locator('#section-writing')
```

### Suite breakdown

| Suite        | Path                             | Speed | Covers                                    |
| ------------ | -------------------------------- | ----- | ----------------------------------------- |
| Smoke        | `e2e/smoke.spec.ts`              | ~45s  | Core journey, API health, mobile overflow |
| V1 contract  | `tests/portfolio.spec.ts`        | ~90s  | Copy, flow hooks, a11y, trust signals     |
| User journey | `tests/e2e/user-journey.spec.ts` | ~60s  | Full recruiter scroll journey             |
| Mobile       | `--project=mobile-chrome`        | ~120s | Touch targets, carousel, viewport         |

**Current status:** Chromium smoke gate passing; 3 intentional skips remain (command palette, nav-links, user-journey).

**Final verification:** local production build, type-check, lint, and Chromium smoke suite all pass on the current branch. The homepage now has a single canonical live-activity status target, and the mobile overflow checks at 320px and 375px are green.

---

## Quality gates — pre-deployment checklist

Run these in order. Every gate must pass before merging or deploying.

```bash
# 1. Type safety
pnpm type-check

# 2. Lint
pnpm lint

# 3. Production build (catches App Router rendering regressions)
pnpm build

# 4. Playwright smoke (Chromium, built output)
pnpm test:smoke

# 5. Full suite
pnpm test:all

# 6. Lighthouse CI (requires build to be running)
pnpm start &
pnpm lhci
```

Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 100.

---

## Deployment

### Vercel (recommended)

```bash
# 1. Connect the GitHub repo to a Vercel project (one-time)
#    Settings → Framework: Next.js, Root Directory: ./, Build: pnpm build

# 2. Set required environment variables in Vercel dashboard:
RESEND_API_KEY=re_...           # contact form email delivery
NEXT_PUBLIC_SITE_URL=https://scardubu.dev
GITHUB_TOKEN=ghp_...            # optional — raises activity API rate limit

# 3. Push to main → auto-deploy
git push origin main

# 4. Verify after deploy:
open https://scardubu.dev                            # homepage
open https://scardubu.dev/work/taxbridge             # case study
open https://scardubu.dev/writing                    # writing index
open https://scardubu.dev/api/og                     # OG image (200 OK)
curl -I https://scardubu.dev/cv/oscar-ndugbu-resume.pdf  # 200 OK
```

### Manual / Netlify fallback

```bash
# Build
pnpm build

# Serve locally to verify
pnpm start

# Deploy via Netlify CLI
netlify deploy --prod --dir=.next
```

`netlify.toml` is already configured in the repo for Netlify fallback.

### Environment variables

| Variable               | Required | Purpose                                             |
| ---------------------- | -------- | --------------------------------------------------- |
| `RESEND_API_KEY`       | Yes      | Contact form email delivery                         |
| `NEXT_PUBLIC_SITE_URL` | Yes      | Canonical URL for metadata + OG                     |
| `GITHUB_TOKEN`         | No       | Raises GitHub API rate limit for live activity feed |

---

## Responsive QA viewport targets

After any hero or layout change, verify these breakpoints:

```
320px   — smallest phone (iPhone SE gen 1)
360px   — standard Android
390px   — iPhone 14 Pro
768px   — iPad portrait
1024px  — iPad landscape / small laptop
1280px  — standard laptop
1536px  — large desktop
```

For hero validation specifically, confirm four things together:
1. No horizontal overflow
2. Stable headline wrapping
3. Proof carousel snap behavior
4. Right-rail dashboard density on large screens

---

## Cinematic scroll acceptance criteria

After the v1.1 patch, verify each of the following manually:

**Smooth scroll**
- Click any navbar link → Lenis glides to section (not instant jump)
- Click hash link in hero CTAs → same cinematic glide

**Chapter system**
- Scroll down into Projects → progress rail shows "Proof" active
- Scroll back up into hero → progress rail returns to "Prologue" active
- Repeat for every chapter bidirectionally

**WebGL canvas**
- Scroll slowly from hero into Projects → no black flash on canvas
- Continue through all 8 chapters → palette shifts smoothly with each

**CSS cross-fade**
- Observe scrollbar thumb colour while scrolling → it shifts through teal → mint → amber → sky → violet → gold → blue → green

**Border continuity**
- Inspect hero/projects boundary → no visible horizontal rule line

**Accessibility**
- Screen reader: chapter changes announce "Now viewing: [chapter label]"
- Keyboard: Tab through entire page without getting stuck

---

## Section map

| #    | Section      | ID                     | Chapter     | What it proves                                 |
| ---- | ------------ | ---------------------- | ----------- | ---------------------------------------------- |
| 00   | Hero         | —                      | prologue    | Positioning, conviction stats, proof carousel  |
| 01   | Projects     | `section-projects`     | proof       | 4 case studies with arch decisions             |
| 01.5 | Testimonials | `section-testimonials` | credibility | Verified system outcomes                       |
| 02   | Open Source  | `open-source`          | craft       | 4 production packages                          |
| 03   | Skills       | `skills`               | range       | L1 trust + L2 lineage + full 62-skill explorer |
| 04   | About        | `section-about`        | human       | Operating context and credibility              |
| 05   | Writing      | `section-writing`      | judgment    | 6 technical posts                              |
| 06   | Contact      | `section-contact`      | epilogue    | 3 engagement types + contact form              |

---

## Performance notes

- Image formats: AVIF + WebP via Next.js `images.formats` config
- CSS optimisation: `experimental.optimizeCss: true` via `critters`
- Font loading: `display: 'swap'` on all Google Fonts (Syne, DM Sans, JetBrains Mono, Playfair Display)
- LazyMotion + domAnimations — framer-motion tree-shaken to animations-only bundle (~18kB)
- ThreeBrushField: DPR capped at 1.5× to limit GPU pressure on high-res mobile screens
- `mix-blend-mode: screen` on the WebGL canvas is disabled at < 640px (saves a GPU compositor pass per frame)

---

## Contact

**oscar@scardubu.dev** — response within 24 hours, usually faster.

---

*Personal portfolio. All content copyright Oscar Ndugbu.*
