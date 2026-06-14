# SCARDUBU Production Wordmark Implementation

Concept 01 — CONVICTION has been implemented as a live, production-safe wordmark system.

## Files

- `components/BrandWordmark.tsx` — reusable primary wordmark component.
- `app/globals.css` — brand tokens, wordmark sizing, kerning, and per-glyph optical corrections.
- `components/Navbar.tsx` — primary navigation lockup upgraded to `SCARDUBU`.
- `components/HeroSection.tsx` — hero identity upgraded with the production wordmark.
- `components/OGImage.tsx` — social image typography aligned to the new wordmark.
- `app/api/og/route.tsx` — dynamic OG route aligned to the new wordmark.

## Usage

```tsx
import { BrandWordmark } from '@/components/BrandWordmark';

<BrandWordmark size="nav" />
<BrandWordmark size="hero" />
<BrandWordmark size="compact" tone="dark" />
```

## Rules

- Use uppercase `SCARDUBU` for the primary mark.
- Use dark mode as the primary environment: `#050607` background, `#f5f7fa` mark.
- Keep clear space around the mark equal to the cap height of the `S`.
- Do not stretch, condense, recolor arbitrarily, add glow directly to letters, or reduce tracking below the compact setting.
- Use a future `SC` monogram for favicon/social avatar instead of forcing the full wordmark at tiny sizes.
