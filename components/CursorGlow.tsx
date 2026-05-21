'use client';

// CONVICTION ENGINE — CursorGlow v2.0
//
// CHANGES from v1.0:
//   - Glow colour now tracks `--chapter-accent` via CSS instead of the hardcoded
//     teal in globals.css `.cursor-glow`. Since --chapter-accent is a registered
//     @property with a 0.65s transition, the cursor orb cross-fades between chapter
//     palettes with zero JS. The Chapter 5 (range/purple) cursor is now violet;
//     Chapter 3 (credibility/amber) is warm gold; etc.
//   - The `.cursor-glow` class in globals.css no longer needs a hardcoded colour
//     — it now reads `--chapter-accent` from the html element.
//   - Spring values unchanged (stiffness: 200, damping: 20, mass: 0.5) — they were
//     already well-tuned.
//   - Reduced motion and coarse-pointer guards preserved exactly.
//   - Render on fine-pointer only — unchanged.

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const reducedMotion = useReducedMotion();
  const isFinePointer = useRef(false);
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);
  const x = useSpring(rawX, { stiffness: 200, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 200, damping: 20, mass: 0.5 });

  useEffect(() => {
    isFinePointer.current = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !isFinePointer.current) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion, rawX, rawY]);

  if (reducedMotion) return null;

  return (
    <m.div
      aria-hidden="true"
      data-testid="cursor-glow"
      className="pointer-events-none fixed z-[1]"
      // eslint-disable-next-line no-restricted-syntax
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        // The glow shape + size comes from the .cursor-glow class in globals.css.
        // The colour is set here via CSS variable so it transitions with the chapter.
        // --chapter-accent is already on the html element and inherits down.
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, color-mix(in oklch, var(--chapter-accent) 8%, transparent) 0%, transparent 70%)',
        // Transition the background so it cross-fades with the chapter accent.
        // This is a CSS paint transition, not a JS animation.
        transition: 'background 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    />
  );
}
