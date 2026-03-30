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
pnpm test:e2e        # build + Playwright Chromium smoke suite (20 tests)
pnpm test:all        # build + full 5-browser Playwright suite
```

## Key routes
| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, projects, about, writing, contact |
| `/work/[slug]` | Case study pages (sabiscore, hashablanca, ml-consulting) |
| `/writing` | Writing index |
| `/writing/[slug]` | Article detail with reading progress |
| `/blog/[slug]` | Blog posts (MDX, statically generated) |
| `/api/og` | Homepage OG image (edge) |
| `/work/[slug]/og` | Per-project OG image (edge) |
| `/api/activity` | Last GitHub commit — ISR 1h |

## Design system
All CSS custom properties live in `app/globals.css` (design tokens, glass system,
fluid type scale, motion tokens). Tailwind utilities consume these via `tailwind.config.js`.

## Testing
Playwright smoke suite: `e2e/smoke.spec.ts` — 20 tests covering:
skip-nav, hero, copy integrity, overflow, project count, nav scroll,
command palette keyboard, theme toggle, mailto CTA, `noopener` links,
architecture decisions expand, writing index, sitemap, metric cards,
OG images, reading progress bars, JSON-LD schema, and activity API.

## License
Personal portfolio. All content © Oscar Scardubu.
