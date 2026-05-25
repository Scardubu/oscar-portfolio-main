'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useState } from 'react';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';

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

// Desktop: parallax is driven from ScrollCinema provider progress,
// avoiding independent framer scroll subscribers.
function DesktopOrbs({
  reducedMotion,
  scrollProgress,
}: {
  reducedMotion: boolean;
  scrollProgress: MotionValue<number>;
}) {
  const indigoRaw = useTransform(scrollProgress, [0, 1], reducedMotion ? [0, 0] : [0, 96]);
  const greenRaw = useTransform(scrollProgress, [0, 1], reducedMotion ? [0, 0] : [0, -72]);
  const amberRaw = useTransform(scrollProgress, [0, 1], reducedMotion ? [0, 0] : [0, -44]);

  const indigoY = useSpring(indigoRaw, { stiffness: 130, damping: 24, mass: 0.7 });
  const greenY = useSpring(greenRaw, { stiffness: 130, damping: 24, mass: 0.7 });
  const amberY = useSpring(amberRaw, { stiffness: 130, damping: 24, mass: 0.7 });

  return (
    <>
      {!reducedMotion && <style dangerouslySetInnerHTML={{ __html: ORBITAL_STYLES }} />}

      <div className="gradient-mesh-wrap gradient-mesh-wrap--indigo">
        <m.div
          className="gradient-mesh-orb gradient-mesh-orb--indigo"
          // eslint-disable-next-line no-restricted-syntax
          style={{ y: indigoY, willChange: 'transform' }}
        >
          <div className={(!reducedMotion ? 'orb-cw ' : '') + 'h-full w-full'} />
        </m.div>
      </div>

      <div className="gradient-mesh-wrap gradient-mesh-wrap--green">
        <m.div
          className="gradient-mesh-orb gradient-mesh-orb--green"
          // eslint-disable-next-line no-restricted-syntax
          style={{ y: greenY, willChange: 'transform' }}
        >
          <div className={(!reducedMotion ? 'orb-ccw ' : '') + 'h-full w-full'} />
        </m.div>
      </div>

      <div className="gradient-mesh-wrap gradient-mesh-wrap--amber">
        <m.div
          className="gradient-mesh-orb gradient-mesh-orb--amber"
          // eslint-disable-next-line no-restricted-syntax
          style={{ y: amberY, willChange: 'transform' }}
        >
          <div className={(!reducedMotion ? 'orb-slow ' : '') + 'h-full w-full'} />
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
        <m.div
          className="gradient-mesh-orb gradient-mesh-orb--indigo"
          // eslint-disable-next-line no-restricted-syntax
          style={{ y: 0 }}
        >
          <div className="h-full w-full" />
        </m.div>
      </div>

      <div className="gradient-mesh-wrap gradient-mesh-wrap--green">
        <m.div
          className="gradient-mesh-orb gradient-mesh-orb--green"
          // eslint-disable-next-line no-restricted-syntax
          style={{ y: 0 }}
        >
          <div className="h-full w-full" />
        </m.div>
      </div>

      <div className="gradient-mesh-wrap gradient-mesh-wrap--amber">
        <m.div
          className="gradient-mesh-orb gradient-mesh-orb--amber"
          // eslint-disable-next-line no-restricted-syntax
          style={{ y: 0 }}
        >
          <div className="h-full w-full" />
        </m.div>
      </div>
    </>
  );
}

export function GradientMesh() {
  const reducedMotion = useReducedMotion();
  const isPointerFine = useIsPointerFine();
  const { scrollProgressRef } = useScrollCinema();
  const scrollProgress = useMotionValue(0);

  useAnimationFrame(() => {
    if (reducedMotion) {
      if (scrollProgress.get() !== 0) scrollProgress.set(0);
      return;
    }

    const next = scrollProgressRef.current;
    if (Math.abs(next - scrollProgress.get()) > 0.0007) {
      scrollProgress.set(next);
    }
  });

  return (
    <div aria-hidden="true" className="gradient-mesh">
      {isPointerFine ? (
        <DesktopOrbs reducedMotion={Boolean(reducedMotion)} scrollProgress={scrollProgress} />
      ) : (
        <MobileOrbs />
      )}
    </div>
  );
}
