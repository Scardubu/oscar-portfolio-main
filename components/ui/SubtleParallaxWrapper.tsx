'use client';
/**
 * components/ui/SubtleParallaxWrapper.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * GPU-safe parallax using ScrollCinema's centralized scroll progress.
 * Depth controls the magnitude — defaults to 0.05.
 * Respects prefers-reduced-motion.
 * ──────────────────────────────────────────────────────────────────────────
 */

import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { type ReactNode } from 'react';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';

interface SubtleParallaxWrapperProps {
  children: ReactNode;
  depth?: number; // 0–0.3, default 0.05
  className?: string;
  /** If true, parallax away from scroll direction (reverse) */
  reverse?: boolean;
}

export default function SubtleParallaxWrapper({
  children,
  depth = 0.05,
  className,
  reverse = false,
}: SubtleParallaxWrapperProps) {
  const shouldRed = useReducedMotion();
  const { scrollProgressRef } = useScrollCinema();
  const scrollProgress = useMotionValue(0);

  useAnimationFrame(() => {
    if (shouldRed) {
      if (scrollProgress.get() !== 0) scrollProgress.set(0);
      return;
    }

    const next = scrollProgressRef.current;
    if (Math.abs(next - scrollProgress.get()) > 0.0007) {
      scrollProgress.set(next);
    }
  });

  const boundedDepth = Math.max(0, Math.min(depth, 0.3));
  const magnitude = boundedDepth * 88;
  const output = reverse ? [magnitude, -magnitude] : [-magnitude, magnitude];
  const yRaw = useTransform(scrollProgress, [0, 1], shouldRed ? [0, 0] : output);
  const y = useSpring(yRaw, { stiffness: 130, damping: 24, mass: 0.75 });

  return (
    <m.div
      // eslint-disable-next-line no-restricted-syntax
      style={{ y, willChange: 'transform' }}
      className={className}
    >
      {children}
    </m.div>
  );
}
