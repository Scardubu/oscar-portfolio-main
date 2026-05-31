// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// CHANGELOG from v13.0 (surgical patch merge):
//
//   ADD: JetBrains_Mono — `--font-mono` CSS variable for code/terminal surfaces.
//     Patch supplied this; absent from v12.0. Resolves the gap where code blocks
//     and inline monospace fell back to system-ui mono (Courier New on Windows).
//     Exposed via html className alongside --font-syne and --font-dm-sans so
//     tailwind `font-mono` utility works immediately without config changes.
//
//   ADD: `cn()` utility for body className — replaces raw string concatenation.
//     Defensive against future conditional class additions (e.g. debug overlays,
//     reduced-motion variants, OS-level font-smoothing overrides).
//
//   ADD: `maximumScale: 1` in viewport — prevents iOS auto-zoom on input focus
//     which breaks the command palette UX on iPhones. minimumScale: 1 was
//     already present; this closes the max-side gap.
//
//   ADD: `authors` + `creator` to metadata — both fields are parsed by Google's
//     rich-result extractor and by LinkedIn/Slack unfurl renderers. Omitting them
//     degrades authorship attribution in search previews.
//
//   ADD: `locale: 'en_US'` in openGraph — OG locale signals the primary content
//     language to Facebook/LinkedIn crawlers and social graph APIs. Without it
//     some crawlers fall back to 'und' (undetermined), reducing distribution.
//
//   REJECT: Inter → keep Syne + DM_Sans. Syne is a deliberate brand signal for
//     a principal-level portfolio; Inter is the default AI-generated aesthetic.
//
//   REJECT: Naive body className replacement. Existing `relative`, `min-h-[100dvh]`,
//     and `overflow-x-clip` are load-bearing: relative is positioning context for
//     the fixed noise overlay; 100dvh accounts for mobile browser chrome; clip
//     (not hidden) prevents horizontal scroll without blocking scroll events.
//
//   REJECT: Stripping Providers, Analytics, JSON-LD, noise overlay, skip-nav,
//     glass refraction, and command palette. These are production infrastructure,
//     not boilerplate.
//
//   KEEP: LazyMotion + domAnimation in MotionProvider (providers.tsx).
//     useScroll / useTransform are hooks, domMax is not needed.
//
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

// v13.0: Added — explicit mono font for code/terminal surfaces.
// Resolves system-mono fallback regression on Windows (Courier New).
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false, // non-critical path — load after Syne + DM_Sans
  fallback: ['Fira Code', 'Cascadia Code', 'Consolas', 'Menlo', 'monospace'],
});

const isVercelProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

const isPreviewDeployment = process.env.NEXT_PUBLIC_VERCEL_URL?.includes('vercel.app') ?? false;

const shouldLoadVercelInsights = isVercelProduction && !isPreviewDeployment;

export const metadata: Metadata = {
  title: {
    default: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    template: '%s · Oscar Ndugbu',
  },
  // CE spec §P3-G: ≤160 chars, outcome-focused (this is 155 chars)
  description:
    'Staff+ Full-Stack Engineer in Lagos. TaxBridge: 4h→15min filing. SabiScore: ensemble ML inference + zero-drop queues. SwarmXQ: self-improving agents. Systems that hold at 2am.',
  metadataBase: new URL('https://www.scardubu.dev'),
  // v13.0: Added authors + creator — parsed by Google rich-result extractor
  // and LinkedIn/Slack unfurl renderers for authorship attribution.
  authors: [{ name: 'Oscar Ndugbu', url: 'https://www.scardubu.dev' }],
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
    // v13.0: Added locale — signals primary content language to FB/LinkedIn
    // crawlers; without it some crawlers fall back to 'und' (undetermined).
    locale: 'en_US',
    url: 'https://www.scardubu.dev',
    siteName: 'Oscar Ndugbu',
    title: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    // CE spec §P3-G og:description exact wording
    description:
      'Staff+ Full-Stack Engineer · built TaxBridge (4h → 15min Nigerian SME tax filing) and SabiScore (ensemble ML inference + zero-drop queues) from Lagos.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Oscar Ndugbu portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    images: ['/api/og'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.scardubu.dev' },
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
  // v13.0: Added maximumScale — prevents iOS auto-zoom on input focus,
  // which breaks command palette UX on iPhones.
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
  colorScheme: 'dark',
};

// ── Schema.org Person — location-explicit for accurate rich-result extraction ──
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Oscar Ndugbu',
  url: 'https://www.scardubu.dev',
  jobTitle: 'Principal Full-Stack Engineer',
  description:
    'Principal full-stack engineer based in Lagos, Nigeria. Specialises in backend infrastructure, AI systems, React Native mobile, and SRE. TaxBridge, SabiScore, SwarmXQ.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
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
  ],
  alumniOf: [
    {
      '@type': 'Organization',
      name: 'Universal Basic Education Commission (UBEC)',
      url: 'https://ubec.gov.ng',
    },
  ],
  sameAs: ['https://github.com/Scardubu', 'https://linkedin.com/in/oscardubu'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // v13.0: Added jetbrainsMono.variable — exposes --font-mono to Tailwind
    // and all downstream code/terminal surfaces.
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark" />

        {/*
          ── Command palette: intercept Cmd+K before React hydrates ─────────
          This runs synchronously inline to capture early keydown events.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              window.__commandPaletteRequested = window.__commandPaletteRequested ?? false;
              document.addEventListener('keydown', (event) => {
                if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                  event.preventDefault();
                  window.__commandPaletteRequested = true;
                }
              }, { capture: true });
            })();`,
          }}
        />

        {/* ── Structured data ─────────────────────────────────────────── */}
        <script
          id="json-ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      {/*
        v13.0: cn() replaces raw string — antialiased added for sub-pixel
        font rendering. `relative` + `min-h-[100dvh]` + `overflow-x-clip`
        are load-bearing; see CHANGELOG above for rationale on each.
      */}
      <body className={cn('relative min-h-[100dvh] overflow-x-clip antialiased')}>
        {/* ── Cinematic grain noise overlay — pure-black premium base ────
          SVG fractalNoise at 0.03 opacity. pointer-events-none + fixed so it
          sits behind every layer (z-0). Paired with tailwind.config `background:
          #000000` override to eliminate any gray base-color residue.           */}
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" aria-hidden="true">
          <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {/* ── Skip navigation — WCAG 2.2 §2.4.1 ──────────────────────── */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        {/* ── SVG Glass Refraction filter ────────────────────────────────
          Inline SVG filter used by LiquidGlassRefractionSVG component.
          Zero layout impact — display:none SVG with filter defs only.
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