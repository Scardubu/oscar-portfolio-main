import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/app/lib/blog";

export async function GET() {
  try {
    const posts = getAllBlogPosts().slice(0, 3);
    return NextResponse.json(posts, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json([], {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  }
}
