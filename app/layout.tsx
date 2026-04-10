import type { Metadata, Viewport } from 'next';
import { Crimson_Pro, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { GradientMesh } from '@/components/GradientMesh';
import { GrainOverlay } from '@/components/GrainOverlay';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Providers } from '@/app/providers';

import './globals.css';

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson-pro',
  display: 'swap',
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Oscar Ndugbu (Scardubu) — Staff Full-Stack ML Engineer',
    template: '%s · Oscar Ndugbu (Scardubu)',
  },
  description:
    'Oscar Ndugbu (Scardubu) builds production AI and fintech systems where platform reliability, model behavior, and product clarity must hold simultaneously.',
  metadataBase: new URL('https://www.scardubu.dev'),
  openGraph: {
    type: 'website',
    url: 'https://www.scardubu.dev',
    siteName: 'Oscar Ndugbu (Scardubu)',
    title: 'Oscar Ndugbu (Scardubu) — Staff Full-Stack ML Engineer',
    description: 'Production AI/fintech engineer. SabiScore · Hashablanca · TaxBridge.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Oscar Ndugbu (Scardubu) portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oscar Ndugbu (Scardubu) — Staff Full-Stack ML Engineer',
    images: ['/api/og'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.scardubu.dev' },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Oscar Ndugbu (Scardubu)',
  url: 'https://www.scardubu.dev',
  jobTitle: 'Staff Full-Stack ML Engineer',
  description: 'Production AI/fintech systems engineer. SabiScore, Hashablanca, TaxBridge.',
  sameAs: ['https://github.com/Scardubu', 'https://linkedin.com/in/oscardubu'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${crimsonPro.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="relative isolate">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
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
          <GrainOverlay />
          <GradientMesh />
          <ScrollProgress />
          <div className="relative z-[2]">{children}</div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
