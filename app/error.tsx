'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import { CONTACT_EMAIL } from '@/lib/config';
import { useEffect } from 'react';

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    error.message.includes('Loading chunk') ||
    error.message.includes('Failed to fetch dynamically imported module')
  );
}

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorPage]', error);
    }
  }, [error]);

  // Auto-reload once on ChunkLoadError — CDN propagation hiccup.
  useEffect(() => {
    if (!chunkError) return;
    const attempts = parseInt(
      typeof window !== 'undefined'
        ? (window.sessionStorage.getItem('chunk-reload-attempts') ?? '0')
        : '0'
    );
    if (attempts < 1) {
      window.sessionStorage.setItem('chunk-reload-attempts', String(attempts + 1));
      window.location.reload();
    }
  }, [chunkError]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6"
      role="alert"
      aria-live="assertive"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: chunkError
            ? 'radial-gradient(ellipse 55% 45% at 50% 40%, oklch(70% 0.21 188 / 0.05) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 55% 45% at 50% 40%, oklch(60% 0.22 25 / 0.04) 0%, transparent 65%)',
        }}
      />

      <div
        className="glass-surface w-full max-w-sm rounded-[var(--radius-2xl)] p-8 sm:p-10 text-center"
        style={{
          borderTop: `1px solid ${chunkError ? 'oklch(70% 0.21 188 / 0.22)' : 'oklch(60% 0.22 25 / 0.18)'}`,
        }}
      >
        {/* Kicker */}
        <p
          className="font-mono text-[10px] tracking-[0.22em] uppercase mb-5"
          style={{ color: chunkError ? 'var(--color-film-teal)' : 'var(--color-warning)' }}
        >
          {chunkError ? 'Assets updating…' : 'Runtime error'}
        </p>

        {/* Headline */}
        <h2
          className="mb-3 font-display text-2xl font-extrabold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {chunkError ? 'Fetching latest assets.' : 'Something went wrong.'}
        </h2>

        <p
          className="mb-2 font-didone text-sm italic"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {chunkError
            ? "A new deployment landed while you were here — reloading automatically."
            : "An unexpected error occurred. The system logs have it."}
        </p>

        {/* Digest (dev mode / production debugging) */}
        {error.digest && (
          <p
            className="mb-6 font-mono text-[10px] tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Digest: {error.digest}
          </p>
        )}

        <div
          className="my-6 h-px w-full"
          style={{ background: 'var(--color-border-subtle)' }}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={chunkError ? () => window.location.reload() : reset}
          className="cta-primary cta-primary--lg tactile-press w-full"
          style={{ justifyContent: 'center' }}
        >
          {chunkError ? 'Reload page' : 'Try again'}
        </button>

        {/* Fallback email link */}
        {!chunkError && (
          <p
            className="mt-5 font-mono text-[10px] tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Still stuck?{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2 transition-colors hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
