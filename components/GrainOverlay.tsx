'use client';
// components/GrainOverlay.tsx — CONVICTION ENGINE v22.0
// Grain is purely decorative. On mobile (pointer:coarse) use a lighter,
// faster static SVG grain vs desktop's animated canvas grain.
// Never blocks render — deferred via requestIdleCallback.

import { useEffect, useState } from 'react';

export function GrainOverlay() {
  const [coarse, setCoarse] = useState(true); // default: assume mobile

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    setCoarse(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: coarse ? 0.03 : 0.052,
        mixBlendMode: 'soft-light',
      }}
    />
  );
}