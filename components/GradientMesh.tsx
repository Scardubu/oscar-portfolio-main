'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

// Detect touch-primary devices: no continuous RAF orbitals on mobile.
// useTime() causes non-stop JS ticks — devastating on mid-tier Android.
function useIsPointerFine(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches);
  }, []);
  return fine;
}

// Desktop-only: orbital slow rotation via CSS animation (GPU-composited, zero JS).
// Replaced framer-motion useTime() — same visual result, zero continuous ticks.
const ORBITAL_STYLES = `
  @keyframes orb-spin-cw  { to { transform: rotate( 360deg); } }
  @keyframes orb-spin-ccw { to { transform: rotate(-360deg); } }
  .orb-cw  { animation: orb-spin-cw  25s linear infinite; transform-origin: center; }
  .orb-ccw { animation: orb-spin-ccw 35s linear infinite; transform-origin: center; }
  .orb-slow { animation: orb-spin-cw 45s linear infinite; transform-origin: center; }
  @media (prefers-reduced-motion: reduce) {
    .orb-cw, .orb-ccw, .orb-slow { animation: none; }
  }
`;

export function GradientMesh() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const isPointerFine = useIsPointerFine();

  // Scroll parallax: applied on all devices (transform-only, GPU safe)
  const indigoY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['0%', '15%']
  );
  const greenY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['0%', '-10%']
  );
  const amberY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['0%', '-6%']
  );

  return (
    <>
      {/* CSS-based orbitals: only injected on pointer:fine (desktop) */}
      {isPointerFine && !reducedMotion && (
        <style dangerouslySetInnerHTML={{ __html: ORBITAL_STYLES }} />
      )}

      <div aria-hidden="true" className="gradient-mesh">
        <div className="gradient-mesh-wrap gradient-mesh-wrap--indigo">
          <m.div
            className="gradient-mesh-orb gradient-mesh-orb--indigo"
            style={{ y: indigoY, willChange: 'transform' }}
          >
            {/* Orbital rotation: CSS-only on desktop, static on mobile */}
            <div
              className={isPointerFine && !reducedMotion ? 'orb-cw w-full h-full' : ''}
              style={{ width: '100%', height: '100%' }}
            />
          </m.div>
        </div>

        <div className="gradient-mesh-wrap gradient-mesh-wrap--green">
          <m.div
            className="gradient-mesh-orb gradient-mesh-orb--green"
            style={{ y: greenY, willChange: 'transform' }}
          >
            <div
              className={isPointerFine && !reducedMotion ? 'orb-ccw w-full h-full' : ''}
              style={{ width: '100%', height: '100%' }}
            />
          </m.div>
        </div>

        <div className="gradient-mesh-wrap gradient-mesh-wrap--amber">
          <m.div
            className="gradient-mesh-orb gradient-mesh-orb--amber"
            style={{ y: amberY, willChange: 'transform' }}
          >
            <div
              className={isPointerFine && !reducedMotion ? 'orb-slow w-full h-full' : ''}
              style={{ width: '100%', height: '100%' }}
            />
          </m.div>
        </div>
      </div>
    </>
  );
}