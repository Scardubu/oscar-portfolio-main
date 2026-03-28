/**
 * MetricBadge.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Semantic metric badge with pulse dot for live metrics.
 * Maps to all four metric types in globals.css token system.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import { cn } from "@/lib/utils";
import type { MetricType } from "@/lib/portfolio-data";

interface MetricBadgeProps {
  type:       MetricType;
  label?:     string;
  className?: string;
}

const CONFIG: Record<MetricType, { label: string; colorClass: string }> = {
  live:        { label: "Live",        colorClass: "metric-live"        },
  documented:  { label: "Documented",  colorClass: "metric-documented"  },
  backtested:  { label: "Backtested",  colorClass: "metric-backtested"  },
  snapshot:    { label: "Snapshot",    colorClass: "metric-snapshot"    },
};

export function MetricBadge({ type, label, className }: MetricBadgeProps) {
  const config = CONFIG[type];
  const text   = label ?? config.label;

  return (
    <span
      className={cn(
        "badge",
        "text-caption",
        config.colorClass,
        "metric-dot",
        className
      )}
      aria-label={`Metric source: ${text}`}
    >
      {text}
    </span>
  );
}

// ── Metric Number Display — used in BentoMetric and project cards ─────────────

interface MetricValueProps {
  value:      string | number;
  label:      string;
  type?:      MetricType;
  size?:      "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "text-metric",
  md: "text-metric",
  lg: "text-kinetic-metric",
};

export function MetricValue({
  value,
  label,
  type,
  size      = "md",
  className,
}: MetricValueProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span
        className={cn(
          sizeClass[size],
          "text-primary font-mono font-extrabold",
          type === "live" && "text-gradient-accent"
        )}
        aria-label={`${value} — ${label}`}
      >
        {value}
      </span>
      <span className="text-caption text-muted">{label}</span>
      {type && <MetricBadge type={type} className="mt-1 self-start" />}
    </div>
  );
}
