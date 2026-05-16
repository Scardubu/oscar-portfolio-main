'use client'

import { fadeIn, viewportOnce } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { m, useReducedMotion } from 'framer-motion';
import * as React from 'react';

import { trackMetricView } from '@/lib/metrics/analytics';
import { assertMetricIntegrity } from '@/lib/metrics/assert';
import { METRICS } from '@/lib/metrics/registry';

import type { BadgeType } from '@/lib/types';

// ─── Types ─────────────────────────────────────────────────────────────

export interface MetricBadgeProps {
  metric?: string;
  value?: string;
  label?: string;
  badge?: BadgeType;
  sourceLabel?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

// ─── Badge Config (unchanged) ──────────────────────────────────────────

interface BadgeConfig {
  label: string
  color: string
  dot: string
  bg: string
  border: string
  pulse: boolean
}

const BADGE_CONFIG: Record<BadgeType, BadgeConfig> = {
  live: {
    label: 'LIVE',
    color: 'text-(--metric-live)',
    dot: 'bg-(--metric-live)',
    bg: 'bg-green-950/40',
    border: 'border-green-800/40',
    pulse: true,
  },
  documented: {
    label: 'DOCUMENTED',
    color: 'text-(--metric-documented)',
    dot: 'bg-(--metric-documented)',
    bg: 'bg-blue-950/40',
    border: 'border-blue-800/40',
    pulse: false,
  },
  backtested: {
    label: 'BACKTESTED',
    color: 'text-(--metric-backtested)',
    dot: 'bg-(--metric-backtested)',
    bg: 'bg-amber-950/40',
    border: 'border-amber-800/40',
    pulse: false,
  },
  snapshot: {
    label: 'SNAPSHOT',
    color: 'text-(--metric-snapshot)',
    dot: 'bg-(--metric-snapshot)',
    bg: 'bg-zinc-900/40',
    border: 'border-zinc-700/40',
    pulse: false,
  },
};

// ─── Size Config ───────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: { value: 'text-2xl', label: 'text-xs', sublabel: 'text-[11px]' },
  md: { value: 'text-[2rem]', label: 'text-sm', sublabel: 'text-xs' },
  lg: { value: 'text-metric', label: 'text-base', sublabel: 'text-sm' },
} as const

// ─── Component ─────────────────────────────────────────────────────────

export function MetricBadge({
  metric,
  value,
  label,
  badge,
  sourceLabel,
  sublabel,
  size = 'md',
  animate = true,
  className,
}: MetricBadgeProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animate && !prefersReduced;

  const data = metric
    ? METRICS[metric]
    : value && label && badge && sourceLabel
      ? {
          value,
          label,
          badge,
          sourceLabel,
          sublabel,
        }
      : null;

  if (!data) {
    throw new Error(
      metric
        ? `[MetricBadge] Unknown metric: ${metric}`
        : '[MetricBadge] Provide either a metric key or direct metric props'
    );
  }

  if (metric) {
    assertMetricIntegrity(data);
  }

  React.useEffect(() => {
    if (metric) {
      trackMetricView(metric);
    }
  }, [metric]);

  const cfg = BADGE_CONFIG[data.badge];
  const sizes = SIZE_CONFIG[size];

  const prefix = data.value.startsWith('+') ? '+' : '';
  const rest = prefix ? data.value.slice(1) : data.value;

  return (
    <m.div
      variants={shouldAnimate ? fadeIn : {}}
      initial={shouldAnimate ? 'hidden' : false}
      whileInView={shouldAnimate ? 'visible' : undefined}
      viewport={shouldAnimate ? viewportOnce : undefined}
      className={cn('flex flex-col gap-1', className)}
      role="group"
      aria-label={`${data.value} ${data.label} — ${cfg.label} metric sourced from ${data.sourceLabel}`}
    >
      <span
        className={cn(
          sizes.value,
          'leading-none font-extrabold tracking-tight',
          'font-mono tabular-nums'
        )}
      >
        {prefix && <span className="opacity-70">{prefix}</span>}
        {rest}
      </span>

      <span className="sr-only">
        {data.value} {data.label}
      </span>

      <span className={cn(sizes.label, 'text-(--text-secondary)')}>{data.label}</span>

      {data.sublabel && (
        <span className={cn(sizes.sublabel, 'text-(--text-muted)')}>{data.sublabel}</span>
      )}

      <div className="mt-1.5">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold',
            cfg.bg,
            cfg.border,
            cfg.color
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot, cfg.pulse && 'animate-pulse')} />
          {cfg.label}
          <span className="opacity-60">· {data.sourceLabel}</span>
        </div>
      </div>
    </m.div>
  );
}
