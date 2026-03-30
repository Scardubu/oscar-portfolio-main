import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/users/Scardubu/events/public?per_page=1', {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}`);
    }

    const events = (await res.json()) as Array<{
      created_at: string;
      type: string;
      repo: { name: string };
    }>;

    if (!events.length) {
      return NextResponse.json({
        ago: 'Recently',
        type: 'PushEvent',
        repo: 'oscar-portfolio-main',
      });
    }

    const event = events[0];
    const createdAt = new Date(event.created_at);
    const diffMinutes = Math.floor((Date.now() - createdAt.getTime()) / 60_000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const ago =
      diffMinutes < 2
        ? 'Just now'
        : diffMinutes < 60
          ? `${diffMinutes} minutes ago`
          : diffHours < 24
            ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
            : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return NextResponse.json(
      { ago, type: event.type, repo: event.repo.name },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch {
    return NextResponse.json({ ago: 'Recently', type: 'PushEvent', repo: 'oscar-portfolio-main' });
  }
}
