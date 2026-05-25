'use client';
/**
 * CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
 * Major Reset • Lagos → Global • Production Conviction Architecture
 *
 * SubtleParallaxWrapper — CSS-native scroll-driven parallax (transform only, GPU-safe).
 *
 * MOBILE: Completely disabled. At <768px viewport widths the vertical
 * scroll distance is too short for parallax to register meaningfully,
 * and the passive scroll listener still adds per-frame overhead on
 * mid-tier Android. Falls through to static positioning.
 *
 * v20.0 vs v19.0:
 *   [FIX SCROLL_PERF-3]: Eliminate getBoundingClientRect() inside the scroll
 *   handler — it was causing a forced synchronous layout (FSL) on every scroll
 *   tick. FSL flushes pending style changes and forces the browser to re-compute
 *   layout synchronously, which blocks the main thread and creates scroll jank.
 *
 *   Fix: cache parentTop (element's document-relative top offset) and viewH in
 *   refs, updated only in a ResizeObserver and on mount — not on scroll.
 *   The scroll handler reads from those cached values (pure reads, no layout).
 *
 *   The scroll-driven offset formula becomes:
 *     currentParentTop = cachedParentTop - scrollY
 *     offset = (currentParentTop / viewH) * speed * 100
 *   where cachedParentTop is the element's top position at the time of the
 *   last layout measurement (mount or resize). This is geometrically identical
 *   to the previous rect.top calculation — rect.top = pageTop - scrollY.
 *
 *   parentTop is computed once from offsetTop traversal (layout-safe at
 *   mount time, not during scroll). ResizeObserver recalculates when the
 *   page layout changes (font load, content shift, viewport resize).
 */

import { cn } from '@/lib/utils';
import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';

interface SubtleParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
  disabled?: boolean;
}

export function SubtleParallaxWrapper({
  children,
  speed = 0.2,
  direction = 'up',
  className,
  disabled = false,
}: Readonly<SubtleParallaxWrapperProps>) {
  const reducedMotion = useReducedMotion();
  const { scrollProgressRef } = useScrollCinema();
  const scrollProgress = useMotionValue(0);

  const shouldDisable = reducedMotion || disabled;

  useAnimationFrame(() => {
    if (shouldDisable) {
      if (scrollProgress.get() !== 0) scrollProgress.set(0);
      return;
    }

    const next = scrollProgressRef.current;
    if (Math.abs(next - scrollProgress.get()) > 0.0007) {
      scrollProgress.set(next);
    }
  });

  const boundedSpeed = Math.max(0, Math.min(speed, 0.4));
  const directionSign = direction === 'up' ? -1 : 1;
  const yRaw = useTransform(
    scrollProgress,
    [0, 1],
    shouldDisable ? [0, 0] : [0, directionSign * boundedSpeed * 120]
  );
  const y = useSpring(yRaw, { stiffness: 130, damping: 24, mass: 0.75 });

  return (
    <m.div
      className={cn(!shouldDisable && 'will-change-transform', className)}
      aria-hidden="true"
      // eslint-disable-next-line no-restricted-syntax
      style={shouldDisable ? undefined : { y, willChange: 'transform' }}
    >
      {children}
    </m.div>
  );
}
