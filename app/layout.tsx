import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Footer } from '@/components/Footer';
import { GradientMesh } from '@/components/GradientMesh';
import { GrainOverlay } from '@/components/GrainOverlay';
import { NavBar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Providers } from '@/app/providers';
import CursorGlow from '@/components/CursorGlow';

import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default:
      'Oscar Ndugbu — Fullstack Engineer · AI Infrastructure · SRE Systems',
    template: '%s · Oscar Ndugbu',
  },
  description:
    'Oscar Ndugbu (Scardubu) builds fullstack fintech systems that stay fast, compliant, and reliable in production — sub-150ms APIs, 99.9%+ uptime, NRS-compliant audit trails.',
  metadataBase: new URL('https://www.scardubu.dev'),
  openGraph: {
    type: 'website',
    url: 'https://www.scardubu.dev',
    siteName: 'Oscar Ndugbu',
    title:
      'Oscar Ndugbu — Fullstack Engineer · AI Infrastructure · SRE Systems',
    description:
      'Fullstack systems engineer. TaxBridge · SabiScore · Hashablanca. sub-150ms · 99.9%+ uptime.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Oscar Ndugbu portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Oscar Ndugbu — Fullstack Engineer · AI Infrastructure · SRE Systems',
    images: ['/api/og'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.scardubu.dev' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0B',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Oscar Ndugbu',
  url: 'https://www.scardubu.dev',
  jobTitle: 'Fullstack Engineer',
  description:
    'Fullstack engineer specialising in infrastructure, SRE, and AI systems. TaxBridge, SabiScore, Hashablanca.',
  sameAs: ['https://github.com/Scardubu', 'https://linkedin.com/in/oscardubu'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
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
          id="json-ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="relative">
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
          <CursorGlow />
          <GrainOverlay />
          <GradientMesh />
          <ScrollProgress />
          <NavBar />
          <div className="relative z-[2]">{children}</div>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
