'use client';

export default function SquircleDefs(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute size-0 overflow-hidden"
    >
      <defs>
        <filter
          id="luxury-duotone-cinema"
          colorInterpolationFilters="sRGB"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feColorMatrix
            type="matrix"
            values="
              0.62 0.08 0.12 0 0.02
              0.10 0.58 0.18 0 0.03
              0.12 0.20 0.78 0 0.06
              0    0    0    1 0
            "
          />
          <feComponentTransfer>
            <feFuncR type="gamma" amplitude="1.04" exponent="0.94" offset="0" />
            <feFuncG type="gamma" amplitude="1.02" exponent="0.98" offset="0" />
            <feFuncB type="gamma" amplitude="1.08" exponent="0.92" offset="0" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}