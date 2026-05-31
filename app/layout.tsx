// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// ─────────────────────────────────────────────────────────────────────────────
// CHANGELOG v14.0 (final corrections, refinements, creative enhancements)
// ─────────────────────────────────────────────────────────────────────────────
//
//   FIX: `twitter.description` absent — added, parity-matched to og:description.
//     LinkedIn unfurl, iMessage link preview, and Slack both read twitter:description
//     as fallback when og:description is unavailable or truncated. This was the
//     only OG-equivalent field missing from the twitter card across v1–v13.
//
//   FIX: SVG filter ID `noiseFilter` → `scar-grain-noise` — scoped to prevent
//     collision with third-party component SVG filters injected at runtime (e.g.
//     animation libraries, icon kits). Both `<filter id>` and `filter="url(#...)"
//     updated in the same self-contained block.
//     NOTE: `glass-refraction` deliberately left as-is — it is consumed by
//     LiquidGlassRefractionSVG which cannot be patched here. Coordinated rename
//     deferred: rename both this definition and the component's url(#...) reference
//     to `scar-glass-refraction` in the same commit.
//
//   FIX: OG image `alt` upgraded from generic `'Oscar Ndugbu portfolio'` to a
//     full descriptive string matching the Person schema jobTitle. Accessibility
//     crawlers and screen-reader unfurl renderers use this as the image caption.
//
//   FIX: `cn()` comment corrected — v13.0 comment claimed active dynamic behavior
//     on a static string; now accurately documents the composition utility's
//     present scope (single static class string) and its forward-use contract.
//
//   REFACTOR: `<html>` className now uses `cn()` — replaces template-literal
//     interpolation; consistent with the cn() adoption in the body className and
//     resilient to future conditional font-variable additions (e.g. RTL locale
//     switching, A/B font experiments).
//
//   REFACTOR: JSON-LD consolidated from a single Person `<script>` into a unified
//     `@graph` block (single `<script id="json-ld-schema">`). Two separate
//     `@context` script tags is valid but suboptimal — `@graph` is the W3C/
//     Google-recommended pattern for multi-entity pages; it lets the Knowledge
//     Graph extractor resolve `@id` cross-references between Person and WebSite
//     in one parse pass rather than two, and eliminates duplicate `@context`
//     overhead in the HTML payload.
//
//   ADD: `@id` anchor on Person — `https://www.scardubu.dev/#person`. Without
//     an @id, Google cannot link this entity to co-references on other pages
//     (e.g. blog posts, press mentions). The anchor is the stable identifier.
//
//   ADD: `mainEntityOfPage` on Person — signals this URL as the canonical web
//     presence for the entity. Required for Google to emit a Knowledge Panel
//     sitelink pointing to the portfolio.
//
//   ADD: `image` on Person — Google uses this for Knowledge Panel profile photo.
//     Currently points to /api/og (1200×630 banner) as a fallback. Replace with
//     a dedicated 400×400 headshot endpoint when available; aspect ratio matters
//     for the circular crop in search cards.
//
//   ADD: `worksFor` on Person — disambiguates employment status in structured
//     data; important for recruiter-facing rich results that display company
//     affiliation. Without it the field is empty in some crawlers' person cards.
//
//   ADD: `'Systems Architecture'` + `'Distributed Systems'` to `knowsAbout` —
//     v13.0 added `'Systems Architect'` to metadata keywords but the corresponding
//     structured-data field was not updated. This closes that content/schema drift.
//
//   ADD: WebSite schema in `@graph` — `@type: 'WebSite'` with `@id` anchor,
//     `inLanguage`, `copyrightYear`, `alternateName`. Cross-references Person via
//     `@id` in `author` and `copyrightHolder`. Enables Google Sitelinks eligibility.
//
//   ENHANCE: Command palette script now dispatches `CustomEvent('command-palette:open')`
//     alongside the existing global flag. React components can subscribe via
//     `document.addEventListener('command-palette:open', handler)` instead of
//     polling `window.__commandPaletteRequested` at mount time, which is racy if
//     the keydown fires between module evaluation and the first useEffect run.
//     The global flag is kept for backward compatibility with existing consumers.
//
// ─────────────────────────────────────────────────────────────────────────────
// KEEP (unchanged from v13.0):
//   LazyMotion + domAnimation in MotionProvider (providers.tsx).
//   JetBrains_Mono + --font-mono variable.
//   maximumScale: 1 in viewport.
//   authors + creator in metadata.
//   locale: 'en_US' in openGraph.
//   Syne + DM_Sans — deliberate brand fonts, not Inter.
// ─────────────────────────────────────────────────────────────────────────────
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google';

import { cn } from '@/lib/utils';

