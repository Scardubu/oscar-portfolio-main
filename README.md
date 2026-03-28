# Oscar Scardubu — Portfolio

Production portfolio for [scardubu.dev](https://scardubu.dev), built as a Next.js 15 App Router site for case studies, technical writing, and production ML product positioning.

## Stack

Next.js 15 · React 19 · TypeScript strict · Tailwind CSS 4 · Framer Motion · MDX · Vercel Analytics · Vercel OG · Playwright

## Core Surfaces

- `/` home page with hero, production systems, about, contact, and featured writing
- `/writing` article index and `/writing/[slug]` article detail pages
- `/work/[slug]` case-study pages sourced from MDX content
- `/og` edge-generated social image

## Public API Surfaces

- `/api/contact` validates contact submissions with Zod, rate-limits repeated attempts, and sends mail via Resend when `RESEND_API_KEY` is configured
- `/api/portfolio-metrics` returns cacheable benchmarked portfolio metrics for optional dashboard surfaces
- `/api/live-metrics` returns public-safe operational status without exposing real-time product counts
- `/api/sabiscore-preview` intentionally returns `410 Gone` because the preview surface is not exposed publicly

## Development

Use `pnpm` only.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm type-check
pnpm build
pnpm test:e2e
```

For a production verification pass, run the commands in this order:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm test:e2e
```

## Deployment

- CI runs lint, type-check, build, and Chromium Playwright smoke tests through [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Lighthouse runs separately through [.github/workflows/lighthouse.yml](.github/workflows/lighthouse.yml)
- Vercel deploys from the `main` branch

## Content

- Writing content lives in `content/writing/*.mdx`
- Case-study content lives in `content/work/*.mdx`
- Content loading and MDX compilation live in `lib/content.ts`
- Published MDX should not reference placeholder assets; broken image references are treated as release blockers

## License

Personal portfolio. All content © Oscar Scardubu.
