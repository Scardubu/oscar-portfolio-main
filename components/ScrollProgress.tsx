'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import {
    m,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
} from 'framer-motion';
import { useState } from 'react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();

  // v21.1: stiffness 600 / damping 38 — tracks within ~30ms.
  // Feels accurate rather than lagged. restDelta 0.0005 stops at 100% cleanly.
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 600,
    damping:   38,
    mass:      0.6,
    restDelta: 0.0005,
  });

  const [progressValue, setProgressValue] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reducedMotion) {
      setProgressValue(0);
      return;
    }
    setProgressValue(Math.round(value * 100));
  });

  return (
    <m.div
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressValue}
      data-testid="scroll-progress"
      className="
        fixed top-0 right-0 left-0 z-[60]
        h-[2px]
        origin-left
        will-change-transform
        pointer-events-none
        hidden sm:block
      "
      style={{
        scaleX: reducedMotion ? 0 : springProgress,
        background:
          'linear-gradient(90deg, var(--color-accent) 0%, var(--color-cyan) 100%)',
      }}
    />
  );
}
