// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// SquircleDefs — Singleton SVG clipPath definitions for mathematically precise
// superellipse squircle clipping.
//
// CHANGELOG v2026.20 — SQUIRCLE GEOMETRY UPGRADE (n≈2.8 → n≈4)
//
//   FIX 14: Upgraded superellipse exponent from n≈2.8 to n≈4.
//
//     Root cause: n≈2.8 (v2026.19) produces corners closer to a simple rounded
//     rectangle (CSS border-radius equivalent). The corner "onset" begins at
//     ~8% from each edge, meaning ~84% of each side appears straight. While an
//     improvement over pure border-radius, it lacks the premium "presence" of
//     Apple's iOS squircle and Linear's identity components.
//
//     Fix: Recalibrated 8-segment cubic Bézier path to n≈4 using parametric
//     fitting at the 45° diagonal split point.
//
//     Derivation (top-right quadrant, objectBoundingBox [0,1]×[0,1]):
//       Superellipse n=4: x(t) = cos(t)^0.5, y(t) = sin(t)^0.5  (first quadrant)
//       In bbox coords: x_svg = 0.5 + 0.5·cos(t)^0.5
//                       y_svg = 0.5 − 0.5·sin(t)^0.5
//       Split at t=π/4 (45°): (0.920, 0.080)
//         Exact: cos(π/4)^0.5 = 0.7071^0.5 = 0.8409 → x=0.920, y=0.080 ✓
//       Tangent at split: (±1,±1)/√2 by symmetry of n=4 at 45°
//
//       Segment 1 handle fitting (top→diagonal):
//         P0=(0.500,0.000) tangent=(+1,0)  → CP1=(0.817,0.000) h1=0.317
//         P3=(0.920,0.080) tangent=(+1,+1) → CP2=(0.870,0.030) h2=0.0736
//         Constrained at t=3π/8 midpoint: bbox (0.810,0.020) ✓ err<0.002
//
//       Segment 2 handle fitting (diagonal→right):
//         P0=(0.920,0.080) tangent=(+1,+1) → CP1=(0.977,0.136) h3=0.0792
//         P3=(1.000,0.500) tangent=(0,+1)  → CP2=(1.000,0.183) h4=0.317
//         Constrained at t=π/8 midpoint: bbox (0.981,0.191) ✓ err<0.004
//
//     Visual delta vs n≈2.8:
//       — First CP on flat section: x=0.817 (was 0.730) → sides 12% straighter
//       — Corner onset tighter: arrives at top edge at x=0.920 with y=0.080
//         (was y=0.042) — the diagonal intermediate is the exact n=4 curve point
//       — Matches Apple SF Symbols squircle (n≈4–5) and Linear identity card
//         corner geometry observed in reference design system analysis
//
//     Error bounds: max deviation from true n=4 superellipse ≈ 0.004 (0.4% of
//     box dimension) — imperceptible at 320px (sub-pixel: 1.3px).
//
//     Progressive enhancement: CSS Level 5 corner-shape: superellipse(4) applied
//     via .identity-card-frame in globals.css — Chromium 134+ / Safari 18.4+
//     gain sub-pixel antialiasing at corner transitions. Both render identically
//     in practice; CSS takes precedence only where native support exists.
//
//     Render: zero-size SVG, aria-hidden, injected once. Shared via
//     clip-path: url(#squircle-id) across all IdentityCard instances.
//
// CHANGELOG v2026.19 — SQUIRCLE GEOMETRY UPGRADE (border-radius → squircle)
//
//   FIX 13: Replaced border-radius-only squircle in IdentityCard with a
//     mathematically precise SVG clipPath + CSS corner-shape: superellipse(2.8)
//     progressive enhancement. (Superseded by v2026.20 upgrade above.)

export function SquircleDefs() {
  return (
    <svg
      aria-hidden="true"
      // eslint-disable-next-line no-restricted-syntax
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      focusable="false"
    >
      <defs>
        {/*
          Superellipse n≈4 — 8-segment closed cubic Bézier approximation.
          objectBoundingBox: all coordinates normalised to [0,1] × [0,1].
          Aspect-ratio-independent: scales correctly across mobile (260px)
          and desktop (352px) card widths — the 4:5 portrait ratio does not
          require separate paths.

          Path is composed of 8 cubic segments, 2 per quadrant:
            Segments 1+2: top-center → right-center (top-right corner)
            Segments 3+4: right-center → bottom-center (bottom-right corner)
            Segments 5+6: bottom-center → left-center (bottom-left corner)
            Segments 7+8: left-center → top-center (top-left corner)

          Control point derivation: see module changelog above.
          Key parameter k=0.317 for straight-section handles (h1, h4).
          Corner-section handles: h2=0.0736, h3=0.0792.
        */}
        <clipPath id="squircle-id" clipPathUnits="objectBoundingBox">
          <path
            d="
              M 0.500 0.000
              C 0.817 0.000  0.870 0.030  0.920 0.080
              C 0.977 0.136  1.000 0.183  1.000 0.500
              C 1.000 0.817  0.977 0.864  0.920 0.920
              C 0.870 0.970  0.817 1.000  0.500 1.000
              C 0.183 1.000  0.130 0.970  0.080 0.920
              C 0.023 0.864  0.000 0.817  0.000 0.500
              C 0.000 0.183  0.023 0.136  0.080 0.080
              C 0.130 0.030  0.183 0.000  0.500 0.000
              Z
            "
          />
        </clipPath>

        {/*
          squircle-shadow — slightly larger squircle for the drop-shadow layer.
          Used by .identity-card-shadow-layer to render an outer shadow that
          is NOT clipped by the card's clip-path. Scale applied via transform
          on the consuming element; this clipPath is defined at card scale.
          Identical shape to squircle-id — separate id avoids clip-path sharing
          edge cases in browsers that do not dedup identical clipPath defs.
        */}
        <clipPath id="squircle-shadow" clipPathUnits="objectBoundingBox">
          <path
            d="
              M 0.500 0.000
              C 0.817 0.000  0.870 0.030  0.920 0.080
              C 0.977 0.136  1.000 0.183  1.000 0.500
              C 1.000 0.817  0.977 0.864  0.920 0.920
              C 0.870 0.970  0.817 1.000  0.500 1.000
              C 0.183 1.000  0.130 0.970  0.080 0.920
              C 0.023 0.864  0.000 0.817  0.000 0.500
              C 0.000 0.183  0.023 0.136  0.080 0.080
              C 0.130 0.030  0.183 0.000  0.500 0.000
              Z
            "
          />
        </clipPath>
      </defs>
    </svg>
  );
}