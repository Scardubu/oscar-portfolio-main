import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google';

import { Providers } from '@/app/providers';
import { DeferredCursorGlow } from '@/components/DeferredCursorGlow';
import { DeferredCommandPalette } from '@/components/DeferredCommandPalette';
import { Footer } from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { ScrollProgress } from '@/components/ScrollProgress';
import { WebVitals } from '@/components/WebVitals';
import { DeferredThreeBrushField } from '@/components/cinematic/DeferredThreeBrushField';
import { PROFILE } from '@/lib/portfolio-data';
import { cn } from '@/lib/utils';

import './globals.css';
import './fixes.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  // The hero H1 is the mobile LCP element. Keep the first paint on the
  // metrically compatible fallback during a constrained cold load. Because the
  // face is optional, preloading it only competes with render-blocking CSS.
  display: 'optional',
  preload: false,
  fallback: ['Avenir Next', 'Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  // The hero body can also become the mobile LCP candidate. `optional` avoids
  // a late repaint, while disabling preload keeps this non-essential face from
  // competing with critical CSS and application chunks before first paint.
  display: 'optional',
  preload: false,
  fallback: ['Inter', 'Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  // The mono hero kicker sits directly above the mobile LCP heading. A late
  // `swap` can change its metrics, shift the heading, and register a new LCP
  // paint several seconds after first content. Keep the constrained cold-load
  // layout on the fallback just like the other optional brand faces.
  display: 'optional',
  preload: false,
  fallback: ['Fira Code', 'Cascadia Code', 'Consolas', 'Menlo', 'monospace'],
});

const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3000');

const shouldLoadVercelInsights = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
const siteTitle = `${PROFILE.name} — ${PROFILE.role} · AI Infrastructure · Fintech Systems`;
const siteDescription =
  'Staff backend and platform engineer in Lagos. Decision records across fintech workflows, ensemble ML inference, resilient queues, and AI infrastructure. Systems that hold at 2am.';
const socialDescription =
  'Staff Backend and Platform Engineer building reliability-first AI, fintech, and infrastructure systems from Lagos.';
const socialImagePath = '/og';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s · ${PROFILE.name}`,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  authors: [{ name: PROFILE.name, url: siteUrl }],
  creator: PROFILE.name,
  keywords: [
    'Staff Backend Engineer',
    'Platform Engineer',
    'Backend Engineer',
    'Full-Stack Engineer',
    'Systems Architect',
    'AI Infrastructure',
    'SRE',
    'Staff Engineer',
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
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: PROFILE.name,
    title: siteTitle,
    description: socialDescription,
    images: [
      {
        url: socialImagePath,
        width: 1200,
        height: 630,
        alt: `${PROFILE.name} — ${PROFILE.role}, AI Infrastructure & Fintech Systems`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: socialDescription,
    images: [socialImagePath],
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
  viewportFit: 'cover',
  themeColor: '#000000',
  colorScheme: 'dark',
};

const schemaGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: PROFILE.name,
      url: siteUrl,
      jobTitle: PROFILE.role,
      description:
        'Staff backend and platform engineer based in Lagos, Nigeria. Specialises in backend infrastructure, AI systems, production reliability, React Native, and SRE.',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': siteUrl,
      },
      image: {
        '@type': 'ImageObject',
        url: `${siteUrl}${socialImagePath}`,
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
        'Platform Engineering',
        'Backend Systems',
        'AI Infrastructure',
        'Reliability Engineering',
        'PostgreSQL',
        'Redis',
        'FastAPI',
        'Fintech Systems',
      ],
      sameAs: [
        'https://github.com/Scardubu',
        'https://www.linkedin.com/in/oscardubu',
        'https://twitter.com/oscardubu',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteTitle,
      description: siteDescription,
      publisher: {
        '@id': `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(syne.variable, dmSans.variable, jetbrainsMono.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </head>
      <body className="font-body min-h-screen bg-black text-white antialiased">
        <Providers>
          <DeferredThreeBrushField />
          <Navbar />
          <ScrollProgress />
          <PageWrapper>{children}</PageWrapper>
          <Footer />
          <DeferredCommandPalette />
          <DeferredCursorGlow />
          <WebVitals />
          {shouldLoadVercelInsights ? (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          ) : null}
        </Providers>
      </body>
    </html>
  );
}
