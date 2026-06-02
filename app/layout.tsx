// ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// ─────────────────────────────────────────────────────────────────────────────
// CHANGELOG v14.1 (Site URL + Production Hardening)
// ─────────────────────────────────────────────────────────────────────────────
//
//   UPGRADE: Introduced `NEXT_PUBLIC_SITE_URL` for robust canonical URL management
//     across local, preview, and production environments. Replaces hardcoded
//     domain references. Follows Vercel + Next.js best practices.
//
//   UPGRADE: `metadataBase`, `openGraph.url`, `alternates.canonical`, and all
//     JSON-LD `@id` / `url` fields now use dynamic `siteUrl`.
//
//   MAINTAINED: All v14.0 improvements (twitter:description, scoped SVG filters,
//     consolidated @graph schema, command palette enhancement, etc.)
//
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
import Navbar from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { ScrollProgress } from '@/components/ScrollProgress';
import { DeferredThreeBrushField } from '@/components/cinematic/DeferredThreeBrushField';

// v2026.9: import order corrected — globals.css first, fixes.css second (overrides)
import './fixes.css';
import './globals.css';

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
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['Fira Code', 'Cascadia Code', 'Consolas', 'Menlo', 'monospace'],
});

// ── Site URL Configuration (Production Grade) ────────────────────────────────
// Priority: NEXT_PUBLIC_SITE_URL → Vercel URL → localhost fallback
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
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
  // CE spec §P3-G: ≤160 chars, outcome-focused
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
    // creator: '@scardubu', // add once X/Twitter handle is confirmed
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
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
  colorScheme: 'dark',
};

// ── Schema.org @graph ─────────────────────────────────────────────────────────
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
      worksFor: {
        '@type': 'Organization',
        name: 'Independent Engineering & Consulting',
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
      sameAs: ['https://github.com/Scardubu', 'https://linkedin.com/in/oscardubu', siteUrl],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'Oscar Ndugbu',
      alternateName: 'scardubu.dev',
      url: siteUrl,
      description:
        'Portfolio and operational registry for Oscar Ndugbu — principal full-stack engineer specialising in AI infrastructure, fintech systems, and React Native.',
      inLanguage: 'en-US',
      author: { '@id': `${siteUrl}/#person` },
      copyrightHolder: { '@id': `${siteUrl}/#person` },
      copyrightYear: new Date().getFullYear(),
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(syne.variable, dmSans.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark" />

        {/* Command palette early key intercept */}
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

        {/* Structured Data */}
        <script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </head>

      <body className={cn('relative min-h-[100dvh] overflow-x-clip antialiased')}>
        {/* Grain Noise Overlay */}
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

        {/* Skip Navigation */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        {/* Global SVG Defs — glass refraction, squircle clip path, cinematic portrait filter */}
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <defs>
            {/* Glass refraction for LiquidGlassRefractionSVG */}
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
            {/* Squircle (n≈4 superellipse) clip path shared by all IdentityCard instances */}
            <clipPath id="squircle-id" clipPathUnits="objectBoundingBox">
              <path d="M 0.500 0.000 C 0.817 0.000 0.870 0.030 0.920 0.080 C 0.977 0.136 1.000 0.183 1.000 0.500 C 1.000 0.817 0.977 0.864 0.920 0.920 C 0.870 0.970 0.817 1.000 0.500 1.000 C 0.183 1.000 0.130 0.970 0.080 0.920 C 0.023 0.864 0.000 0.817 0.000 0.500 C 0.000 0.183 0.023 0.136 0.080 0.080 C 0.130 0.030 0.183 0.000 0.500 0.000 Z" />
            </clipPath>
            {/*
              Cinematic duotone portrait filter — IdentityCard headshot
              Maps luminance to teal shadows (#031c24) / amber highlights (#ff9540),
              then composites 15% of the original image back for texture retention.
              Correction from inline version:
                - feBlend mode="normal" in="SourceGraphic" over duotone was a no-op
                  (opaque SourceGraphic fully covered the duotone layer).
                - opacity="0.85" on feBlend is not a valid SVG filter attribute.
              Fixed approach: feComposite operator="over" places a 15%-opacity
              SourceGraphic over the duotone, yielding 85% duotone + 15% original.
            */}
            <filter id="luxury-duotone-cinema" colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0.2126 0.7152 0.0722 0 0
                        0.2126 0.7152 0.0722 0 0
                        0.2126 0.7152 0.0722 0 0
                        0      0      0      1 0"
                result="grayscale"
              />
              <feComponentTransfer in="grayscale" result="duotone">
                <feFuncR type="table" tableValues="0.0118 1.0000" />
                <feFuncG type="table" tableValues="0.1098 0.5843" />
                <feFuncB type="table" tableValues="0.1412 0.2510" />
              </feComponentTransfer>
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 0.15 0"
                in="SourceGraphic"
                result="faint-original"
              />
              <feComposite operator="over" in="faint-original" in2="duotone" />
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
