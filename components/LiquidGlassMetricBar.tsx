"use client";

/**
 * LiquidGlassMetricBar — standalone composable metric trust-signal grid
 * Full 6-layer glass physics. Horizontal 4-col / 2x2 tablet / stacked mobile.
 */

import { useEffect, useRef, useState } from "react";
import { LiquidGlassRefractionSVG } from "./LiquidGlassRefractionSVG";

interface MetricItem {
  id:    string;
  label: string;
  value: string;
  desc:  string;
  pulse?: boolean;
}

const DEFAULT_METRICS: MetricItem[] = [
  {
    id: "reach", label: "Real-World Reach",
    value: "Production systems, live users",
    desc:  "Working software with public surfaces, real traffic, and observable operating constraints.",
  },
  {
    id: "ai", label: "Precision AI",
    value: "Embedding-based, not rule-based",
    desc:  "Retrieval, ranking, and model behavior framed around coherence under edge cases instead of brittle heuristics.",
  },
  {
    id: "on", label: "Always On",
    value: "24/7 across high-traffic windows",
    desc:  "Health checks, graceful fallback paths, and environment-scoped guardrails keep the surface usable when pressure rises.",
  },
  {
    id: "years", label: "4+ Years",
    value: "Shipping ML at production scale",
    desc:  "End-to-end ownership across data, inference, interface, deployment, and operating feedback loops.",
    pulse: true,
  },
];

export function LiquidGlassMetricBar({ items = DEFAULT_METRICS, className = "" }: { items?: MetricItem[]; className?: string }) {
  return (
    <div className={`hero-metric-bar ${className}`} role="list" aria-label="Core capabilities">
      {items.map((item, i) => <MetricCard key={item.id} item={item} index={i} />)}
    </div>
  );
}

function MetricCard({ item, index }: { item: MetricItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(e => {
      const rect = e[0]?.contentRect;
      if (rect) setSize({ w: rect.width, h: rect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="listitem"
      className={`glass-surface glass-chromatic-fringe metric-card-glass relative overflow-hidden ${item.pulse ? "breath-pulse" : ""}`}
      style={{
        padding: "var(--bento-pad)", borderRadius: "var(--bento-radius)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 200ms ease-out",
        animationDelay: `${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <LiquidGlassRefractionSVG width={size.w} height={size.h} scale={55} id={`lgmb-${item.id}`} />
      <div className="relative z-10">
        <div className="metric-label">{item.label}</div>
        <div className="metric-value">{item.value}</div>
        <div className="metric-desc">{item.desc}</div>
      </div>
    </div>
  );
}