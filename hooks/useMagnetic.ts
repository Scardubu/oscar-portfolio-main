'use client';

import { useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface MagneticOptions {
  strength?: number;  // default 0.35
  radius?:   number;  // px — default 80
}

/**
 * useMagnetic
 * Returns `{ ref, x, y }` spring motion values for a magnetic hover effect.
 * Completely disabled on touch (pointer:coarse) devices.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.35, radius = 80 } = options;

  const ref    = useRef<T>(null);
  const rawX   = useMotionValue(0);
  const rawY   = useMotionValue(0);
  const x      = useSpring(rawX, { stiffness: 500, damping: 32, mass: 0.5 });
  const y      = useSpring(rawY, { stiffness: 500, damping: 32, mass: 0.5 });

  useEffect(() => {
    // Only activate on pointer:fine (desktop/trackpad) — not on touch
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!pointerFine) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const dist   = Math.hypot(dx, dy);

      if (dist < radius) {
        rawX.set(dx * strength);
        rawY.set(dy * strength);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [rawX, rawY, strength, radius]);

  return { ref, x, y };
}