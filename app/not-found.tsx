// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import type { Metadata } from 'next';
import Link from 'next/link';

import { anchorUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: '404 — Page Not Found · Oscar Ndugbu',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6"
      aria-labelledby="not-found-heading"
    >
      {/* Ambient glow behind card */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        // eslint-disable-next-line no-restricted-syntax
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, oklch(70% 0.21 188 / 0.06) 0%, transparent 65%)',
        }}
      />

      <div className="glass-surface w-full max-w-md rounded-[var(--radius-2xl)] border-t border-[oklch(70%_0.21_188_/_0.22)] p-8 text-center sm:p-10">
        {/* Kicker */}
        <p className="text-color-film-teal mb-6 font-mono text-[10px] tracking-[0.25em] uppercase">
          404 · Not Found
        </p>

        {/* Headline — CE spec: "This page doesn't exist. The system does." */}
        <h1
          id="not-found-heading"
          className="font-display text-color-text-primary mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          This page doesn&apos;t exist.{' '}
          <span className="text-color-film-teal">The system does.</span>
        </h1>

        {/* Didone sub-line */}
        <p className="font-didone text-color-text-secondary mb-2 text-base italic sm:text-lg">
          Unlike the systems behind this site, this URL has no uptime record.
        </p>

        {/* Trust signal */}
        <p className="text-color-text-muted mb-8 font-mono text-[10px] tracking-widest uppercase">
          Backend systems · platform reliability · clear recovery paths.
        </p>

        {/* Divider */}
        <div className="bg-color-border-subtle mb-8 h-px w-full" aria-hidden="true" />

        {/* Primary CTA */}
        <Link
          href="/"
          className="cta-primary cta-primary--lg tactile-press w-full justify-center"
          aria-label="Return to Oscar Ndugbu's portfolio homepage"
        >
          <span className="bg-color-success inline-block h-2 w-2 rounded-full" aria-hidden="true" />
          Back to production
        </Link>

        {/* Secondary nav strip */}
        <nav className="mt-6 flex items-center justify-center gap-4" aria-label="Quick navigation">
          {[
            { label: 'Projects', href: anchorUrl('section-projects') },
            { label: 'About', href: anchorUrl('section-about') },
            { label: 'Contact', href: anchorUrl('section-contact') },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-color-text-muted inline-flex min-h-[44px] items-center font-mono text-[11px] tracking-wider uppercase transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer tag */}
      <p className="mt-8 font-mono text-[10px] tracking-wider text-[oklch(93%_0.006_264_/_0.20)] uppercase">
        Lagos precision. Global scale.
      </p>
    </main>
  );
}
