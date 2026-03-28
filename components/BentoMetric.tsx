/**
 * BentoMetric.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Giant kinetic number callout for bento grid cells.
 * Fires countUp animation when scrolled into view.
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";
import type { MetricType } from "@/lib/portfolio-data";

interface BentoMetricProps {
  value:      number;
  suffix?:    string;
  prefix?:    string;
  label:      string;
  sublabel?:  string;
  type?:      MetricType;
  decimals?:  number;
  duration?:  number;
  accent?:    "cyan" | "violet" | "teal";
  className?: string;
}

const accentTextClass = {
  cyan:   "text-gradient-accent",
  violet: "text-[var(--accent-secondary)]",
  teal:   "text-gradient-fintech",
};

export function BentoMetric({
  value,
  suffix    = "",
  prefix    = "",
  label,
  sublabel,
  type,
  decimals  = 0,
  duration  = 1800,
  accent    = "cyan",
  className,
}: BentoMetricProps) {
  // IntersectionObserver gate for countUp
  const ref      = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.unobserve(el); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const count = useCountUp({ target: value, duration, decimals, start: started });

  return (
    <div
      ref={ref}
      className={cn("flex flex-col justify-between h-full", className)}
    >
      <p className="text-caption text-muted mb-2 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-end gap-0.5">
        {prefix && (
          <span className={cn("text-kinetic-metric font-extrabold font-mono", accentTextClass[accent])}>
            {prefix}
          </span>
        )}
        <span
          className={cn(
            "text-kinetic-metric font-extrabold font-mono leading-none",
            accentTextClass[accent]
          )}
          aria-live="polite"
        >
          {count}
        </span>
        {suffix && (
          <span className={cn("text-kinetic-metric font-extrabold font-mono", accentTextClass[accent])}>
            {suffix}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="text-caption text-muted mt-2">{sublabel}</p>
      )}
    </div>
  );
}
