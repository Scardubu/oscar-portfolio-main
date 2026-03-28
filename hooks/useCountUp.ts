"use client";
// hooks/useCountUp.ts
// ─────────────────────────────────────────────────────────────────────────────
// Animates a number from 0 → target using requestAnimationFrame.
// Respects prefers-reduced-motion — skips to final value instantly.
// Uses easeOutExpo for a snappy, decelerating feel.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  target:    number;
  duration?: number;   // ms — default 1800
  decimals?: number;   // decimal places — default 0
  delay?:    number;   // ms before animation starts
  start?:    boolean;  // gate — only animates when true
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useCountUp({
  target,
  duration = 1800,
  decimals = 0,
  delay    = 0,
  start    = true,
}: UseCountUpOptions): string | number {
  const [count, setCount] = useState(0);
  const rafRef             = useRef<number | null>(null);
  const startTimeRef       = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !start) {
      setCount(target);
      return;
    }

    const timer = setTimeout(() => {
      startTimeRef.current = null;

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed  = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOutExpo(progress);
        const current  = parseFloat((eased * target).toFixed(decimals));
        setCount(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, decimals, delay, start]);

  return decimals > 0 ? count.toFixed(decimals) : Math.round(count);
}
