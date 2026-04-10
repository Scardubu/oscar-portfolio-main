'use client';

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useState } from 'react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const [progressValue, setProgressValue] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reducedMotion) {
      setProgressValue(0);
      return;
    }

    setProgressValue(Math.round(value * 100));
  });

  return (
    <motion.div
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressValue}
      data-testid="scroll-progress"
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left bg-[var(--color-accent)]"
      style={{ scaleX: reducedMotion ? 0 : scrollYProgress }}
    />
  );
}
