'use client';
/**
 * SubtleParallaxWrapper.tsx — CONVICTION ENGINE v20.0
 * CSS-native scroll-driven parallax (transform only, GPU-safe).
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
import { useEffect, useRef, useCallback, useState } from 'react';

interface SubtleParallaxWrapperProps {
  children:   React.ReactNode;
  speed?:     number;
  direction?: 'up' | 'down';
  className?: string;
  disabled?:  boolean;
}

/** Walk offsetParent chain to get element's document-relative top. No layout flush on scroll. */
function getDocumentTop(el: HTMLElement | null): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

export function SubtleParallaxWrapper({
  children,
  speed     = 0.2,
  direction = 'up',
  className,
  disabled  = false,
}: Readonly<SubtleParallaxWrapperProps>) {
  const ref         = useRef<HTMLDivElement | null>(null);
  const parentTopRef = useRef(0);  // cached document-relative top of parent
  const viewHRef    = useRef(0);   // cached viewport height
  const [active, setActive] = useState(false);

  // Only activate on desktop pointer:fine (non-touch) devices
  useEffect(() => {
    const pointerFine   = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setActive(pointerFine && !reducedMotion && !disabled);
  }, [disabled]);

  // Cache layout values — called on mount and on resize (not on scroll)
  const measureLayout = useCallback(() => {
    const parent = ref.current?.parentElement ?? null;
    parentTopRef.current = getDocumentTop(parent);
    viewHRef.current = window.innerHeight;
  }, []);

  // Scroll handler: pure reads from cached values — zero layout recalc
  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el || viewHRef.current === 0) return;
    const currentParentTop = parentTopRef.current - window.scrollY;
    const offset = (currentParentTop / viewHRef.current) * speed * 100;
    const y = direction === 'up' ? -offset : offset;
    el.style.transform = `translateY(${y.toFixed(2)}px)`;
  }, [speed, direction]);

  useEffect(() => {
    if (!active) return;

    // Initial measurement
    measureLayout();
    handleScroll();

    // ResizeObserver: recalculate cached values when layout changes
    const ro = new ResizeObserver(() => {
      measureLayout();
      handleScroll();
    });
    const parent = ref.current?.parentElement;
    if (parent) ro.observe(parent);
    if (ref.current) ro.observe(ref.current);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ro.disconnect();
    };
  }, [active, handleScroll, measureLayout]);

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