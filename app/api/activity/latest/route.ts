import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.github.com/repos/Scardubu/oscar-portfolio/commits?per_page=1',
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to fetch latest activity.' }, { status: 502 });
    }

    const commits = (await response.json()) as Array<{
      html_url?: string;
      commit?: {
        message?: string;
        author?: {
          date?: string;
        };
      };
      repository?: {
        name?: string;
      };
    }>;

    const latestCommit = commits[0];

    return NextResponse.json(
      {
        repo: 'Scardubu/oscar-portfolio',
        message: latestCommit?.commit?.message ?? null,
        committedAt: latestCommit?.commit?.author?.date ?? null,
        commitUrl: latestCommit?.html_url ?? null,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Unable to fetch latest activity.' }, { status: 500 });
  }
}
