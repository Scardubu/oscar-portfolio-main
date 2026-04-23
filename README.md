# Oscar Ndugbu Portfolio

Production portfolio for Oscar Ndugbu, positioned as a Fullstack Engineer focused on AI infrastructure, fintech systems, and reliability engineering.

Live site: [https://scardubu.dev](https://scardubu.dev)

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Framer Motion 11
- MDX content system
- Playwright E2E tests
- Vercel deployment

## Local Setup

### Requirements

- Node.js >= 20
- pnpm >= 9

### Install and Run

```bash
pnpm install
pnpm dev
```

App starts at `http://localhost:3000`.

## Scripts

```bash
pnpm dev          # start local dev server
pnpm build        # production build
pnpm start        # run built app
pnpm lint         # ESLint checks
pnpm lint:fix     # auto-fix lint issues
pnpm type-check   # strict TypeScript checks
pnpm test:e2e     # Chromium Playwright smoke suite
pnpm test:all     # full Playwright matrix
pnpm audit:copy   # content compliance checks
pnpm lhci         # Lighthouse CI
```

## Project Structure

- `app/`: routes, metadata, API endpoints
- `components/`: all reusable UI sections and primitives
- `content/`: writing and case-study source content
- `lib/`: typed data and helpers
- `e2e/`: Playwright smoke tests
- `public/`: static assets including resume at `public/cv/oscar-ndugbu-resume.pdf`

## Core Sections

- Hero: clear fullstack positioning, proof metrics, CTAs
- Projects: case studies with architecture decisions and measurable outcomes
- Open Source: selected production-focused packages
- About: background, experience, certifications
- Writing: technical essays and implementation breakdowns
- Contact: hiring and consulting conversion surface

## Deployment (Vercel)

1. Push to `main`
2. Vercel auto-builds with `pnpm build`
3. Verify production routes:
	- `/`
	- `/work/[slug]`
	- `/writing`
	- `/api/og`
4. Confirm resume download path:
	- `/cv/oscar-ndugbu-resume.pdf`

## Quality Gates

- Build passes: `pnpm build`
- Type checks pass: `pnpm type-check`
- Lint passes: `pnpm lint`
- Responsive behavior validated in E2E smoke tests
- Metadata and OG routes resolve correctly

## License

Personal portfolio. All content copyright Oscar Ndugbu.
