"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";

interface GitHubStatsData {
  publicRepos: number;
  followers: number;
  currentYearContributions: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load GitHub stats");
  }
  return res.json();
};

export function GitHubStats() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch - always render placeholder on server
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, error, isLoading } = useSWR<GitHubStatsData>(
    mounted ? "/api/github-stats" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 3600000,
    }
  );

  const stats: GitHubStatsData = data || {
    publicRepos: 12,
    followers: 45,
    currentYearContributions: 350,
  };

  return (
    <section
      aria-label="GitHub activity overview"
      className="relative w-full bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-secondary px-6 py-12 lg:px-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              GitHub <span className="text-gradient-accent">Activity</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-300 md:text-base">
              A snapshot of my open-source work and recent contributions.
            </p>
          </div>
          {isLoading && !data && !error && (
            <p className="text-xs text-gray-500">Loading live stats…</p>
          )}
          {error && (
            <p className="text-xs text-yellow-500">
              Unable to load live stats. Showing cached values.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-medium text-gray-400">
              Contributions (This Year)
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-accent-primary">
              {stats.currentYearContributions}+
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Commits across public repositories
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-medium text-gray-400">Public Repos</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-accent-primary">
              {stats.publicRepos}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Open-source projects on GitHub
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-medium text-gray-400">Followers</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-accent-primary">
              {stats.followers}
            </div>
            <div className="mt-1 text-xs text-gray-400">Developers following my work</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
