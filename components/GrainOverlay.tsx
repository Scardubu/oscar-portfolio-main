export function GrainOverlay() {
  return (
    <svg aria-hidden="true" className="grain-overlay">
      <defs>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
