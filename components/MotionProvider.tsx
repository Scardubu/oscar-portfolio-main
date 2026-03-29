'use client';

/**
 * MotionProvider — LazyMotion wrapper using domAnimation feature set.
 * Reduces framer-motion first-load bundle by ~35 kB vs the full motion bundle.
 * All child components must use `m.X` (from framer-motion) not `motion.X`.
 */

import { LazyMotion, domAnimation } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
