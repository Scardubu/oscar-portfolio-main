// CONVICTION ENGINE v20.0 — Root Layout
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
//   KEEP: Playfair Display — true Didone, hairline strokes, A24 cinematic
//     authority. The `--font-didone` CSS var is consumed by globals.css.
//
//   KEEP: LazyMotion + domAnimation in MotionProvider (providers.tsx).
//     useScroll / useTransform are hooks, domMax is not needed.
//
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono, Playfair_Display, Syne } from 'next/font/google';

import { Providers } from '@/app/providers';
import CursorGlow from '@/components/CursorGlow';
import { CommandPalette } from '@/components/CommandPalette';
import { Footer } from '@/components/Footer';
import { GradientMesh } from '@/components/GradientMesh';
import { GrainOverlay } from '@/components/GrainOverlay';
import Navbar from '@/components/Navbar';
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
    'Staff+ Full-Stack · Infra · ML Engineer based in Lagos, Nigeria. TaxBridge cut Nigerian SME tax filing from 4h to 15min. SabiScore holds 99.9%+ uptime across a 90-day Prometheus window. SwarmXQ orchestrates self-improving AI agents with zero cloud dependency. Production systems that stay alive when it matters most.',
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
    description:
      'Principal full-stack engineer, Lagos. TaxBridge · SabiScore · SwarmXQ. React Native, Java, Next.js 15, Effect-TS. sub-150ms · 99.9%+ uptime.',
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
          <Navbar />
          <CommandPalette />
          {/*
            ── Stacking context ────────────────────────────────────────
            `isolate` creates a new stacking context for z-index.
            NavBar, Footer, ScrollProgress are siblings (outside this div)
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