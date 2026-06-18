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

import { blogUrl } from '@/lib/config';
import { fadeUp, viewportOnce } from '@/lib/motionVariants';
import type { BadgeType, BlogArticleRef } from '@/lib/types';
import { m, useReducedMotion } from 'framer-motion'
import * as React from 'react';

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
  live: 'text-(--metric-live) bg-green-950/40 border-green-800/40',
  documented: 'text-(--metric-documented) bg-blue-950/40 border-blue-800/40',
  backtested: 'text-(--metric-backtested) bg-amber-950/40 border-amber-800/40',
  snapshot: 'text-(--metric-snapshot) bg-zinc-900/40 border-zinc-700/40',
};

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
    <m.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-xl border border-(--border-default) bg-(--bg-elevated) p-5 transition-all duration-300 hover:border-(--accent-primary) hover:bg-(--bg-surface) focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-base) focus-visible:outline-none ${className} `}
      variants={shouldAnimate ? fadeUp : {}}
      initial={shouldAnimate ? 'hidden' : false}
      whileInView={shouldAnimate ? 'visible' : undefined}
      viewport={shouldAnimate ? viewportOnce : undefined}
      aria-label={`Read implementation article: ${title} — ${read_time_minutes} min read`}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tier 1 indicator */}
          <span
            className="rounded-full border border-cyan-800/40 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-bold tracking-widest text-(--accent-primary) uppercase"
            aria-label="Staff-level implementation article"
          >
            DEEP DIVE
          </span>

          {/* Key metric badge */}
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${badgeClass} `}
            aria-label={`${badgeLabel} result: ${key_metric}`}
          >
            {key_metric} · {badgeLabel}
          </span>
        </div>

        {/* Animated arrow */}
        <span
          className="flex-shrink-0 text-sm text-(--text-muted) transition-all duration-200 group-hover:translate-x-1 group-hover:text-(--accent-primary)"
          aria-hidden="true"
        >
          →
        </span>
      </div>

      {/* Article title */}
      <h3 className="mb-2 text-sm leading-snug font-semibold text-(--text-primary) transition-colors duration-200 group-hover:text-(--accent-primary)">
        {title}
      </h3>

      {/* Excerpt — 2 lines max */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-(--text-muted)">{excerpt}</p>

      {/* Footer row */}
      <div className="flex items-center gap-3 text-[10px] text-(--text-muted)">
        <span>{dateLabel}</span>
        <span aria-hidden="true">·</span>
        <span>{read_time_minutes} min read</span>
        <span aria-hidden="true">·</span>
        <span className="font-semibold text-(--accent-primary) underline-offset-2 group-hover:underline">
          Read the implementation →
        </span>
      </div>
    </m.a>
  );
}
