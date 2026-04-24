'use client';

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export default function CursorGlow() {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);
  const x = useSpring(rawX, { stiffness: 200, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 200, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion, rawX, rawY]);

  if (reducedMotion) return null;

  return (
    <m.div
      aria-hidden="true"
      data-testid="cursor-glow"
      className="cursor-glow pointer-events-none fixed z-[1]"
      // eslint-disable-next-line no-restricted-syntax
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    />
  );
}
