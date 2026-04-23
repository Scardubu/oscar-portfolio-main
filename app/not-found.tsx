import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      aria-labelledby="not-found-heading"
    >
      <p className="label mb-6 origin-center">404</p>

      <h1 id="not-found-heading" className="gradient-text mb-4 text-4xl font-bold sm:text-5xl">
        This page doesn&apos;t exist.
      </h1>

      <p className="mb-10 max-w-[44ch] text-base leading-relaxed text-(--color-text-secondary)">
        Unlike the systems I build, this URL has no uptime guarantee.
      </p>

      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-(--radius-md) bg-(--color-accent) px-6 py-3.5 font-mono text-xs font-semibold tracking-wider text-white uppercase shadow-[0_0_20px_var(--color-accent-glow)] transition hover:bg-(--color-accent-hover)"
      >
        Back to production
      </Link>
    </main>
  );
}
