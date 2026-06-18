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
  live: 'text-(--metric-live) bg-green-950/40 border-green-800/40',
  documented: 'text-(--metric-documented) bg-blue-950/40 border-blue-800/40',
  backtested: 'text-(--metric-backtested) bg-amber-950/40 border-amber-800/40',
  snapshot: 'text-(--metric-snapshot) bg-zinc-900/40 border-zinc-700/40',
};

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
      className={`group block rounded-xl border border-(--border-default) bg-(--bg-surface) p-6 transition-all duration-300 hover:border-(--accent-primary) focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-base) focus-visible:outline-none ${className} `}
      aria-label={`Featured implementation article: ${post.title}`}
    >
      {/* Header badges */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-800/40 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-bold tracking-widest text-(--accent-primary) uppercase">
          DEEP DIVE
        </span>

        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${badgeClass} `}
        >
          {post.key_metric} · {badgeLabel}
        </span>

        {post.system_tag && (
          <span className="ml-auto text-[10px] font-medium tracking-wide text-(--text-muted)">
            {post.system_tag.toUpperCase()}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-3 text-base leading-snug font-bold text-(--text-primary) transition-colors duration-200 group-hover:text-(--accent-primary)">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-(--text-secondary)">
        {post.excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-(--text-muted)">
        <div className="flex items-center gap-3">
          <span>{dateLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{post.read_time_minutes} min read</span>
        </div>
        <span className="font-semibold text-(--accent-primary) underline-offset-2 group-hover:underline">
          Read the implementation →
        </span>
      </div>
    </a>
  );
}
