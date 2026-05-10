'use client';

import { useEffect, useState } from 'react';

// Grain is purely decorative. On mobile (pointer:coarse) use a lighter,
// lower-frequency variant to reduce GPU paint cost on low-VRAM devices.
export function GrainOverlay() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(!window.matchMedia('(pointer: fine)').matches);
  }, []);

  // Mobile: lower baseFrequency = larger noise pattern = less GPU work
  const freq = isMobile ? '0.55' : '0.65';
  const opacity = isMobile ? '0.018' : '0.028';

  return (
    <svg
      aria-hidden="true"
      className="grain-overlay pointer-events-none"
      style={{ opacity }}
    >
      <defs>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={freq}
            numOctaves={isMobile ? 2 : 3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}