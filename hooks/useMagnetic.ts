// CONVICTION ENGINE v9.0 — FULL REPLACEMENT
// hooks/useMagnetic.ts
// ─────────────────────────────────────────────────────────────────────────────
// Magnetic pull effect for primary CTA buttons.
// Pulls 8px max toward cursor on hover; snaps back on leave via SPRING_FAST.
// Disabled automatically on touch devices (coarse pointer).
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useRef } from 'react';
import { useMotionValue, useReducedMotion } from 'framer-motion';

const PULL_PX = 8;

export function useMagnetic() {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reducedMotion = useReducedMotion();

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) / (rect.width / 2);
    const distY = (e.clientY - centerY) / (rect.height / 2);
    x.set(distX * PULL_PX);
    y.set(distY * PULL_PX);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, x, y, onMouseMove, onMouseLeave };
}
