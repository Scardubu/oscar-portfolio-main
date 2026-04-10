'use client';

/**
 * MotionProvider — LazyMotion wrapper using domAnimation feature set.
 * Reduces framer-motion first-load bundle by ~35 kB vs the full motion bundle.
 * All child components must use `m.X` (from framer-motion) not `motion.X`.
 */

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
