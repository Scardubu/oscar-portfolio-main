/**
 * LiquidGlassCard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable wrapper applying the liquid glass visual system.
 * Composes: .liquid-glass + .liquid-glass-hover + optional colour variant.
 *
 * Usage:
 *   <LiquidGlassCard accent="cyan" interactive>
 *     <YourContent />
 *   </LiquidGlassCard>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import { cn } from "@/lib/utils";

type Accent = "cyan" | "violet" | "teal" | "none";
type Size   = "sm" | "md" | "lg" | "feature";

interface LiquidGlassCardProps {
  children:    React.ReactNode;
  accent?:     Accent;
  size?:       Size;
  interactive?: boolean;  // adds hover shimmer
  float?:      boolean;   // adds liquid float animation
  depth?:      boolean;   // wraps in depth-shell (gradient border)
  className?:  string;
  as?:         React.ElementType;
  "data-reveal"?: string;
  style?:      React.CSSProperties;
}

const accentClass: Record<Accent, string> = {
  cyan:   "liquid-glass-cyan",
  violet: "liquid-glass-violet",
  teal:   "liquid-glass-teal",
  none:   "",
};

const sizeClass: Record<Size, string> = {
  sm:      "bento-cell-sm",
  md:      "bento-cell",
  lg:      "bento-cell",
  feature: "bento-cell-feature",
};

export function LiquidGlassCard({
  children,
  accent      = "none",
  size        = "md",
  interactive = false,
  float       = false,
  depth       = false,
  className,
  as:         Tag = "div",
  style,
  ...rest
}: LiquidGlassCardProps) {
  const inner = (
    <Tag
      className={cn(
        "liquid-glass",
        accentClass[accent],
        interactive && "liquid-glass-hover",
        float       && "animate-liquid-float",
        sizeClass[size],
        className
      )}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );

  if (depth) {
    return (
      <div className="liquid-glass-depth-shell">
        {inner}
      </div>
    );
  }

  return inner;
}
