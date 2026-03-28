/**
 * components/blog/FeaturedArticle.tsx
 *
 * Blog index component for Tier 1 articles only.
 *
 * HARD GUARD: if (post.tier !== 1) return null
 * This component will never render a Tier 2 or Tier 3 article.
 * The type system enforces this — BlogPost.tier: 1 | 2 | 3 is
 * checked at runtime and at compile time via the guard.
 *
 * URL construction uses blogUrl() from lib/config — never hardcoded.
 * BadgeType and BlogPost types imported from lib/types.
 */

import * as React from 'react'
import { blogUrl } from '@/lib/config'
import type { BlogPost, BadgeType } from '@/lib/types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturedArticleProps {
  post:       BlogPost
  className?: string
}

// ─── Badge configuration ──────────────────────────────────────────────────────

const BADGE_COLOR: Record<BadgeType, string> = {
  live:        'text-[color:var(--metric-live)] bg-green-950/40 border-green-800/40',
  documented:  'text-[color:var(--metric-documented)] bg-blue-950/40 border-blue-800/40',
  backtested:  'text-[color:var(--metric-backtested)] bg-amber-950/40 border-amber-800/40',
  snapshot:    'text-[color:var(--metric-snapshot)] bg-zinc-900/40 border-zinc-700/40',
}

const BADGE_LABEL: Record<BadgeType, string> = {
  live:        'LIVE',
  documented:  'DOCUMENTED',
  backtested:  'BACKTESTED',
  snapshot:    'SNAPSHOT',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FeaturedArticle({ post, className = '' }: FeaturedArticleProps): React.ReactElement | null {
  // Runtime guard — never render non-Tier-1 articles from this component
  if (post.tier !== 1) return null

  const href        = blogUrl(post.slug)
  const badgeClass  = BADGE_COLOR[post.metric_badge]
  const badgeLabel  = BADGE_LABEL[post.metric_badge]
  const dateLabel   = new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'short',
    year:  'numeric',
  })

  return (
    <a
      href={href}
      className={`
        group block rounded-xl
        border border-[color:var(--border-default)]
        bg-[color:var(--bg-surface)] p-6
        hover:border-[color:var(--accent-primary)]
        transition-all duration-300
        focus:outline-none
        focus:ring-2 focus:ring-[color:var(--accent-primary)]
        focus:ring-offset-2 focus:ring-offset-[color:var(--bg-base)]
        ${className}
      `}
      aria-label={`Featured implementation article: ${post.title}`}
    >
      {/* Header badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="
          text-[10px] font-bold tracking-widest uppercase
          px-2 py-0.5 rounded-full
          text-[color:var(--accent-primary)] bg-cyan-950/40 border border-cyan-800/40
        ">
          DEEP DIVE
        </span>

        <span className={`
          text-[10px] font-bold tracking-widest uppercase
          px-2 py-0.5 rounded-full border
          ${badgeClass}
        `}>
          {post.key_metric} · {badgeLabel}
        </span>

        {post.system_tag && (
          <span className="ml-auto text-[10px] text-[color:var(--text-muted)] font-medium tracking-wide">
            {post.system_tag.toUpperCase()}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="
        text-base font-bold leading-snug mb-3
        text-[color:var(--text-primary)]
        group-hover:text-[color:var(--accent-primary)]
        transition-colors duration-200
      ">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
        {post.excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[color:var(--text-muted)]">
        <div className="flex items-center gap-3">
          <span>{dateLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{post.read_time_minutes} min read</span>
        </div>
        <span className="
          font-semibold text-[color:var(--accent-primary)]
          group-hover:underline underline-offset-2
        ">
          Read the implementation →
        </span>
      </div>
    </a>
  )
}