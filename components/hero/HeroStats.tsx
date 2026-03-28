'use client'

/**
 * components/hero/HeroStats.tsx
 *
 * Four static, source-anchored metric tiles.
 * Replaces the animated-from-zero counter pattern (HARD VIOLATION).
 *
 * VERIFIED METRICS (checked against live blog 2026-03-23):
 *   71%  accuracy      ← ensemble-models-production, results table
 *   0.15 Brier score   ← ensemble-models-production, results table (ensemble row)
 *   87ms inference     ← fastapi-ml-engineers article, inline text
 *   4    systems       ← portfolio project data
 *
 * "Years Experience" deliberately absent — forbidden metric.
 * No counter animation from zero — values are static from mount.
 * Array is explicitly typed — no `as const` workaround for inconsistent shapes.
 */

import * as React        from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MetricBadge }              from '@/components/ui/MetricBadge'
import { stagger, viewportOnce }    from '@/lib/motion'
import { blogUrl }                  from '@/lib/config'
import type { HeroMetricDef }       from '@/lib/types'

// ─── Data ─────────────────────────────────────────────────────────────────────
// Types explicitly declared — TypeScript knows sourceHref?: string on every item.
// No runtime 'sourceHref' in metric check needed.

const HERO_METRICS: HeroMetricDef[] = [
  {
    value:       '71%',
    label:       'prediction accuracy',
    badge:       'documented',
    sourceLabel: 'ensemble article',
    sourceHref:  blogUrl('ensemble-models-production'),
    sublabel:    '64% → 71% · backtested, 3 seasons',
  },
  {
    value:       '0.15',
    label:       'Brier score',
    badge:       'documented',
    sourceLabel: 'ensemble article',
    sourceHref:  blogUrl('ensemble-models-production'),
    sublabel:    'vs 0.19 single-model baseline · lower is better',
  },
  {
    value:       '87ms',
    label:       'median inference',
    badge:       'documented',
    sourceLabel: 'FastAPI <100ms article',
    sourceHref:  blogUrl('fastapi-ml-engineers'),
    sublabel:    'Redis-cached · p99 < 200ms',
  },
  {
    value:       '4',
    label:       'production systems',
    badge:       'documented',
    sourceLabel: 'portfolio case studies',
    sublabel:    'SabiScore · TaxBridge · Hashablanca · UBEC',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroStats(): React.ReactElement {
  const prefersReduced = useReducedMotion()
  const shouldAnimate  = !prefersReduced

  return (
    <motion.div
      variants={shouldAnimate ? stagger(0.08, 0.10) : {}}
      initial={shouldAnimate ? 'hidden' : false}
      whileInView={shouldAnimate ? 'visible' : undefined}
      viewport={shouldAnimate ? viewportOnce : undefined}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      role="list"
      aria-label="Key production metrics — all values sourced and verifiable"
    >
      {HERO_METRICS.map(metric => (
        <div
          key={metric.label}
          role="listitem"
          className="
            rounded-xl p-4
            border border-[color:var(--border-subtle)]
            bg-[color:var(--bg-surface)]
            hover:border-[color:var(--border-default)]
            transition-colors duration-200
          "
        >
          <MetricBadge
            value={metric.value}
            label={metric.label}
            badge={metric.badge}
            sourceLabel={metric.sourceLabel}
            sourceHref={metric.sourceHref}
            sublabel={metric.sublabel}
            size="lg"
            animate={true}
          />
        </div>
      ))}
    </motion.div>
  )
}