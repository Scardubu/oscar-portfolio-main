'use client';

// CONVICTION ENGINE — CursorGlow v2.1
//
// Notes:
// - Uses CSS-driven chapter accent color via --chapter-accent.
// - Guards against SSR hydration mismatch.
// - Skips rendering on reduced-motion and non-fine-pointer devices.
// - Attaches and cleans up pointer media query + mousemove listeners safely.

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CursorGlow() {
  const reducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion === true;

  const [mounted, setMounted] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);

  const x = useSpring(rawX, {
    stiffness: 200,
    damping: 20,
    mass: 0.5,
  });

  const y = useSpring(rawY, {
    stiffness: 200,
    damping: 20,
    mass: 0.5,
  });

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia('(pointer: fine)');

    const syncPointerCapability = () => {
      setIsFinePointer(mediaQuery.matches);
    };

    syncPointerCapability();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncPointerCapability);
      return () => {
        mediaQuery.removeEventListener('change', syncPointerCapability);
      };
    }

    mediaQuery.addListener(syncPointerCapability);
    return () => {
      mediaQuery.removeListener(syncPointerCapability);
    };
  }, []);

  useEffect(() => {
    if (!mounted || shouldReduceMotion || !isFinePointer) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [mounted, shouldReduceMotion, isFinePointer, rawX, rawY]);

  if (!mounted || shouldReduceMotion || !isFinePointer) {
    return null;
  }

  return (
    <m.div
      aria-hidden="true"
      data-testid="cursor-glow"
      className="pointer-events-none fixed top-0 left-0 z-0"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        willChange: 'transform',
        background:
          'radial-gradient(circle, color-mix(in oklch, var(--chapter-accent) 8%, transparent) 0%, transparent 70%)',
      }}
    />
  );
}
