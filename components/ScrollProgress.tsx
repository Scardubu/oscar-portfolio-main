'use client';

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

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping:   28,
    mass:      0.6,
    restDelta: 0.001,
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