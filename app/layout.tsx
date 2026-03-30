import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MotionProvider } from '@/components/MotionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const syne = localFont({
  src: './fonts/syne-local.ttf',
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = localFont({
  src: './fonts/dm-sans-local.ttf',
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: './fonts/jetbrains-mono-local.ttf',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Oscar Scardubu \u2014 Staff Full-Stack ML Engineer',
    template: '%s \u00b7 Oscar Scardubu',
  },
  description:
    'Production AI/fintech systems \u2014 credit scoring, blockchain analytics, ML consulting. ' +
    'Open to Staff+ roles, co-founder partnerships, and ML consulting engagements.',
  metadataBase: new URL('https://www.scardubu.dev'),
  openGraph: {
    type: 'website',
    url: 'https://www.scardubu.dev',
    siteName: 'Oscar Scardubu',
    title: 'Oscar Scardubu \u2014 Staff Full-Stack ML Engineer',
    description:
      'Production AI/fintech engineer. SabiScore \u00b7 Hashablanca \u00b7 ML Consulting.',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'Oscar Scardubu portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oscar Scardubu \u2014 Staff Full-Stack ML Engineer',
    images: ['/og'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.scardubu.dev' },
};

const themeScript = `try { const stored = localStorage.getItem('theme'); const media = window.matchMedia('(prefers-color-scheme: light)'); const resolved = stored === 'light' || stored === 'dark' ? stored : (media.matches ? 'light' : 'dark'); document.documentElement.setAttribute('data-theme', resolved); } catch { document.documentElement.setAttribute('data-theme', 'dark'); }`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Oscar Scardubu',
  url: 'https://www.scardubu.dev',
  jobTitle: 'Staff Full-Stack ML Engineer',
  description:
    'Production AI and fintech systems engineer focused on delivery, reliability, and product clarity.',
  sameAs: ['https://github.com/Scardubu', 'https://linkedin.com/in/oscardubu'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        {/* Skip navigation — first focusable element per WCAG 2.4.1 */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        {/* SVG glass-refraction displacement filter — zero layout cost */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
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

        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