import { Providers } from '@/app/providers';
import CursorGlow from '@/components/CursorGlow';
import { DeferredCommandPalette } from '@/components/DeferredCommandPalette';
import { Footer } from '@/components/Footer';
import { PageWrapper } from '@/components/PageWrapper';
import Navbar from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { DeferredThreeBrushField } from '@/components/cinematic/DeferredThreeBrushField';

// v2026.9: import order corrected — globals.css first, fixes.css second (overrides)
import './globals.css';
import './fixes.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
  fallback: ['Avenir Next', 'Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
  fallback: ['Inter', 'Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
});

// v13.0: Explicit mono font for code/terminal surfaces.
// Resolves system-mono fallback regression on Windows (Courier New).
// preload: false — non-critical path, loads after Syne + DM_Sans.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['Fira Code', 'Cascadia Code', 'Consolas', 'Menlo', 'monospace'],
});

// ── Site URL Configuration ─────────────────────────────────────────────────────
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000');

const isVercelProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
const isPreviewDeployment = process.env.NEXT_PUBLIC_VERCEL_URL?.includes('vercel.app') ?? false;

const shouldLoadVercelInsights = isVercelProduction && !isPreviewDeployment;

export const metadata: Metadata = {
  title: {
    default: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    template: '%s · Oscar Ndugbu',
  },
  description:
    'Staff+ Full-Stack Engineer in Lagos. TaxBridge: 4h→15min filing. SabiScore: ensemble ML inference + zero-drop queues. SwarmXQ: self-improving agents. Systems that hold at 2am.',
  metadataBase: new URL(siteUrl),
  authors: [{ name: 'Oscar Ndugbu', url: siteUrl }],
  creator: 'Oscar Ndugbu',
  keywords: [
    'Full-Stack Engineer',
    'Backend Engineer',
    'Systems Architect',
    'AI Infrastructure',
    'SRE',
    'Principal Engineer',
    'Next.js 15',
    'React Native',
    'Expo SDK 54',
    'TypeScript',
    'Java',
    'Spring Boot',
    'FastAPI',
    'Python',
    'Effect-TS',
    'Turborepo',
    'PostgreSQL',
    'Redis',
    'Fintech',
    'Nigerian fintech',
    'Lagos Engineer',
    'Lagos Nigeria',
    'TaxBridge',
    'SabiScore',
    'NRS DigiTax',
    'Multi-tenant',
    'Audit trail',
    'ML Engineer',
    'Oscar Ndugbu',
    'scardubu',
    'SwarmXQ',
    'AI Agent Orchestration',
    'Ollama',
    'LLM Routing',
    'Staff+ Engineer',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Oscar Ndugbu',
    title: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    description:
      'Staff+ Full-Stack Engineer · built TaxBridge (4h → 15min Nigerian SME tax filing) and SabiScore (ensemble ML inference + zero-drop queues) from Lagos.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Oscar Ndugbu — Principal Full-Stack Engineer, AI Infrastructure & Fintech Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    description:
      'Staff+ Full-Stack Engineer · built TaxBridge (4h → 15min Nigerian SME tax filing) and SabiScore (ensemble ML inference + zero-drop queues) from Lagos.',
    images: ['/api/og'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'scardubu.dev',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  // v13.0: maximumScale — prevents iOS auto-zoom on input focus,
  // which snaps the layout and breaks command palette UX on iPhones.
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
  colorScheme: 'dark',
};

// ── Schema.org @graph ─────────────────────────────────────────────────────────
// v14.0: Consolidated Person + WebSite into a single @graph block.
// @graph is the W3C/Google-recommended pattern for multi-entity structured data.
// @id anchors allow the Knowledge Graph extractor to resolve cross-references
// between entities in a single parse pass (vs two separate @context blocks).
//
// NOTE: Replace `image.url` with a dedicated 400×400 headshot endpoint when
// available — the OG banner (1200×630) is a functional fallback but Google's
// Knowledge Panel crops profile images to a circle; aspect ratio matters.
// ─────────────────────────────────────────────────────────────────────────────
const schemaGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Oscar Ndugbu',
      url: siteUrl,
      jobTitle: 'Principal Full-Stack Engineer',
      description:
        'Principal full-stack engineer based in Lagos, Nigeria. Specialises in backend infrastructure, AI systems, React Native mobile, and SRE. TaxBridge, SabiScore, SwarmXQ.',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': siteUrl,
      },
      image: {
        '@type': 'ImageObject',
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagos',
        addressCountry: 'NG',
      },
      // v14.0: worksFor — disambiguates employment status in recruiter-facing
      // rich results; without it the field is empty in some crawlers' person cards.
      worksFor: {
        '@type': 'Organization',
        name: 'Independent Engineering & Consulting',
      },
      // v14.0: Added 'Systems Architecture' + 'Distributed Systems' —
      // aligns with v13.0 keyword additions; closes the keyword/schema drift.
      knowsAbout: [
        'Next.js',
        'React Native',
        'Expo',
        'TypeScript',
        'Java',
        'AI Agent Orchestration',
        'LLM Routing',
        'SwarmXQ',
        'Spring Boot',
        'FastAPI',
        'Python',
        'Effect-TS',
        'Turborepo',
        'PostgreSQL',
        'Redis',
        'Machine Learning',
        'Fintech',
        'SRE',
        'AI Infrastructure',
        'Systems Architecture',
        'Distributed Systems',
      ],
      alumniOf: [
        {
          '@type': 'Organization',
          name: 'Universal Basic Education Commission (UBEC)',
          url: 'https://ubec.gov.ng',
        },
      ],
      sameAs: [
        'https://github.com/Scardubu',
        'https://linkedin.com/in/oscardubu',
        'https://www.scardubu.dev',
      ],
    },
    {
      // v14.0: WebSite entity — enables Google Sitelinks eligibility.
      // Cross-references Person via @id so Google resolves authorship in one pass.
      '@type': 'WebSite',
      '@id': 'https://www.scardubu.dev/#website',
      name: 'Oscar Ndugbu',
      alternateName: 'scardubu.dev',
      url: 'https://www.scardubu.dev',
      description:
        'Portfolio and operational registry for Oscar Ndugbu — principal full-stack engineer specialising in AI infrastructure, fintech systems, and React Native.',
      inLanguage: 'en-US',
      author: { '@id': 'https://www.scardubu.dev/#person' },
      copyrightHolder: { '@id': 'https://www.scardubu.dev/#person' },
      copyrightYear: new Date().getFullYear(),
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // v14.0: cn() replaces template-literal interpolation — consistent with
    // the cn() adoption on body, and resilient to future conditional font-variable
    // additions (e.g. RTL locale switching, A/B font experiments).
    <html
      lang="en"
      className={cn(syne.variable, dmSans.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark" />

        {/*
          ── Command palette: intercept Cmd+K before React hydrates ─────────
          Runs synchronously inline to capture early keydown events.

          v14.0: Also dispatches CustomEvent('command-palette:open') alongside
          the global flag. React components can now subscribe via addEventListener
          instead of polling window.__commandPaletteRequested at mount time —
          the polling pattern is racy if the keydown fires between module
          evaluation and the first useEffect run.
          The global flag is preserved for backward compatibility.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              window.__commandPaletteRequested = window.__commandPaletteRequested ?? false;
              document.addEventListener('keydown', (event) => {
                if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                  event.preventDefault();
                  window.__commandPaletteRequested = true;
                  document.dispatchEvent(
                    new CustomEvent('command-palette:open', { bubbles: true })
                  );
                }
              }, { capture: true });
            })();`,
          }}
        />

        {/*
          ── Structured data (@graph) ─────────────────────────────────────────
          v14.0: Single @graph block replaces the previous single-entity script.
          Contains Person (#person) + WebSite (#website) with @id cross-references.
        */}
        <script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </head>
      {/*
        cn() wraps a static string here — zero dynamic behavior currently.
        Its value is compositional: any future conditional class (reduced-motion
        override, debug-layout flag, OS font-smoothing variant) slots in cleanly
        without converting a string to a cn() call under pressure.
      */}
      <body className={cn('relative min-h-[100dvh] overflow-x-clip antialiased')}>
        {/*
          ── Cinematic grain noise overlay — pure-black premium base ──────────
          SVG fractalNoise at 0.03 opacity. pointer-events-none + fixed so it
          sits behind every layer (z-0). Paired with tailwind.config `background:
          #000000` override to eliminate any gray base-color residue.

          v14.0: filter ID scoped to `scar-grain-noise` — prevents collision with
          third-party SVG filters injected at runtime (animation libs, icon kits).
        */}
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" aria-hidden="true">
          <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="scar-grain-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#scar-grain-noise)" />
          </svg>
        </div>

        {/* ── Skip navigation — WCAG 2.2 §2.4.1 ──────────────────────── */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        {/*
          ── SVG Glass Refraction filter ────────────────────────────────────
          Inline SVG filter used by LiquidGlassRefractionSVG component.
          Zero layout impact — display:none SVG with filter defs only.

          NOTE (v14.0): `glass-refraction` ID intentionally not renamed here —
          LiquidGlassRefractionSVG references url(#glass-refraction) and cannot
          be patched in this file alone. Coordinated rename to `scar-glass-refraction`
          must update both this definition and that component's url() reference
          in the same commit.
        */}
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <defs>
            <filter id="glass-refraction">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65 0.85"
                numOctaves="3"
                seed="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="3"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <Providers>
          <CursorGlow />
          <ScrollProgress />
          <DeferredThreeBrushField />
          <Navbar />
          <DeferredCommandPalette />
          <PageWrapper>{children}</PageWrapper>
          <Footer />
        </Providers>

        {shouldLoadVercelInsights ? <Analytics /> : null}
        {shouldLoadVercelInsights ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}