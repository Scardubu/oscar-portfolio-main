/**
 * app/api/github/[repo]/route.ts
 *
 * Server-side proxy for the GitHub REST API.
 * Prevents unauthenticated rate limits (60 req/hr per IP) from
 * breaking the GitHubRepoStats component in production.
 *
 * REQUIRES (add to .env.local — do NOT commit):
 *   GITHUB_TOKEN=ghp_your_token_with_public_repo_read_scope
 *
 * Cache: Next.js ISR revalidation every 3600s (1 hour).
 * This means star/fork counts update hourly, not on every page load.
 *
 * SSRF prevention:
 *   repo param must match /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/
 *   Any other format returns 400 before making an upstream request.
 */

import { NextRequest, NextResponse } from 'next/server'
import type { GitHubRepoData }       from '@/lib/types'

// ─── Validation ───────────────────────────────────────────────────────────────

const REPO_PATTERN = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/

// ─── GitHub API response shape (relevant fields only) ─────────────────────────

interface GitHubApiResponse {
  stargazers_count:  number
  forks_count:       number
  language:          string | null
  pushed_at:         string
  open_issues_count: number
  message?:          string  // present on error responses
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ repo: string }> },
): Promise<NextResponse> {
  const { repo } = await params

  // SSRF prevention — validate repo format before using it in a URL
  if (!REPO_PATTERN.test(repo)) {
    return NextResponse.json(
      { error: 'Invalid repo format. Expected: owner/repo' },
      { status: 400 },
    )
  }

  const token = process.env.GITHUB_TOKEN
  const headers: HeadersInit = {
    Accept:       'application/vnd.github.v3+json',
    'User-Agent': 'scardubu-portfolio',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const upstream = await fetch(
      `https://api.github.com/repos/${repo}`,
      {
        headers,
        // ISR: cache this response for 1 hour on the Vercel edge
        next: { revalidate: 3600 },
      },
    )

    if (!upstream.ok) {
      // Pass through GitHub's status code so callers can distinguish
      // 404 (repo not found) from 403 (rate limited) from 500
      return NextResponse.json(
        { error: `GitHub API responded with ${upstream.status}` },
        { status: upstream.status },
      )
    }

    const raw = await upstream.json() as GitHubApiResponse

    // Return only the fields we need — do not proxy the entire GitHub response
    const data: GitHubRepoData = {
      stars:      raw.stargazers_count,
      forks:      raw.forks_count,
      language:   raw.language,
      lastPushed: raw.pushed_at,
      openIssues: raw.open_issues_count,
    }

    return NextResponse.json(data, {
      headers: {
        // Allow browsers to cache this for 10 minutes
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      },
    })

  } catch (err) {
    // Network-level failure — GitHub unreachable
    console.error('[github-proxy] upstream fetch failed:', err)
    return NextResponse.json(
      { error: 'Failed to reach GitHub API' },
      { status: 502 },
    )
  }
}
