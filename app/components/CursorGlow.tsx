"use client";
import { useEffect, useRef } from "react";

export function CursorGlow({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    const container = containerRef.current;
    if (!el || !container) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      cx = lerp(cx, x, 0.12);
      cy = lerp(cy, y, 0.12);
      el.style.setProperty("--gx", `${cx}px`);
      el.style.setProperty("--gy", `${cy}px`);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    };

    const onLeave = () => {
      el.style.opacity = "0";
      setTimeout(() => { el.style.opacity = "0.6"; }, 400);
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "var(--gx, 50%)",
        top: "var(--gy, 50%)",
        width: 320, height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,217,255,0.12) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        willChange: "transform",
        transition: "opacity 400ms ease",
      }}
    />
  );
}