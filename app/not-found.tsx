import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:  '404 — Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      aria-labelledby="not-found-heading"
    >
      <p
        className="font-mono text-[11px] tracking-[0.25em] uppercase mb-6"
        style={{ color: 'var(--color-text-muted)' }}
      >
        404
      </p>

      <h1
        id="not-found-heading"
        className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: 'var(--color-text-primary)' }}
      >
        This page doesn&apos;t exist.
      </h1>

      <p
        className="mb-10 max-w-[44ch] text-base leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Unlike the systems I build, this URL has no uptime guarantee.
      </p>

      <Link
        href="/"
        className="
          inline-flex min-h-[44px] items-center justify-center
          rounded-full px-7 py-3
          font-mono text-xs font-semibold tracking-wider uppercase
          transition
        "
        style={{
          background:    'var(--color-accent)',
          color:         '#fff',
          boxShadow:     '0 0 20px var(--color-accent-glow)',
        }}
      >
        Back to production
      </Link>
    </main>
  );
}