import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 300;

export async function GET() {
  const res = await fetch("https://api.github.com/users/Scardubu/events/public?per_page=1", {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return NextResponse.json({ message: "Active development" });
  }

  const [event] = await res.json() as Array<{
    type: string;
    repo: { name: string };
    payload: { commits?: Array<{ message: string }> };
    created_at: string;
  }>;

  return NextResponse.json({
    message: (event?.payload?.commits?.[0]?.message ?? "Active development").slice(0, 72),
    repo: event?.repo?.name ?? "oscar-portfolio",
    time: event?.created_at ?? null,
    url: event?.repo?.name ? `https://github.com/${event.repo.name}` : undefined,
  });
}
