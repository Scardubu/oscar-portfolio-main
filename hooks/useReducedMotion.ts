// CONVICTION ENGINE v8.0 — FULL REPLACEMENT
'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

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
