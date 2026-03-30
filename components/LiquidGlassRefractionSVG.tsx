"use client";

import React from "react";

interface LiquidGlassRefractionSVGProps {
  scale?: number;
  baseFrequency?: number;
  seed?: number;
  filterId?: string;
  mode?: 'defs' | 'overlay';
  className?: string;
  width?: number;
  height?: number;
  id?: string;
}

/**
 * Mounts an SVG <defs> block at layout root.
 * All .glass-surface elements reference #glass-refraction via CSS.
 *
 * L1 — feTurbulence: organic noise field
 * L2 — feDisplacementMap: R→X, G→Y displacement
 */
export function LiquidGlassRefractionSVG({
  scale = 70,
  baseFrequency = 0.008,
  seed = 92,
  filterId,
  mode = 'defs',
  className,
  width = 0,
  height = 0,
  id,
}: LiquidGlassRefractionSVGProps) {
  const resolvedFilterId = filterId ?? id ?? 'glass-refraction';

  if (mode === 'overlay') {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox={`0 0 ${width || 100} ${height || 100}`}
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="transparent"
          filter={`url(#${resolvedFilterId})`}
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter
          id={resolvedFilterId}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={2}
            seed={seed}
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
