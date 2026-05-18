'use client';
// CONVICTION ENGINE v23.1 — GradientMesh
//
// v23.1 vs v23.0:
//   [FIX SCROLL_PERF-1]: Gate all scroll-driven parallax on isPointerFine.
//
//   Root cause: useScroll() was called unconditionally. On mobile/touch
//   (isPointerFine === false) the three useTransform subscriptions
//   (indigoY, greenY, amberY) still fired on every scroll frame, even though:
//     (a) CSS overrides `.gradient-mesh-orb { will-change: auto }` for mobile
//         — no compositor layer benefit.
//     (b) Orbs are blurred at 80px. A 0→15% Y shift is imperceptible through
//         that blur radius on a short mobile viewport.
//     (c) No orbital CSS animations exist on mobile — that guard already existed.
//   3 dead MotionValue evaluations per rAF on every Lagos mid-range scroll tick.
//
//   Fix: two code paths via sub-components so hook calls are correctly scoped.
//     • DesktopOrbs (isPointerFine): useScroll() + useTransform() as before.
//       Parallax ranges unchanged: indigo 0→15%, green 0→-10%, amber 0→-6%.
//     • MobileOrbs: static `style={{ y: 0 }}` — no scroll subscription, no
//       MotionValues, no JS on scroll. m.div still renders for compositor
//       layer consistency with desktop; y is a literal number, never changes.
//   isPointerFine initialises false (mobile-first) so no scroll sub is ever
//   created on mobile, not even before the matchMedia effect resolves.
//
//   Also hardened useIsPointerFine with a MediaQueryList 'change' listener
//   so orientation/device changes (e.g. plugging in a mouse) update correctly.
//
//   KEEP: ORBITAL_STYLES string, all orbital class names, reducedMotion guard.

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

function useIsPointerFine(): boolean {
  const [fine, setFine] = useState(false); // mobile-first: no scroll sub until confirmed
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setFine(mq.matches);
    const handler = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return fine;
}

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

// Desktop: scroll-driven parallax + CSS orbital animations ──────────────────────
// Sub-component so useScroll() hook is scoped — on mobile this component never mounts.
function DesktopOrbs({ reducedMotion }: { reducedMotion: boolean }) {
  const { scrollYProgress } = useScroll();

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
      {!reducedMotion && (
        <style dangerouslySetInnerHTML={{ __html: ORBITAL_STYLES }} />
      )}

      <div className="gradient-mesh-wrap gradient-mesh-wrap--indigo">
        <m.div
          className="gradient-mesh-orb gradient-mesh-orb--indigo"
          style={{ y: indigoY, willChange: 'transform' }}
        >
          <div
            className={!reducedMotion ? 'orb-cw w-full h-full' : ''}
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
            className={!reducedMotion ? 'orb-ccw w-full h-full' : ''}
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
            className={!reducedMotion ? 'orb-slow w-full h-full' : ''}
            style={{ width: '100%', height: '100%' }}
          />
        </m.div>
      </div>
    </>
  );
}

// Mobile: zero scroll subscription, static compositor layer ──────────────────────
// y={0} is a literal number — framer-motion does not create a MotionValue for it.
// No scroll listener. No JS per frame. Orbs render statically.
function MobileOrbs() {
  return (
    <>
      <div className="gradient-mesh-wrap gradient-mesh-wrap--indigo">
        <m.div className="gradient-mesh-orb gradient-mesh-orb--indigo" style={{ y: 0 }}>
          <div style={{ width: '100%', height: '100%' }} />
        </m.div>
      </div>

      <div className="gradient-mesh-wrap gradient-mesh-wrap--green">
        <m.div className="gradient-mesh-orb gradient-mesh-orb--green" style={{ y: 0 }}>
          <div style={{ width: '100%', height: '100%' }} />
        </m.div>
      </div>

      <div className="gradient-mesh-wrap gradient-mesh-wrap--amber">
        <m.div className="gradient-mesh-orb gradient-mesh-orb--amber" style={{ y: 0 }}>
          <div style={{ width: '100%', height: '100%' }} />
        </m.div>
      </div>
    </>
  );
}

export function GradientMesh() {
  const reducedMotion = useReducedMotion();
  const isPointerFine = useIsPointerFine();

  return (
    <div aria-hidden="true" className="gradient-mesh">
      {isPointerFine
        ? <DesktopOrbs reducedMotion={Boolean(reducedMotion)} />
        : <MobileOrbs />
      }
    </div>
  );
}