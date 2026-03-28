"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface UseAnimatedCounterOptions {
  end: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * Animates a number from 0 to `end` over `duration`ms.
 * Returns the formatted string ready for display.
 * Respects prefers-reduced-motion — jumps immediately if true.
 */
export function useAnimatedCounter({
  end,
  duration = 1800,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
}: UseAnimatedCounterOptions): string {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setCount(end);
      return;
    }

    const timeoutId = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startRef.current === null) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out-expo
        const eased = 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(eased * end * Math.pow(10, decimals)) / Math.pow(10, decimals));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      startRef.current = null;
    };
  }, [end, duration, delay, reduced, decimals]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();
  return `${prefix}${formatted}${suffix}`;
}
