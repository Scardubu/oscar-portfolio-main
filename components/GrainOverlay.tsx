'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// v2.1 FIX: Hydration mismatch resolved.
//
// Previous version initialised `coarse` as `true` (assume mobile) on the server
// and then updated it in useEffect after hydration. React 19 treats any
// SSR → client opacity difference as a hydration error (#419 minified).
//
// Fix: Mount with `mounted: false` → render nothing on the server.
// After hydration fires useEffect, read the real media query and render the
// correct opacity. The element is purely decorative — the 1-frame delay is
// invisible to users.

import { useEffect, useState } from 'react';

export function GrainOverlay() {
  const [mounted, setMounted] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    setCoarse(mq.matches);
    setMounted(true);

    const handler = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Do not render on server — avoids hydration mismatch in React 19.
  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1]"
      // eslint-disable-next-line no-restricted-syntax
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: coarse ? 0.03 : 0.052,
        mixBlendMode: 'soft-light',
      }}
    />
  );
}
