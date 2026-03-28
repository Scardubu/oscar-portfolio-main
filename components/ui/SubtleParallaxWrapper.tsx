'use client';
/**
 * components/ui/SubtleParallaxWrapper.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * GPU-safe scroll parallax using CSS transform only (translateY).
 * Uses Framer Motion's useScroll + useTransform for clean bindings.
 * Depth controls the magnitude — defaults to 0.05 (5% of viewport height).
 * Respects prefers-reduced-motion.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface SubtleParallaxWrapperProps {
  children:    ReactNode;
  depth?:      number;   // 0–0.3, default 0.05
  className?:  string;
  /** If true, parallax away from scroll direction (reverse) */
  reverse?:    boolean;
}

export default function SubtleParallaxWrapper({
  children,
  depth     = 0.05,
  className,
  reverse   = false,
}: SubtleParallaxWrapperProps) {
  const ref        = useRef<HTMLDivElement>(null);
  const shouldRed  = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target:  ref,
    offset: ['start end', 'end start'],
  });

  const magnitude  = depth * 100; // as percentage
  const from       = reverse ? magnitude  : -magnitude;
  const to         = reverse ? -magnitude : magnitude;

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldRed ? ['0%', '0%'] : [`${from}%`, `${to}%`]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y, willChange: 'transform' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
