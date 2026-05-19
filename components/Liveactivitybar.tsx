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

const FALLBACK: ActivityData = {
  ago: 'Recently',
  type: 'PushEvent',
  repo: 'scardubu.dev',
  message: 'Building in production',
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
        if (!ctrl.signal.aborted) setActivity(FALLBACK);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, []);

  if (loading) {
    return (
      <div
        className="flex min-h-[24px] items-center gap-2"
        aria-label="Loading recent activity"
        aria-busy="true"
      >
        <div className="bg-color-border h-1.5 w-1.5 animate-pulse rounded-full" />
        <div className="bg-color-border h-3 w-44 animate-pulse rounded" />
      </div>
    );
  }

  if (!activity) return null;

  const label = activity.message ?? typeLabel(activity.type);

  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Latest commit activity"
      className="flex min-h-[24px] items-center gap-2 overflow-hidden"
    >
      <StatusPulseDot color="var(--color-live)" pulseDuration="1s" />

      {activity.sha && activity.sha !== 'unknown' && (
        <span className="text-color-text-muted shrink-0 font-mono text-[11px] uppercase">
          {activity.sha.slice(0, 7)}
        </span>
      )}

      <span
        className="text-color-text-secondary min-w-0 flex-1 overflow-hidden text-xs leading-snug text-ellipsis whitespace-nowrap"
        title={label}
      >
        {label}
      </span>

      <span aria-hidden="true" className="text-color-border">
        ·
      </span>

      <span className="text-color-text-muted shrink-0 font-mono text-[11px]">{activity.ago}</span>
    </p>
  );
}
