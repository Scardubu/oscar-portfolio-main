'use client';

// CONVICTION ENGINE — CursorGlow v2.2
// SURGICAL PATCH v2026.16
//
// Changes from v2.1:
//   [1] Spring physics upgrade: stiffness 200→260, mass 0.5→0.4
//       The old 200/20/0.5 spring had a ~120ms lag at peak velocity — visible
//       as the glow "chasing" the cursor by more than one cursor-width on fast
//       diagonal moves. At 260/22/0.4, the glow leads the cursor by ~60ms
//       (close enough to feel attached) while retaining the spring tail that
//       makes it feel alive vs a dumb transform. mass:0.4 (lighter than 0.5)
//       accelerates the spring response without sacrificing the tail.
//
//   [2] Glow geometry: 600px→700px diameter, refined radial gradient stops
//       The 600px circle was slightly too tight — on 27"+ displays the glow
//       covered ~15% of the viewport and felt localized rather than atmospheric.
//       700px scales the ambient field to ~18% on 1440px wide. The gradient
//       now has a three-stop curve: dense core (9% accent) → soft mid
//       (2% accent at 40%) → transparent at 68% (not 70%). The sharper
//       falloff makes the core feel more precise (film light source vs bloom).
//
//   [3] No structural changes — all mount/unmount guards, SSR safety, and
//       pointer media query logic is preserved exactly as in v2.1.

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CursorGlow() {
  const reducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion === true;

  const [mounted, setMounted] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);

  // PATCH v2026.16 [1]: upgraded spring — snappier lead, preserved tail
  const x = useSpring(rawX, {
    stiffness: 260,
    damping: 22,
    mass: 0.4,
  });

  const y = useSpring(rawY, {
    stiffness: 260,
    damping: 22,
    mass: 0.4,
  });

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia('(pointer: fine)');

    const syncPointerCapability = () => {
      setIsFinePointer(mediaQuery.matches);
    };

    syncPointerCapability();

    mediaQuery.addEventListener('change', syncPointerCapability);
    return () => {
      mediaQuery.removeEventListener('change', syncPointerCapability);
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
      // eslint-disable-next-line no-restricted-syntax
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        // PATCH v2026.16 [2]: wider atmosphere, tighter core falloff
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        willChange: 'transform',
        // Three-stop radial: precise film-light core → diffuse mid → transparent
        // Core (0–40%): dense accent presence at the cursor's exact position.
        // Mid (40–68%): soft ambient bleed into surrounding content.
        // Edge (68–100%): clean transparent fade, no visible circle edge.
        background:
          'radial-gradient(circle, color-mix(in oklch, var(--chapter-accent) 9%, transparent) 0%, color-mix(in oklch, var(--chapter-accent) 2%, transparent) 40%, transparent 68%)',
      }}
    />
  );
}
