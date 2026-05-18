'use client';
// CONVICTION ENGINE v21.1 — ScrollProgress
//
// v21.1 vs v21.0:
//   [FIX SCROLL_PERF-2]: Spring stiffness 140 → 600, damping 28 → 38.
//
//   Root cause: a reading-progress bar is a positional indicator — its job
//   is to show where in the document the user currently is. Stiffness 140
//   creates ~200ms of visual lag: the bar was tracking where the user *was*,
//   not where they *are*. On fast scroll this made the bar feel broken rather
//   than smooth — the bar never caught up before the next scroll event.
//
//   Fix: stiffness 600, damping 38. The bar now tracks within ~30ms — the
//   margin is imperceptible as lag but still produces a brief spring ease
//   that distinguishes it from a raw 1:1 scaleX (which would look mechanical).
//   restDelta tightened from 0.001 → 0.0005 so the bar comes to rest
//   precisely rather than parking 0.1% short of full width at document end.
//
//   CE Motion Contract §V: stiffness 340–440 applies to interactive spring
//   *animations* (CTAs, cards, reveals). A scroll-tracking indicator is a
//   different use class — it should be fast, not bouncy. This is intentionally
//   outside the range for that reason.
//
//   KEEP: useScroll, aria progressbar, hidden sm:block, will-change-transform,
//   gradient background, aria-valuenow state update logic.

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