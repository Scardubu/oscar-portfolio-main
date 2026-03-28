import { NextResponse } from "next/server";
import { fetchWithCache } from "@/lib/fetch-utils";

interface GitHubUserResponse {
  public_repos: number;
  followers: number;
}

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionsResponse {
  totalContributions?: number;
  contributions?: ContributionDay[];
}

export async function GET() {
  try {
    const [userJson, contributionsJson] = await Promise.all([
      fetchWithCache<GitHubUserResponse>(
        "https://api.github.com/users/Scardubu",
        {
          revalidate: 86400,
          tags: ["github-user"],
        }
      ),
      fetchWithCache<ContributionsResponse>(
        "https://github-contributions-api.deno.dev/Scardubu.json",
        {
          revalidate: 86400,
          tags: ["github-contributions"],
        }
      ).catch(() => null),
    ]);

    const currentYear = new Date().getFullYear();
    const currentYearContributions =
      contributionsJson?.contributions?.reduce((sum, day) => {
        const year = new Date(day.date).getFullYear();
        return year === currentYear ? sum + (day.count || 0) : sum;
      }, 0) ?? 350;

    const payload = {
      publicRepos: userJson.public_repos ?? 12,
      followers: userJson.followers ?? 45,
      currentYearContributions,
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub stats", error);
    return NextResponse.json(
      {
        publicRepos: 12,
        followers: 45,
        currentYearContributions: 350,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      }
    );
  }
}
