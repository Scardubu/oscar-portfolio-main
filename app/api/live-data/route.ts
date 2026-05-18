// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// app/api/live-data/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight proxy that resolves GitHub star counts and npm download totals.
// Aggregated in one request to avoid CORS in the browser.
// Cache for 1 hour (Vercel ISR). Returns zero counts gracefully on failure.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 3600; // 1 hour

const GITHUB_REPOS = ['Scardubu/taxbridge', 'Scardubu/sabiscore', 'Scardubu/SwarmXQ', 'Scardubu/hashablanca'];

interface RepoData {
  repo: string;
  stars: number;
}

async function fetchGitHubStars(repos: string[]): Promise<RepoData[]> {
  const results = await Promise.allSettled(
    repos.map(async (repo) => {
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!res.ok) return { repo, stars: 0 };
      const data = (await res.json()) as { stargazers_count?: number };
      return { repo, stars: data.stargazers_count ?? 0 };
    })
  );
  return results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { repo: repos[i]!, stars: 0 }
  );
}

export async function GET(): Promise<NextResponse> {
  const stars = await fetchGitHubStars(GITHUB_REPOS);
  const totalStars = stars.reduce((acc, r) => acc + r.stars, 0);

  return NextResponse.json(
    {
      stars: totalStars,
      repos: stars,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}