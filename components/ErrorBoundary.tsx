// CONVICTION ENGINE v9.0 — FULL REPLACEMENT
// components/ErrorBoundary.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Class-based React error boundary. Required for all dynamic() import boundaries.
// ABORT-6: Live data without a fallback = blank section = broken conviction.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

interface ErrorBoundaryProps {
  /** Fallback UI to render when an error is caught. */
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    error.message.includes('Loading chunk') ||
    error.message.includes('Failed to fetch dynamically imported module')
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Auto-recover from chunk load failures (CDN propagation hiccup on fresh deploy).
    // sessionStorage guard prevents an infinite reload loop.
    if (isChunkLoadError(error) && typeof window !== 'undefined') {
      const attempts = parseInt(
        window.sessionStorage.getItem('chunk-reload-attempts') ?? '0'
      );
      if (attempts < 1) {
        window.sessionStorage.setItem('chunk-reload-attempts', String(attempts + 1));
        window.location.reload();
        return;
      }
    }

    // Surface errors in development only — never log user-visible errors to console in prod.
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
