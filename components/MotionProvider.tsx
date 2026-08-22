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

const loadFeatures = () => import('./motion-features').then((module) => module.default);

export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
