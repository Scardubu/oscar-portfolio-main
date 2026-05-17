'use client';

/**
 * MotionProvider — CONVICTION ENGINE v20.0
 * LazyMotion + MotionConfig wrapper.
 *
 * reducedMotion="user": MotionConfig reads prefers-reduced-motion from OS and
 * disables all animations when set. This means every m.* element in the tree
 * is automatically protected — no per-component reducedMotion guards needed
 * for the animation itself (they're still needed for conditional rendering).
 *
 * defaultTransition: sets the global spring default so components that don't
 * specify a transition still get spring physics instead of linear easing.
 *
 * v20 FIX: stiffness raised from 300 → 340 to meet CE Motion Contract §V floor.
 * Range: stiffness 340–440, damping 24–32. Prior value (300) produced marginally
 * sluggish snaps on fast CTA interactions. Feel is imperceptibly crisper.
 */

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

const DEFAULT_TRANSITION = {
  type:      'spring',
  stiffness: 340, // CE Motion Contract §V floor — range: 340–440
  damping:   25,  // within spec range 24–32
  mass:      0.9,
} as const;

export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={DEFAULT_TRANSITION}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}