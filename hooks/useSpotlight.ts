'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SpotlightState {
  x:       number;
  y:       number;
  visible: boolean;
}

/**
 * useSpotlight
 * Tracks cursor position relative to a container for a radial gradient follow effect.
 * Returns null on touch devices (no mousemove = no spotlight).
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref        = useRef<T>(null);
  const rafRef     = useRef<number | null>(null);
  const [spot, setSpot] = useState<SpotlightState>({ x: 0, y: 0, visible: false });
  const isPointerFine = useRef(false);

  useEffect(() => {
    isPointerFine.current = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine.current) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      if (rafRef.current !== null) return; // throttle to rAF
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const rect = el.getBoundingClientRect();
        setSpot({
          x:       e.clientX - rect.left,
          y:       e.clientY - rect.top,
          visible: true,
        });
      });
    };

    const onLeave = () => setSpot((s) => ({ ...s, visible: false }));

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const spotlightStyle = useCallback(
    (opacity = 0.12, size = 320): React.CSSProperties => {
      if (!spot.visible || !isPointerFine.current) return {};
      return {
        background: `radial-gradient(${size}px circle at ${spot.x}px ${spot.y}px, rgba(255,255,255,${opacity}), transparent 70%)`,
      };
    },
    [spot]
  );

  return { ref, spot, spotlightStyle };
}