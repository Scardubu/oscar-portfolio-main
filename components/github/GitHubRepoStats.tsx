'use client'

/**
 * components/github/GitHubRepoStats.tsx
 *
 * Replaces bare vanity GitHub stats (350+ commits, 12 repos, 45 followers)
 * with live per-repo data from the GitHub API via our server-side proxy.
 *
 * LOADING PATTERN:
 *   - Renders a skeleton that does NOT use animated counters
 *   - Skeleton boxes use pulse animation (structural, not metric-mimicking)
 *   - Falls back gracefully with a plain text message on error
 *   - Never shows a broken loading state indefinitely
 *
 * METRIC PATTERN:
 *   - Every stat uses MetricBadge with badge: 'live'
 *   - Source is always 'github.com'
 *   - No bare numbers anywhere in this component
 */

import * as React      from 'react'
import { MetricBadge } from '@/components/ui/MetricBadge'
import { GITHUB_PROXY_BASE } from '@/lib/config'
import type { GitHubRepoData } from '@/lib/types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface GitHubRepoStatsProps {
  /** Format: 'owner/repo' — must match the proxy route validation pattern */
  repo:        string
  name:        string
  description: string
  url:         string
  className?:  string
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StatSkeleton(): React.ReactElement {
  return (
    <div className="animate-pulse flex flex-col gap-2" aria-hidden="true">
      <div className="h-8 w-14 rounded-md bg-[color:var(--bg-elevated)]" />
      <div className="h-3 w-20 rounded    bg-[color:var(--bg-elevated)]" />
      <div className="h-4 w-24 rounded-full bg-[color:var(--bg-elevated)]" />
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GitHubRepoStats({
  repo,
  name,
  description,
  url,
  className = '',
}: GitHubRepoStatsProps): React.ReactElement {
  const [stats,   setStats]   = React.useState<GitHubRepoData | null>(null)
  const [error,   setError]   = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    fetch(`${GITHUB_PROXY_BASE}/${encodeURIComponent(repo)}`)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.json() as Promise<GitHubRepoData>
      })
      .then(data => {
        if (!cancelled) {
          setStats(data)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(`Stats temporarily unavailable (${err.message})`)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [repo])

  const lastPushedLabel = stats?.lastPushed
    ? new Date(stats.lastPushed).toLocaleDateString('en-US', {
        month: 'short',
        year:  'numeric',
      })
    : null

  return (
    <div
      className={`
        rounded-xl p-5
        border border-[color:var(--border-default)]
        bg-[color:var(--bg-surface)]
        ${className}
      `}
      aria-label={`GitHub repository stats for ${name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[color:var(--text-primary)] truncate">
            {name}
          </p>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-shrink-0 text-xs font-semibold
            text-[color:var(--accent-primary)]
            hover:underline underline-offset-2
            focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
          "
          aria-label={`Open ${name} on GitHub`}
        >
          GitHub →
        </a>
      </div>

      {/* Stats */}
      {error && (
        <p className="text-xs text-[color:var(--text-muted)]" role="alert">
          {error}
        </p>
      )}

      {!error && (
        <div
          className="grid grid-cols-3 gap-4"
          aria-label="Live repository statistics"
        >
          {loading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : stats ? (
            <>
              <MetricBadge
                value={String(stats.stars)}
                label="stars"
                badge="live"
                sourceLabel="github.com"
                size="sm"
              />
              <MetricBadge
                value={String(stats.forks)}
                label="forks"
                badge="live"
                sourceLabel="github.com"
                size="sm"
              />
              {lastPushedLabel && (
                <MetricBadge
                  value={lastPushedLabel}
                  label="last commit"
                  badge="live"
                  sourceLabel="github.com"
                  size="sm"
                />
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}