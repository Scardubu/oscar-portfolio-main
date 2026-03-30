import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 3600;

function formatAgo(createdAt: Date): string {
  const diffMinutes = Math.floor((Date.now() - createdAt.getTime()) / 60_000);

  if (diffMinutes < 2) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function fallbackActivity(status = 200) {
  return NextResponse.json(
    {
      ago: 'Recently',
      type: 'PushEvent',
      repo: 'oscar-portfolio-main',
      sha: 'unknown',
      message: 'Recent update',
    },
    { status }
  );
}

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/repos/Scardubu/oscar-portfolio-main/commits?per_page=1', {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}`);
    }

    const commits = (await res.json()) as Array<{
      sha: string;
      commit: {
        message: string;
        author: { date: string };
      };
    }>;

    if (!commits.length) {
      return fallbackActivity();
    }

    const commit = commits[0];
    const createdAt = new Date(commit.commit.author.date);
    const ago = formatAgo(createdAt);

    return NextResponse.json(
      {
        ago,
        type: 'PushEvent',
        repo: 'Scardubu/oscar-portfolio-main',
        sha: commit.sha.slice(0, 7),
        message: commit.commit.message.split('\n')[0] ?? 'Recent update',
      },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } }
    );
  } catch {
    return fallbackActivity();
  }
}
