'use client';

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
    <div
      className="flex min-h-screen items-center justify-center px-6"
      role="alert"
    >
      <div className="max-w-sm w-full text-center space-y-5">
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--color-film-teal)' }}
        >
          {chunkError ? 'Fetching latest assets…' : 'Something went wrong'}
        </h2>

        <p
          className="text-base leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {chunkError
            ? 'A resource failed to load. Reloading automatically — or tap below.'
            : 'An error occurred while loading this page.'}
        </p>

        <button
          type="button"
          onClick={chunkError ? () => window.location.reload() : reset}
          className="
            inline-flex w-full min-h-[48px] items-center justify-center
            rounded-full font-mono text-xs font-semibold tracking-wider uppercase
            transition active:scale-[0.98]
          "
          style={{
            background: 'var(--color-film-teal)',
            color:      'var(--color-bg)',
          }}
        >
          {chunkError ? 'Reload page' : 'Try again'}
        </button>
      </div>
    </div>
  );
}