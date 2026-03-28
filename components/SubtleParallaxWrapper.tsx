/**
 * SubtleParallaxWrapper.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * CSS-native scroll-driven parallax using transform only (GPU-safe).
 * Falls back to static positioning on reduced-motion / unsupported browsers.
 *
 * Design intent: background decorative elements (orbs, grids) drift at a
 * slower rate than the scroll, creating depth without WebGL overhead.
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SubtleParallaxWrapperProps {
  children:   React.ReactNode;
  speed?:     number;    // 0 = static, 0.2 = subtle, 0.5 = medium. Default 0.2
  direction?: "up" | "down";
  className?: string;
  disabled?:  boolean;
}

export function SubtleParallaxWrapper({
  children,
  speed     = 0.2,
  direction = "up",
  className,
  disabled  = false,
}: SubtleParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect   = el.parentElement?.getBoundingClientRect();
    const viewH  = window.innerHeight;
    if (!rect) return;
    const offset = (rect.top / viewH) * speed * 100;
    const y      = direction === "up" ? -offset : offset;
    el.style.transform = `translateY(${y.toFixed(2)}px)`;
  }, [speed, direction]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (disabled || prefersReduced) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, disabled]);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
