"use client";

import { useInView } from "@/hooks/useInView";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { MetricBadge } from "./MetricBadge";
import { cn } from "@/lib/utils";
import type { MetricVariant } from "@/lib/data";

interface BentoMetricProps {
  value: string;
  label: string;
  sublabel?: string;
  variant?: MetricVariant;
  /** If numeric, animate from 0 to value */
  animate?: boolean;
  /** Accent color for the value */
  accent?: "cyan" | "violet" | "teal" | "default";
  className?: string;
  delay?: number;
}

const ACCENT_CLASSES = {
  cyan: "text-[var(--accent-primary)]",
  violet: "text-[var(--accent-secondary-text)]",
  teal: "text-[var(--accent-fintech)]",
  default: "text-[var(--text-primary)]",
};

/**
 * BentoMetric — Giant number + label display.
 * Sits inside bento grid cells. Animates number on scroll reveal.
 * Non-numeric values (e.g. "NTA 2025", "Offline") display statically.
 */
export function BentoMetric({
  value,
  label,
  sublabel,
  variant,
  animate = true,
  accent = "default",
  className,
  delay = 0,
}: BentoMetricProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  // Only animate purely numeric values (strip %, +, commas)
  const numericStr = value.replace(/[^0-9.]/g, "");
  const isNumeric = animate && numericStr !== "" && !isNaN(parseFloat(numericStr));
  const numericEnd = isNumeric ? parseFloat(numericStr) : 0;
  const hasDecimals = numericStr.includes(".");
  const decimals = hasDecimals ? numericStr.split(".")[1]?.length ?? 0 : 0;

  // Reconstruct display value with original affixes
  const prefix = value.startsWith("+") ? "+" : "";
  const suffix = value.replace(/[+\-]?\d+(\.\d+)?/, "");

  const animatedValue = useAnimatedCounter({
    end: numericEnd,
    duration: 1600,
    delay,
    prefix,
    suffix,
    decimals,
  });

  const displayValue = inView && isNumeric ? animatedValue : value;

  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "text-kinetic-metric font-mono gpu-accelerate",
          ACCENT_CLASSES[accent],
        )}
        aria-label={`${label}: ${value}`}
      >
        {displayValue}
      </div>
      <div className="text-caption text-[var(--text-secondary)] uppercase tracking-widest">
        {label}
      </div>
      {sublabel && (
        <div className="text-[0.7rem] text-[var(--text-muted)] leading-tight mt-0.5">
          {sublabel}
        </div>
      )}
      {variant && <MetricBadge variant={variant} className="mt-2 self-start" />}
    </div>
  );
}
