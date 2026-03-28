'use client'

/**
 * components/projects/SystemArc.tsx
 *
 * Renders architecture as a factual, ordered data-flow sequence.
 * Replaces vague "event-driven" claims with an interrogatable pipeline.
 *
 * LAYOUT CONTRACT:
 *   - Parent wrapper is `relative` — connectors are positioned correctly
 *   - Each stage item is `relative` so the connector anchors to it
 *   - Connector is decorative only — if layout breaks, remove it
 *
 * ArcStage type imported from lib/types — not redefined here.
 * SystemId    type imported from lib/types — not redefined here.
 */

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { slideRight, viewportOnce } from '@/lib/motion'
import type { ArcStage, SystemId } from '@/lib/types'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SystemArcProps {
  stages:     ArcStage[]
  system:     SystemId
  className?: string
}

// ─── System accent colours ────────────────────────────────────────────────────

const SYSTEM_ACCENT: Record<SystemId, string> = {
  sabiscore:   'var(--accent-primary)',
  taxbridge:   'var(--accent-fintech)',
  hashablanca: 'var(--accent-secondary)',
  ubec:        'var(--accent-warn)',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SystemArc({ stages, system, className = '' }: SystemArcProps): React.ReactElement {
  const prefersReduced = useReducedMotion()
  const accentColor    = SYSTEM_ACCENT[system]

  return (
    <div className={`space-y-0 ${className}`} aria-label={`${system} architecture pipeline`}>
      <p className="text-caption mb-3" style={{ color: 'var(--text-muted)' }}>
        Architecture pipeline · {stages.length} stages
      </p>

      {/*
        LAYOUT NOTE:
        The outer div is `relative` — this is the positioning context
        for the connector lines between stages.
        Without `relative` here, `absolute` children anchor to the
        viewport or the nearest positioned ancestor, not this list.
      */}
      <div className="relative space-y-px" role="list">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1

          return (
            <div key={stage.id} className="relative" role="listitem">
              {/* Stage row */}
              <motion.div
                variants={prefersReduced ? {} : slideRight}
                initial={prefersReduced ? false : 'hidden'}
                whileInView={prefersReduced ? undefined : 'visible'}
                viewport={viewportOnce}
                style={
                  !prefersReduced
                    ? { transitionDelay: `${index * 0.06}s` }
                    : undefined
                }
                className="
                  flex items-start gap-3 p-3 rounded-lg
                  bg-[color:var(--bg-elevated)]
                  border border-[color:var(--border-subtle)]
                  hover:border-[color:var(--border-default)]
                  transition-colors duration-200
                "
              >
                {/* Stage number bubble */}
                <div
                  className="
                    flex-shrink-0 w-6 h-6 rounded-full
                    flex items-center justify-center
                    text-[11px] font-bold
                    text-[color:var(--bg-base)]
                    mt-0.5
                  "
                  style={{ backgroundColor: accentColor }}
                  aria-hidden="true"
                >
                  {index + 1}
                </div>

                {/* Stage content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-semibold text-[color:var(--text-primary)] leading-snug">
                      {stage.label}
                    </span>
                    {stage.tech && (
                      <code className="
                        text-[11px] px-1.5 py-0.5 rounded flex-shrink-0
                        bg-[color:var(--bg-surface)]
                        text-[color:var(--text-code)]
                        border border-[color:var(--border-subtle)]
                      ">
                        {stage.tech}
                      </code>
                    )}
                  </div>
                  <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </motion.div>

              {/*
                Connector line — anchored to this stage's relative container.
                left-[18px] aligns with the centre of the 24px number bubble.
                top-full + mt-0 places it immediately below the current stage.
                Only renders between stages (not after the last).
              */}
              {!isLast && (
                <div
                  className="absolute left-[18px] top-full w-px h-px overflow-visible z-10"
                  aria-hidden="true"
                >
                  <div
                    className="w-px h-3"
                    style={{ backgroundColor: accentColor, opacity: 0.3 }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}