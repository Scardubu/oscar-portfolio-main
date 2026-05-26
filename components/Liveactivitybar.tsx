'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import { useEffect, useState } from 'react';

import { StatusPulseDot } from '@/components/shared/StatusPulseDot';

interface ActivityData {
  ago: string;
  type: string;
  repo: string;
  sha?: string;
  message?: string;
}

const FALLBACK_LOADING: ActivityData = {
  ago: 'Recently',
  type: 'PushEvent',
  repo: 'scardubu.dev',
  message: 'Loading latest activity',
};

const FALLBACK_UNAVAILABLE: ActivityData = {
  ago: 'Just now',
  type: 'StatusEvent',
  repo: 'scardubu.dev',
  message: 'Activity feed temporarily unavailable',
};

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    PushEvent: 'Pushed update',
    PullRequestEvent: 'Pull request',
    CreateEvent: 'Branch created',
    IssuesEvent: 'Issue activity',
  };

  return map[type] ?? 'Recent activity';
}

function ActivitySkeleton() {
  return (
    <div className="flex h-6 items-center gap-2" aria-hidden="true">
      <div className="bg-color-border h-1.5 w-1.5 animate-pulse rounded-full" />
      <div className="bg-color-border h-3 w-44 animate-pulse rounded" />
    </div>
  );
}

export function LiveActivityBar() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();

    fetch('/api/activity', { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<ActivityData>;
      })
      .then((data) => {
        if (!ctrl.signal.aborted) setActivity(data);
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setActivity(FALLBACK_UNAVAILABLE);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, []);

  const safeActivity = activity ?? FALLBACK_LOADING;
  const label = safeActivity.message ?? typeLabel(safeActivity.type);
  const announcement = `${label}. ${safeActivity.ago}.`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={loading ? 'true' : 'false'}
      aria-label="Latest commit activity"
      className="live-bar-text flex h-6 items-center gap-2 overflow-hidden"
    >
      <span className="sr-only">{announcement}</span>

      {loading ? (
        <div aria-hidden="true">
          <ActivitySkeleton />
        </div>
      ) : (
        <div className="flex h-6 min-w-0 flex-1 items-center gap-2" aria-hidden="true">
          <StatusPulseDot color="var(--color-live)" pulseDuration="1s" />

          {safeActivity.sha && safeActivity.sha !== 'unknown' && (
            <span className="text-color-text-muted shrink-0 font-mono text-[11px] uppercase">
              {safeActivity.sha.slice(0, 7)}
            </span>
          )}

          <span
            className="text-color-text-secondary min-w-0 flex-1 truncate text-xs leading-snug"
            title={label}
          >
            {label}
          </span>

          <span aria-hidden="true" className="text-color-border">
            ·
          </span>

          <span className="text-color-text-muted shrink-0 font-mono text-[11px]">
            {safeActivity.ago}
          </span>
        </div>
      )}
    </div>
  );
}
