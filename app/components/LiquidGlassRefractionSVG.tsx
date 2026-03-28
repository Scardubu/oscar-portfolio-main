'use client';

import { cn } from '@/lib/utils';

interface LiquidGlassRefractionSVGProps {
  className?: string;
  filterId?: string;
  mode?: 'defs' | 'overlay' | 'both';
  scale?: number;
}

export function LiquidGlassRefractionSVG({
  className,
  filterId = 'liquid-glass-refraction-filter',
  mode = 'both',
  scale = 24,
}: LiquidGlassRefractionSVGProps) {
  const shouldRenderDefs = mode === 'defs' || mode === 'both';
  const shouldRenderOverlay = mode === 'overlay' || mode === 'both';
  const displacementMapId = `${filterId}-map`;
  const specularLightId = `${filterId}-specular`;

  return (
    <>
      {shouldRenderDefs ? (
        <svg
          aria-hidden="true"
          width="0"
          height="0"
          className="pointer-events-none absolute opacity-0"
          focusable="false"
        >
          <defs>
            <filter
              id={filterId}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008"
                numOctaves="2"
                seed="92"
                result={displacementMapId}
              />
              <feColorMatrix
                in={displacementMapId}
                type="matrix"
                values="
                  1 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0
                "
                result="snellVectors"
              />
              <feGaussianBlur in="snellVectors" stdDeviation="0.7" result="softVectors" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="softVectors"
                scale={scale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="refracted"
              />
              <feSpecularLighting
                in="softVectors"
                surfaceScale="3.6"
                specularConstant="0.55"
                specularExponent="28"
                lightingColor="#d8fbff"
                result={specularLightId}
              >
                <fePointLight x="180" y="120" z="170" />
              </feSpecularLighting>
              <feComposite
                in={specularLightId}
                in2="refracted"
                operator="in"
                result="specularComposite"
              />
              <feBlend in="refracted" in2="specularComposite" mode="screen" />
            </filter>
          </defs>
        </svg>
      ) : null}

      {shouldRenderOverlay ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 640 640"
          className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
          fill="none"
        >
          <defs>
            <linearGradient
              id={`${filterId}-stroke`}
              x1="94"
              y1="80"
              x2="560"
              y2="580"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.88" />
              <stop offset="0.35" stopColor="#8EF3FF" stopOpacity="0.56" />
              <stop offset="0.72" stopColor="#7B61FF" stopOpacity="0.24" />
              <stop offset="1" stopColor="#00D9FF" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <g className="hero-refraction-group" filter={`url(#${filterId})`}>
            <circle
              cx="320"
              cy="320"
              r="226"
              className="hero-refraction-stroke"
              stroke={`url(#${filterId}-stroke)`}
            />
            <path
              d="M116 338C173.5 290.5 243 267.5 324.5 269C406 270.5 473 298 525 351.5"
              className="hero-refraction-stroke"
              stroke={`url(#${filterId}-stroke)`}
              strokeLinecap="round"
            />
            <path
              d="M168 181C218.333 129.667 281.167 104.833 356.5 106.5C431.833 108.167 489 142.5 528 209.5"
              className="hero-refraction-stroke"
              stroke={`url(#${filterId}-stroke)`}
              strokeLinecap="round"
            />
            <path
              d="M175 470C233.667 426.5 293.833 407.333 355.5 412.5C417.167 417.667 467.667 445.5 507 496"
              className="hero-refraction-stroke"
              stroke={`url(#${filterId}-stroke)`}
              strokeLinecap="round"
            />
          </g>
        </svg>
      ) : null}
    </>
  );
}
