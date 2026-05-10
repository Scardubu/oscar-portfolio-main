'use client';
// components/LiveBuildFeed.tsx — CONVICTION ENGINE v21.1
// FIXED (v21.1): Missing <a opening tag on "View all on GitHub" footer CTA.
// Mobile-native: 52px row targets, skeleton states, graceful API failure.
// Refresh: every 5 minutes. AbortController on unmount.

import { m, useReducedMotion } from 'framer-motion';
import { Activity, FileText, GitCommit, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ActivityItem {
  id:          string;
  type:        'deployment' | 'blog' | 'commit' | 'metric';
  title:       string;
  timestamp:   string;
  icon:        typeof GitCommit;
  accentColor: string;
}

function getRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)    return 'Just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 min-h-[52px]" aria-hidden="true">
      <div
        className="h-4 w-4 shrink-0 mt-0.5 rounded animate-pulse"
        style={{ background: 'var(--color-border)' }}
      />
      <div className="flex-1 space-y-1.5">
        <div
          className="h-3.5 w-3/4 rounded animate-pulse"
          style={{ background: 'var(--color-border)' }}
        />
        <div
          className="h-2.5 w-1/4 rounded animate-pulse"
          style={{ background: 'var(--color-border-subtle)' }}
        />
      </div>
    </div>
  );
}

export function LiveBuildFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [feedState, setFeedState]   = useState<'loading' | 'done' | 'error'>('loading');
  const reducedMotion               = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [githubRes, blogRes, metricsRes] = await Promise.allSettled([
          fetch('https://api.github.com/users/Scardubu/events/public'),
          fetch('/api/recent-blog-posts'),
          fetch('/api/live-metrics'),
        ]);

        if (cancelled) return;

        const combined: ActivityItem[] = [];

        if (githubRes.status === 'fulfilled' && githubRes.value.ok) {
          type GHEvent = { id: string; type: string; repo: { name: string }; created_at: string };
          const events = (await githubRes.value.json()) as GHEvent[];
          events
            .filter((e) => e.type === 'PushEvent')
            .slice(0, 3)
            .forEach((e) =>
              combined.push({
                id:          e.id,
                type:        'commit',
                title:       `Pushed to ${e.repo.name.split('/')[1]}`,
                timestamp:   e.created_at,
                icon:        GitCommit,
                accentColor: 'oklch(65% 0.15 220)',
              })
            );
        }

        if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
          type BlogPost = { slug: string; title: string; date: string };
          const posts = (await blogRes.value.json()) as BlogPost[];
          posts.slice(0, 2).forEach((p) =>
            combined.push({
              id:          p.slug,
              type:        'blog',
              title:       p.title.length > 52 ? p.title.slice(0, 52) + '…' : p.title,
              timestamp:   p.date,
              icon:        FileText,
              accentColor: 'oklch(72% 0.15 290)',
            })
          );
        }

        if (metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
          const data = (await metricsRes.value.json()) as { todayPredictions?: number };
          if (data?.todayPredictions) {
            combined.push({
              id:          'metric-live',
              type:        'metric',
              title:       'SabiScore serving live match intelligence',
              timestamp:   new Date().toISOString(),
              icon:        TrendingUp,
              accentColor: 'var(--color-film-teal)',
            });
          }
        }

        if (!cancelled) {
          setActivities(
            combined
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
          );
          setFeedState('done');
        }
      } catch {
        if (!cancelled) setFeedState('error');
      }
    }

    void fetchAll();
    const timer = setInterval(() => void fetchAll(), 300_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      className="glass-medium rounded-[var(--radius-xl)] overflow-hidden"
      aria-label="Live build activity"
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <Activity
          className="h-4 w-4 shrink-0"
          style={{ color: 'var(--color-accent)' }}
          aria-hidden="true"
        />
        <h3
          className="text-sm font-semibold flex-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Live Build Activity
        </h3>

        {/* Live pulse dot */}
        <span className="flex items-center gap-1.5" role="status" aria-label="Feed is live">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{
                background: 'var(--color-live)',
                animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
              }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--color-live)' }}
            />
          </span>
          <span
            className="font-mono text-[10px] tracking-wider uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Live
          </span>
        </span>
      </div>

      {/* Body */}
      <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
        {feedState === 'loading' && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}

        {feedState === 'error' && (
          <p
            className="px-4 py-4 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Activity feed unavailable — check back soon.
          </p>
        )}

        {feedState === 'done' && activities.length === 0 && (
          <p
            className="px-4 py-4 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No recent activity.
          </p>
        )}

        {feedState === 'done' &&
          activities.map((item) => {
            const Icon = item.icon;
            return (
              <m.div
                key={item.id}
                initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="flex items-start gap-3 px-4 py-3 min-h-[52px]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: item.accentColor }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-snug line-clamp-2"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-0.5 font-mono text-[10px] tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {getRelativeTime(item.timestamp)}
                  </p>
                </div>
              </m.div>
            );
          })}
      </div>

      {/* FIX v21.1: restored missing <a opening tag on footer GitHub CTA */}
      <a
        href="https://github.com/Scardubu"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 min-h-[48px] border-t font-mono text-[11px] tracking-widest uppercase transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/20"
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-film-teal)',
        }}
      >
        View all on GitHub
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M8 0a8 8 0 0 0-2.529 15.59c.4.074.546-.173.546-.385v-1.353c-2.221.483-2.689-.959-2.689-.959-.363-.922-.886-1.168-.886-1.168-.725-.495.055-.485.055-.485.802.056 1.225.823 1.225.823.712 1.22 1.869.868 2.325.664.072-.516.279-.868.508-1.068-1.775-.202-3.641-.888-3.641-3.952 0-.874.313-1.588.823-2.147-.082-.202-.357-1.016.078-2.117 0 0 .671-.215 2.198.82a7.657 7.657 0 0 1 2-.269 7.657 7.657 0 0 1 2 .269c1.527-1.035 2.198-.82 2.198-.82.435 1.101.16 1.915.079 2.117.51.559.822 1.273.822 2.147 0 3.072-1.869 3.748-3.65 3.946.288.248.544.737.544 1.485v2.201c0 .214.144.463.55.385A8.001 8.001 0 0 0 8 0Z" />
        </svg>
      </a>
    </div>
  );
}