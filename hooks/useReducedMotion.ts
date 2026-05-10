'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Drop-in boolean: true when OS/browser prefers reduced motion. */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

export function useMotionSafe() {
  const reduced = useReducedMotion();
  return {
    reduced,
    safeVariants: <T>(full: T, fallback: T): T => (reduced ? fallback : full),
  };
}

/**
 * useDeviceMotionTier
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns a tiered animation budget based on device capability:
 *
 *   'minimal'  — prefers-reduced-motion: reduce  OR  pointer:coarse + low-end
 *   'standard' — pointer:coarse (touch device, no reduced-motion flag)
 *   'full'     — pointer:fine (desktop / trackpad), no reduced-motion flag
 *
 * Use to gate glass blur intensity, orbital animations, and concurrent motion.
 *
 * Server-safe: returns 'standard' until the client effect runs (no flash).
 */
export type MotionTier = 'minimal' | 'standard' | 'full';

export function useDeviceMotionTier(): MotionTier {
  const reducedMotion = useReducedMotion();
  const [tier, setTier] = useState<MotionTier>('standard');

  useEffect(() => {
    if (reducedMotion) {
      setTier('minimal');
      return;
    }
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    setTier(pointerFine ? 'full' : 'standard');
  }, [reducedMotion]);

  return tier;
}