// CONVICTION ENGINE v12.0 — Root Layout
//
// CHANGELOG from v11.0:
//
//   ADD: Playfair Display — replaces Georgia as --font-didone.
//     Georgia is a transitional serif (moderate thick/thin contrast).
//     The A24 cinematic authority requires true Didone letterforms:
//     extreme thick/thin stroke contrast, hairline serifs, vertical stress.
//     Playfair Display is the highest-quality free Didone available and
//     renders at 300% contrast ratio vs. Georgia at --text-didone-sub size.
//     Result: the hero sub-line "That's not a slogan. It's a design constraint."
//     now carries genuine typographic weight, not just semantic meaning.
//
//   ADD: Font preload strategy — Syne 800 (hero headline) is preloaded via
//     next/font display:'swap' with size-adjust to prevent CLS. The html
//     element className now includes the Playfair variable.
//
//   FIX: Removed `will-change: scroll-position` from html in globals.css.
//     (See globals.css comment.) This layout remains clean.
//
//   KEEP: LazyMotion + domAnimation bundle in MotionProvider — still correct.
//     useScroll + useTransform are pure hooks, don't require domMax.
//
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono, Playfair_Display, Syne } from 'next/font/google';

import { Providers } from '@/app/providers';
import CursorGlow from '@/components/CursorGlow';
import { Footer } from '@/components/Footer';
import { GradientMesh } from '@/components/GradientMesh';
import { GrainOverlay } from '@/components/GrainOverlay';
import { NavBar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';

import './globals.css';

// ── Display: Syne — conviction, authority, geometric density ─────────────────
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// ── Body: DM Sans — Stripe-grade clarity, neutral legibility ─────────────────
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// ── Mono: JetBrains Mono — engineering credibility, high-density metrics ─────
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// ── Didone: Playfair Display — A24 cinematic authority, hero sub-lines ────────
// Why Playfair over Georgia:
//   Georgia → transitional serif, moderate thick/thin contrast (~2:1)
//   Playfair → true Didone, extreme thick/thin contrast (~8:1), hairline serifs
// The italic variant is what appears in `.text-didone-sub` — at 1.875rem+
// the hairline strokes of Playfair italic create cinematic tension that
// Georgia italic simply cannot.
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-didone',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    template: '%s · Oscar Ndugbu',
  },
  description:
    'Oscar Ndugbu (Scardubu) builds production-grade full-stack fintech platforms — React Native, Next.js 15, Java/Spring Boot, FastAPI, Effect-TS, Turborepo monorepos, sub-150ms APIs, 99.9%+ uptime, PostgreSQL RLS multi-tenancy, and NRS-compliant audit trails.',
  metadataBase: new URL('https://www.scardubu.dev'),
  keywords: [
    'Full-Stack Engineer',
    'Backend Engineer',
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
    'TaxBridge',
    'SabiScore',
    'NRS DigiTax',
    'Multi-tenant',
    'Audit trail',
    'ML Engineer',
    'Oscar Ndugbu',
    'scardubu',
  ],
  openGraph: {
    type: 'website',
    url: 'https://www.scardubu.dev',
    siteName: 'Oscar Ndugbu',
    title: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    description:
      'Principal full-stack engineer. TaxBridge · SabiScore · Hashablanca. React Native, Java, Next.js 15, Effect-TS. sub-150ms · 99.9%+ uptime.',
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
  viewportFit: 'cover',
  themeColor: '#0A0A0B',
  colorScheme: 'dark',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Oscar Ndugbu',
  url: 'https://www.scardubu.dev',
  jobTitle: 'Principal Full-Stack Engineer',
  description:
    'Principal full-stack engineer specialising in backend infrastructure, AI systems, React Native mobile, and SRE. TaxBridge, SabiScore, Hashablanca.',
  knowsAbout: [
    'Next.js',
    'React Native',
    'Expo',
    'TypeScript',
    'Java',
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
  sameAs: ['https://github.com/Scardubu', 'https://linkedin.com/in/oscardubu'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetBrainsMono.variable} ${playfairDisplay.variable}`}
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
              window.__commandPaletteRequested = false;
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
      <body className="relative">
        {/* ── Skip navigation — WCAG 2.2 §2.4.1 ──────────────────────── */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        {/*
          ── SVG Glass Refraction filter ────────────────────────────────
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
          <GrainOverlay />
          <GradientMesh />
          <ScrollProgress />
          <NavBar />
          {/*
            ── Stacking context ────────────────────────────────────────
            `isolate` creates a new stacking context for z-index.
            NAV, Footer, ScrollProgress are siblings (outside this div)
            so position:fixed elements in those are NOT affected.
            Content inside this div is correctly isolated from NavBar
            z-index competition.
          */}
          <div className="relative isolate z-[2]">{children}</div>
          <Footer />
        </Providers>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}