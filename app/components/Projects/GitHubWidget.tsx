"use client";

import { useState, useEffect } from "react";
import { Star, GitFork, Clock, AlertCircle } from "lucide-react";
import useSWR from "swr";

interface GitHubWidgetProps {
  repo: string; // Format: "username/repo"
}

interface GitHubData {
  stars: number;
  forks: number;
  language: string;
  lastCommit: string;
  description: string;
}

// PRD Card-007: Fallback data for rate limit handling
const FALLBACK_DATA: Record<string, GitHubData> = {
  "scardubu/sabiscore": {
    stars: 12,
    forks: 3,
    language: "TypeScript",
    lastCommit: "2024-11-15",
    description: "AI Sports Prediction Platform",
  },
  "scardubu/hashablanca": {
    stars: 8,
    forks: 2,
    language: "Python",
    lastCommit: "2024-11-10",
    description: "Multi-chain Token Distribution",
  },
};

// PRD Card-007: SWR fetcher with 1-hour cache
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("GitHub API rate limit or network error");
  }
  return res.json();
};

export function GitHubWidget({ repo }: GitHubWidgetProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // PRD Card-007: Fetch GitHub data with SWR (1-hour cache)
  const { data, error } = useSWR(
    mounted ? `https://api.github.com/repos/${repo}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 3600000, // 1 hour
      fallbackData: FALLBACK_DATA[repo],
    }
  );

  // Use fallback data if API fails, not mounted yet, or data not loaded
  const fallback = FALLBACK_DATA[repo] || {
    stars: 0,
    forks: 0,
    language: "N/A",
    lastCommit: "N/A",
    description: "",
  };

  const githubData: GitHubData = error || !data
    ? fallback
    : {
        stars: data.stargazers_count || fallback.stars,
        forks: data.forks_count || fallback.forks,
        language: data.language || fallback.language,
        lastCommit: data.pushed_at
          ? new Date(data.pushed_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : fallback.lastCommit,
        description: data.description || fallback.description,
      };

  return (
    <div className="mb-6 rounded-lg border border-white/10 bg-white/2 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h5 className="text-sm font-semibold text-gray-400">
          GitHub Repository Stats
        </h5>
        {error && (
          <div className="flex items-center gap-1 text-xs text-yellow-500">
            <AlertCircle className="h-3 w-3" />
            <span>Using cached data</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Stars */}
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <div>
            <div className="font-mono text-lg font-bold text-white">
              {githubData.stars}
            </div>
            <div className="text-xs text-gray-400">Stars</div>
          </div>
        </div>

        {/* Forks */}
        <div className="flex items-center gap-2">
          <GitFork className="h-4 w-4 text-accent-primary" />
          <div>
            <div className="font-mono text-lg font-bold text-white">
              {githubData.forks}
            </div>
            <div className="text-xs text-gray-400">Forks</div>
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-accent-primary" />
          <div>
            <div className="text-sm font-semibold text-white">
              {githubData.language}
            </div>
            <div className="text-xs text-gray-400">Language</div>
          </div>
        </div>

        {/* Last Commit */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-xs font-semibold text-white">
              {githubData.lastCommit}
            </div>
            <div className="text-xs text-gray-400">Last Commit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
