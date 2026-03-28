"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * CursorGlow
 *
 * Accent radial glow that follows cursor position.
 * 60fps via rAF + CSS custom properties.
 * Lerp factor 0.12 for smooth lag.
 * Fades on mouse leave (400ms).
 * Disabled on coarse pointer (touch) devices.
 * Disabled under prefers-reduced-motion.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -9999, y: -9999 });
  const targetRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const pRM = useReducedMotion();

  useEffect(() => {
    if (pRM) return;

    // Disable on coarse pointer (touch/stylus)
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const el = glowRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      el.style.opacity = "1";
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    // rAF loop with lerp
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.12);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.12);

      el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [pRM]);

  if (pRM) return null;

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      aria-hidden="true"
      style={{
        opacity: 0,
        transition: "opacity 400ms ease",
        willChange: "transform, opacity",
        // Size driven by CSS variable in globals.css
      }}
    />
  );
}