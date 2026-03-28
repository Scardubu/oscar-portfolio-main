# Copilot Instructions for oscar-portfolio

## Project Overview

This is the production portfolio website for **Oscar Ndugbu**, a Full-Stack ML Engineer. It is a Next.js 15 App Router application deployed at [scardubu.dev](https://scardubu.dev).

## Tech Stack

- **Framework:** Next.js 15 (App Router only — no Pages Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion 11+
- **Blog:** MDX via `next-mdx-remote`, content lives in `content/blog/*.mdx`
- **Forms:** React Hook Form + Zod validation
- **Email:** Resend API
- **Analytics:** Vercel Analytics + Google Analytics 4
- **Monitoring:** Sentry
- **Package Manager:** pnpm (v9) — always use `pnpm`, never `npm` or `yarn`
- **Deployment:** Vercel (auto-deploys `main` branch)

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (Turbopack)
pnpm run build        # Production build
pnpm run lint         # ESLint (next lint)
pnpm run type-check   # TypeScript check (tsconfig.typecheck.json)
pnpm run format       # Prettier
```

> **Node ≥ 20 and pnpm ≥ 9 are required** (see `engines` in `package.json`).

## Project Structure

```
app/                  # Next.js App Router pages and layouts
  api/                # API route handlers
  blog/               # Blog listing and post pages
  actions/            # Server Actions
  lib/                # App-level utilities (co-located with app)
components/           # Shared React components
  ui/                 # shadcn/ui primitives
  blog/               # Blog-specific components
hooks/                # Custom React hooks
lib/                  # Global utilities, data-fetching helpers, types
  types/              # Shared TypeScript types
  data/               # Static data files
content/
  blog/               # MDX blog posts (*.mdx)
public/               # Static assets
src/
  data/               # Portfolio data (projects, skills, etc.)
tests/
  unit/               # Vitest unit tests
  e2e/                # Playwright E2E tests
```

## TypeScript Path Aliases

```ts
@/*              → ./*
@/components/*   → ./components/*
@/lib/*          → ./lib/*
@/hooks/*        → ./hooks/*
@/data/*         → ./src/data/*
@/types/*        → ./lib/types/*
```

Always use these aliases for imports instead of relative paths when crossing directory boundaries.

## Coding Conventions

- **TypeScript strict mode** — all code must pass `pnpm run type-check`.
- **No `any` types** — use proper generics or `unknown` with type guards.
- **React Server Components by default** — only add `"use client"` when the component needs browser APIs, event handlers, or React hooks.
- **No inline styles** — use Tailwind CSS utility classes; custom values go in `tailwind.config.js`.
- **Accessibility first** — all interactive elements need ARIA labels; images need `alt` text. The ESLint `jsx-a11y` plugin enforces this.
- **Single responsibility** — keep components focused; extract complex logic into hooks in `hooks/`.
- **Named exports** — prefer named exports over default exports for non-page components.

## Blog System

- Posts are `.mdx` files in `content/blog/`.
- Each post requires frontmatter: `title`, `publishedAt` (YYYY-MM-DD), `readTime`, `category`, `tags[]`, `excerpt`.
- `lib/blog.ts` exports the data layer: `getAllBlogPosts()`, `getBlogPost(slug)`, and `toSearchBlogPost()`.
- `BlogPostMeta` is `Omit<BlogPost, "content">` — use it for list/search flows to avoid loading MDX content unnecessarily.
- Valid categories: `production-ml`, `mlops`, `ai-nigeria`, `full-stack-ml`.
- Blog images go in `public/blog/[slug]/`.
- See `docs/deployment-history/BLOG_GUIDE.md` for the full authoring guide.

## API Routes

- Located in `app/api/`.
- Use Next.js `NextRequest`/`NextResponse` types.
- Validate all inputs with Zod before processing.
- Return consistent JSON error shapes: `{ error: string }`.

## Testing

- **Unit tests:** Vitest (`tests/unit/`). Run with `pnpm run test` (when script is configured).
- **E2E tests:** Playwright (`tests/e2e/`). Run with `pnpm run test:e2e`.
- Co-locate test fixtures with their tests.
- Do not delete or skip existing tests.

## Environment Variables

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX      # Google Analytics
NEXT_PUBLIC_BASE_URL=https://...    # Base URL for absolute links
RESEND_API_KEY=re_...               # Contact form email sending
SENTRY_DSN=https://...              # Error monitoring
```

Public variables (prefixed `NEXT_PUBLIC_`) are safe to reference in client components.

## Key Constraints

- Always use `pnpm` — never `npm install` or `yarn`.
- The TypeScript configuration (`tsconfig.json`) only includes files under `app/`, `lib/`, `hooks/`, and specific component subdirectories. New files outside those paths must be added to `tsconfig.json` if they need type checking.
- The ESLint config (`eslint.config.mjs`) has an `ignoredFiles` list for legacy components — do not add new components to this list; fix lint issues instead.
- Avoid introducing new dependencies without checking for security vulnerabilities first.
- Keep bundle size in mind: use dynamic imports (`next/dynamic`) for heavy client-side components.
