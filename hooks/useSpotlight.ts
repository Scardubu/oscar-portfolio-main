// CONVICTION ENGINE v9.0 — FULL REPLACEMENT
// hooks/useSpotlight.ts
// ─────────────────────────────────────────────────────────────────────────────
// Spotlight radial gradient that follows the cursor within a card.
// Creates a "glow from point of contact" effect on glass surfaces.
// Disabled on touch devices — no hover event on touch.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useRef, useState } from 'react';

interface SpotlightPos {
  x: number;
  y: number;
  visible: boolean;
}

export function useSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<SpotlightPos>({ x: 0, y: 0, visible: false });

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  const onMouseLeave = () => {
    setPos((p) => ({ ...p, visible: false }));
  };

  /** Inline background style — merge into your card wrapper's style prop */
  const spotlightStyle: React.CSSProperties = pos.visible
    ? {
        background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(6,182,212,0.07), transparent 70%)`,
      }
    : {};

  return { ref, onMouseMove, onMouseLeave, spotlightStyle };
}
