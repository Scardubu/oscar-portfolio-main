// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// CHANGELOG from v12.0:
//
//   FIX: JSON-LD Person schema — added `address` block with addressLocality:
//     'Lagos', addressCountry: 'NG'. Omitting location from structured data
//     on a portfolio that references Lagos in copy creates a schema/content
//     mismatch that hurts local SEO signals. Engineers verifying technical
//     competence also expect consistent data across the page and its metadata.
//
//   FIX: `keywords` — added 'Lagos Nigeria', 'Lagos Engineer'. These are
//     non-zero search volume terms for engineering recruitment in West Africa
//     and among diaspora-sourcing teams at global companies.
//
//   FIX: `description` — explicitly names Lagos. Google's rich-result
//     extractor uses the description as fallback location context for Person
//     entities when the structured data address is ambiguous.
//
//   NOTE: Didone + mono families now rely on local fallback stacks in CSS.
//     This keeps production builds resilient when remote font fetches timeout
//     and reduces critical font payload for hero-first rendering.
//
//   KEEP: LazyMotion + domAnimation in MotionProvider (providers.tsx).
//     useScroll / useTransform are hooks, domMax is not needed.
//
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Syne } from 'next/font/google';

import { Providers } from '@/app/providers';
import CursorGlow from '@/components/CursorGlow';
import { DeferredCommandPalette } from '@/components/DeferredCommandPalette';
import { Footer } from '@/components/Footer';
import { PageWrapper } from '@/components/PageWrapper';

import { GrainOverlay } from '@/components/GrainOverlay';
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
    'Staff+ Full-Stack Engineer in Lagos. TaxBridge: 4h→15min filing. SabiScore: 99.9%+ uptime. SwarmXQ: self-improving agents. Systems that hold at 2am.',
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
    url: 'https://www.scardubu.dev',
    siteName: 'Oscar Ndugbu',
    title: 'Oscar Ndugbu — Principal Full-Stack Engineer · AI Infrastructure · Fintech Systems',
    // CE spec §P3-G og:description exact wording
    description:
      'Staff+ Full-Stack Engineer · built TaxBridge (4h → 15min Nigerian SME tax filing) and SabiScore (99.9%+ uptime) from Lagos.',
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
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
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
      <body className="relative min-h-[100dvh] overflow-x-clip">
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
          <GrainOverlay />
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
