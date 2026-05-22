'use client';

/**
 * CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
 * Major Reset • Lagos → Global • Production Conviction Architecture
 *
 * MotionProvider — LazyMotion wrapper.

 * Global MotionConfig is applied in app/providers.tsx so transition and
 * reduced-motion behavior are managed from a single top-level entrypoint.
 */

import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
