'use client';

import { useState, useEffect } from "react";
import { Rocket, GitCommit, FileText, TrendingUp, Activity } from "lucide-react";

type IconType = typeof Rocket;

interface ActivityItem {
  id: string;
  type: "deployment" | "blog" | "commit" | "metric";
  title: string;
  timestamp: string;
  icon: IconType;
  color: string;
}

export function LiveBuildFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [githubRes, blogRes, metricsRes] = await Promise.allSettled([
          fetch("https://api.github.com/users/scardubu/events/public"),
          fetch("/api/recent-blog-posts"),
          fetch("/api/live-metrics"),
        ]);

        const combinedActivities: ActivityItem[] = [];

        // Parse GitHub commits
        if (githubRes.status === "fulfilled" && githubRes.value.ok) {
          const githubData = await githubRes.value.json();
          const commits = (githubData as Array<{ id: string; type: string; repo: { name: string }; created_at: string }>)
            .filter((event) => event.type === "PushEvent")
            .slice(0, 3)
            .map((event) => ({
              id: event.id,
              type: "commit" as const,
              title: `Pushed to ${event.repo.name.split("/")[1]}`,
              timestamp: event.created_at,
              icon: GitCommit,
              color: "text-blue-400",
            }));
          combinedActivities.push(...commits);
        }

        // Parse blog posts
        if (blogRes.status === "fulfilled" && blogRes.value.ok) {
          const blogData = await blogRes.value.json();
          const blogs = (blogData as Array<{ slug: string; title: string; date: string }>)
            .slice(0, 2)
            .map((post) => ({
              id: post.slug,
              type: "blog" as const,
              title: `Published: ${post.title.length > 40 ? post.title.substring(0, 40) + "..." : post.title}`,
              timestamp: post.date,
              icon: FileText,
              color: "text-purple-400",
            }));
          combinedActivities.push(...blogs);
        }

        // Parse live metrics
        if (metricsRes.status === "fulfilled" && metricsRes.value.ok) {
          const metricsData = await metricsRes.value.json();
          if (metricsData?.todayPredictions) {
            combinedActivities.push({
              id: "metric-today",
              type: "metric",
              title: "SabiScore is serving fresh match intelligence right now",
              timestamp: new Date().toISOString(),
              icon: TrendingUp,
              color: "text-green-400",
            });
          }
        }

        // Sort by timestamp
        const sorted = combinedActivities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        setActivities(sorted);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 300000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return "Fresh now";
    if (seconds < 3600) return "Moments ago";
    if (seconds < 86400) return "Earlier today";
    return "Recently";
  };

  if (isLoading) {
    return (
      <div className="liquid-glass mouse-refraction rounded-[2rem] border border-white/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent-primary" />
          <h3 className="text-sm font-semibold text-white">Live Build Activity</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg p-2">
              <div className="h-4 w-4 animate-pulse rounded bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
      <div className="liquid-glass mouse-refraction rounded-[2rem] border border-white/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-5 w-5 text-accent-primary" />
          <h3 className="text-sm font-semibold text-white">Live Build Activity</h3>
        <span className="ml-auto flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs text-gray-400">Live</span>
        </span>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                  className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-white/5"
              >
                <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${activity.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm text-gray-200">{activity.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{getRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 border-t border-white/10 pt-3 text-center">
        <a
          href="https://github.com/scardubu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-accent-primary hover:text-accent-primary/80"
        >
          View all on GitHub →
        </a>
      </div>
    </div>
  );
}
