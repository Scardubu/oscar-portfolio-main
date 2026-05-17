// CONVICTION ENGINE v3.0 — 404 Not Found
//
// v3.0 vs v2.0:
//   [FIX P3-C]: Headline now matches CE spec exactly.
//     Previous: "This page doesn't exist." (CE spec requires "The system does." appended)
//     Updated:  "This page doesn't exist. The system does."
//     Principle: CE microcopy spec — the 404 is the one place the portfolio's
//     reliability thesis should show up even in its absence state.
//   [FIX P3-C]: Sub-line tightened to remove the uptime self-reference ("99.9%+ promise").
//     Replacing it with the CE spec assurance line to close the loop without
//     the site appearing to be boasting about its own uptime on its own error page.
//   KEEP: glass card, film-teal CTA, mono kicker, ambient glow, nav strip,
//     Lagos footer tag, all design tokens, all motion classes, focus states.

import type { Metadata } from 'next';
import Link from 'next/link';

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
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, oklch(70% 0.21 188 / 0.06) 0%, transparent 65%)',
        }}
      />

      <div
        className="glass-surface w-full max-w-md rounded-[var(--radius-2xl)] p-8 sm:p-10 text-center"
        style={{ borderTop: '1px solid oklch(70% 0.21 188 / 0.22)' }}
      >
        {/* Kicker */}
        <p
          className="font-mono text-[10px] tracking-[0.25em] uppercase mb-6"
          style={{ color: 'var(--color-film-teal)' }}
        >
          404 · Not Found
        </p>

        {/* Headline — CE spec: "This page doesn't exist. The system does." */}
        <h1
          id="not-found-heading"
          className="mb-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: 'var(--color-text-primary)' }}
        >
          This page doesn&apos;t exist.{' '}
          <span style={{ color: 'var(--color-film-teal)' }}>
            The system does.
          </span>
        </h1>

        {/* Didone sub-line */}
        <p
          className="mb-2 font-didone text-base italic sm:text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Unlike the systems behind this site, this URL has no uptime record.
        </p>

        {/* Trust signal */}
        <p
          className="mb-8 font-mono text-[10px] tracking-widest uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Response within 24h · Zero data-loss record · Shipped from Lagos.
        </p>

        {/* Divider */}
        <div
          className="mb-8 h-px w-full"
          style={{ background: 'var(--color-border-subtle)' }}
          aria-hidden="true"
        />

        {/* Primary CTA */}
        <Link
          href="/"
          className="cta-primary cta-primary--lg tactile-press w-full justify-center"
          aria-label="Return to Oscar Ndugbu's portfolio homepage"
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: 'var(--color-success)' }}
            aria-hidden="true"
          />
          Back to production
        </Link>

        {/* Secondary nav strip */}
        <nav
          className="mt-6 flex items-center justify-center gap-4"
          aria-label="Quick navigation"
        >
          {[
            { label: 'Projects', href: '/#section-projects' },
            { label: 'About',    href: '/#section-about'    },
            { label: 'Contact',  href: '/#section-contact'  },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-[11px] tracking-wider uppercase transition-colors hover:text-white"
              style={{
                color: 'var(--color-text-muted)',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer tag */}
      <p
        className="mt-8 font-mono text-[10px] tracking-wider uppercase"
        style={{ color: 'oklch(93% 0.006 264 / 0.20)' }}
      >
        Lagos precision. Global scale.
      </p>
    </main>
  );
}