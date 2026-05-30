'use client';

// CONVICTION ENGINE V1.0 — Providers
//
// SURGICAL PATCH v2026.15:
//   - MotionConfig transition refined: added `mass: 0.9` to the global spring.
//     The mass parameter adds physical weight to spring animations, preventing
//     over-oscillation on sequences where multiple elements animate in a stagger.
//     Without mass, staggered children can "bounce" independently creating visual
//     noise. mass:0.9 (slightly under 1.0) keeps the spring feeling light and
//     responsive while dampening unwanted oscillation — essential for the staggered
//     metric cards and project card reveals.
//
//   - No changes to reducedMotion:"user" (already correct — MotionConfig respects
//     prefers-reduced-motion at the framework level, disabling all Framer animations
//     in one place rather than per-component).
//
//   - No changes to ScrollCinemaProvider/ScrollCinemaStaticProvider structure.
//     The CinematicErrorBoundary fallback to static provider is preserved.

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

import {
  ScrollCinemaProvider,
  ScrollCinemaStaticProvider,
} from '@/components/cinematic/ScrollCinemaProvider';
import { CinematicErrorBoundary } from '@/components/CinematicErrorBoundary';
import { MotionProvider } from '@/components/MotionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export { useTheme } from '@/components/ThemeProvider';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider>
      <MotionConfig
        // Honour the user's system preference — disables ALL Framer Motion
        // animations in one place when prefers-reduced-motion: reduce is set.
        reducedMotion="user"
        transition={{
          // Spring physics: calibrated for the portfolio's A24 cinematic aesthetic.
          //
          // stiffness: 280 — responsive entry (how quickly the animation starts).
          //   Lower stiffness (e.g. 200) feels too floaty for a "production systems"
          //   brand. Higher (e.g. 350) feels mechanical, not cinematic.
          //
          // damping: 28 — controls deceleration overshoot. 26 (previous) allowed
          //   a subtle 1–2% overshoot on large elements (hero headline), which was
          //   intended for life. Raised to 28 to eliminate overshoot on staggered
          //   grids (metric cards, project cards) where independent bounces per card
          //   read as jitter, not intention. Hero headline retains cinematic feel
          //   because stiffness at 280 still gives it a quick, decisive entry.
          //
          // mass: 0.9 — PATCH v2026.15 addition. Physical mass slows the oscillation
          //   frequency. Without mass (defaults to 1.0), staggered elements on mobile
          //   could arrive at slightly different phases of their spring cycle, causing
          //   a "shimmering" effect on the metric grid. mass:0.9 synchronises the
          //   feel without making elements feel heavy. Lighter than 1.0 = snappier.
          //
          // type: 'spring' — the only choice for an A24-quality portfolio. Easing
          //   functions (ease-out, etc.) produce mechanical ramp-downs without the
          //   physical deceleration curve that makes premium UIs feel alive.
          type: 'spring',
          stiffness: 280,
          damping: 28,
          mass: 0.9,
        }}
      >
        <MotionProvider>
          <CinematicErrorBoundary
            fallback={<ScrollCinemaStaticProvider>{children}</ScrollCinemaStaticProvider>}
          >
            <ScrollCinemaProvider>{children}</ScrollCinemaProvider>
          </CinematicErrorBoundary>
        </MotionProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}