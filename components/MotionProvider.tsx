'use client';

/**
 * CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
 * Major Reset • Lagos → Global • Production Conviction Architecture
 *
 * MotionProvider — LazyMotion wrapper.

 * Global MotionConfig is applied in app/providers.tsx so transition and
 * reduced-motion behavior are managed from a single top-level entrypoint.
 */

import { LazyMotion } from 'framer-motion';
import type { ReactNode } from 'react';

let featurePromise: Promise<typeof import('./motion-features').default> | null = null;

const waitForCriticalMobilePaint = async () => {
  if (typeof window === 'undefined' || !window.matchMedia('(max-width: 767px)').matches) return;

  await new Promise<void>((resolve) => {
    const schedule = () => window.setTimeout(resolve, 4000);
    if (document.readyState === 'complete') {
      schedule();
      return;
    }
    window.addEventListener('load', schedule, { once: true });
  });
};

const loadFeatures = () => {
  featurePromise ??= waitForCriticalMobilePaint().then(() =>
    import('./motion-features').then((module) => module.default)
  );
  return featurePromise;
};

export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
