'use client'

/**
 * components/blog/BlogBridge.tsx
 *
 * Wires Tier 1 blog articles directly into system cards.
 * The most important blog integration primitive in the portfolio.
 *
 * CONTRACT:
 *   - Only Tier 1 articles (tier: 1) may be passed here
 *   - href is built from lib/config.blogUrl() — never hardcoded
 *   - key_metric is rendered with a badge — never as a bare string
 *   - This component is the answer to "do you have proof of this?"
 *
 * BlogArticleRef type imported from lib/types — not redefined here.
 */

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce }     from '@/lib/motion'
import { blogUrl }                  from '@/lib/config'
import type { BlogArticleRef, BadgeType } from '@/lib/types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface BlogBridgeProps extends BlogArticleRef {
  className?: string
}

// ─── Badge configuration ──────────────────────────────────────────────────────

const BADGE_LABEL: Record<BadgeType, string> = {
  live:        'LIVE',
  documented:  'DOCUMENTED',
  backtested:  'BACKTESTED',
  snapshot:    'SNAPSHOT',
}

const BADGE_COLOR: Record<BadgeType, string> = {
  live:        'text-[color:var(--metric-live)] bg-green-950/40 border-green-800/40',
  documented:  'text-[color:var(--metric-documented)] bg-blue-950/40 border-blue-800/40',
  backtested:  'text-[color:var(--metric-backtested)] bg-amber-950/40 border-amber-800/40',
  snapshot:    'text-[color:var(--metric-snapshot)] bg-zinc-900/40 border-zinc-700/40',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BlogBridge({
  slug,
  title,
  key_metric,
  metric_badge,
  read_time_minutes,
  published_at,
  excerpt,
  className = '',
}: BlogBridgeProps): React.ReactElement {
  const prefersReduced = useReducedMotion()
  const shouldAnimate  = !prefersReduced

  // Build URL from config — never hardcoded domain strings in components
  const href       = blogUrl(slug)
  const badgeClass = BADGE_COLOR[metric_badge]
  const badgeLabel = BADGE_LABEL[metric_badge]

  const dateLabel = new Date(published_at).toLocaleDateString('en-US', {
    month: 'short',
    year:  'numeric',
  })

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group block rounded-xl
        border border-[color:var(--border-default)]
        bg-[color:var(--bg-elevated)]
        hover:border-[color:var(--accent-primary)]
        hover:bg-[color:var(--bg-surface)]
        transition-all duration-300
        focus:outline-none
        focus:ring-2 focus:ring-[color:var(--accent-primary)]
        focus:ring-offset-2 focus:ring-offset-[color:var(--bg-base)]
        p-5
        ${className}
      `}
      variants={shouldAnimate ? fadeUp : {}}
      initial={shouldAnimate ? 'hidden' : false}
      whileInView={shouldAnimate ? 'visible' : undefined}
      viewport={shouldAnimate ? viewportOnce : undefined}
      aria-label={`Read implementation article: ${title} — ${read_time_minutes} min read`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">

          {/* Tier 1 indicator */}
          <span
            className="
              text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full
              text-[color:var(--accent-primary)] bg-cyan-950/40 border border-cyan-800/40
            "
            aria-label="Staff-level implementation article"
          >
            DEEP DIVE
          </span>

          {/* Key metric badge */}
          <span
            className={`
              text-[10px] font-bold tracking-widest uppercase
              px-2 py-0.5 rounded-full border
              ${badgeClass}
            `}
            aria-label={`${badgeLabel} result: ${key_metric}`}
          >
            {key_metric} · {badgeLabel}
          </span>
        </div>

        {/* Animated arrow */}
        <span
          className="
            flex-shrink-0 text-sm
            text-[color:var(--text-muted)]
            group-hover:text-[color:var(--accent-primary)]
            group-hover:translate-x-1
            transition-all duration-200
          "
          aria-hidden="true"
        >
          →
        </span>
      </div>

      {/* Article title */}
      <h3 className="
        text-sm font-semibold leading-snug mb-2
        text-[color:var(--text-primary)]
        group-hover:text-[color:var(--accent-primary)]
        transition-colors duration-200
      ">
        {title}
      </h3>

      {/* Excerpt — 2 lines max */}
      <p className="text-xs text-[color:var(--text-muted)] leading-relaxed mb-3 line-clamp-2">
        {excerpt}
      </p>

      {/* Footer row */}
      <div className="flex items-center gap-3 text-[10px] text-[color:var(--text-muted)]">
        <span>{dateLabel}</span>
        <span aria-hidden="true">·</span>
        <span>{read_time_minutes} min read</span>
        <span aria-hidden="true">·</span>
        <span
          className="
            text-[color:var(--accent-primary)] font-semibold
            group-hover:underline underline-offset-2
          "
        >
          Read the implementation →
        </span>
      </div>
    </motion.a>
  )
}