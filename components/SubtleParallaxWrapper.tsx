'use client';
/**
 * SubtleParallaxWrapper.tsx — CONVICTION ENGINE v19.0
 * CSS-native scroll-driven parallax (transform only, GPU-safe).
 *
 * MOBILE: Completely disabled. At <768px viewport widths the vertical
 * scroll distance is too short for parallax to register meaningfully,
 * and the passive scroll listener still adds per-frame overhead on
 * mid-tier Android. Falls through to static positioning.
 */

import { cn } from '@/lib/utils';
import { useEffect, useRef, useCallback, useState } from 'react';

interface SubtleParallaxWrapperProps {
  children:   React.ReactNode;
  speed?:     number;
  direction?: 'up' | 'down';
  className?: string;
  disabled?:  boolean;
}

export function SubtleParallaxWrapper({
  children,
  speed     = 0.2,
  direction = 'up',
  className,
  disabled  = false,
}: Readonly<SubtleParallaxWrapperProps>) {
  const ref            = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  // Only activate on desktop pointer:fine (non-touch) devices
  useEffect(() => {
    const pointerFine  = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setActive(pointerFine && !reducedMotion && !disabled);
  }, [disabled]);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect  = el.parentElement?.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (!rect) return;
    const offset = (rect.top / viewH) * speed * 100;
    const y      = direction === 'up' ? -offset : offset;
    el.style.transform = `translateY(${y.toFixed(2)}px)`;
  }, [speed, direction]);

  useEffect(() => {
    if (!active) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active, handleScroll]);

  return (
    <div
      ref={ref}
      className={cn(active && 'will-change-transform', className)}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}