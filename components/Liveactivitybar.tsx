'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import { useEffect, useState } from 'react';

import { StatusPulseDot } from '@/components/shared/StatusPulseDot';

interface ActivityData {
  ago:      string;
  type:     string;
  repo:     string;
  sha?:     string;
  message?: string;
}

const FALLBACK: ActivityData = {
  ago:     'Recently',
  type:    'PushEvent',
  repo:    'scardubu.dev',
  message: 'Building in production',
};

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    PushEvent:        'Pushed update',
    PullRequestEvent: 'Pull request',
    CreateEvent:      'Branch created',
    IssuesEvent:      'Issue activity',
  };
  return map[type] ?? 'Recent activity';
}

export function LiveActivityBar() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading,  setLoading]  = useState(true);

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
        className="flex items-center gap-2 min-h-[24px]"
        aria-label="Loading recent activity"
        aria-busy="true"
      >
        <div
          className="h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: 'var(--color-border)' }}
        />
        <div
          className="h-3 w-44 rounded animate-pulse"
          style={{ background: 'var(--color-border)' }}
        />
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
      className="flex items-center gap-2 overflow-hidden min-h-[24px]"
    >
      <StatusPulseDot color="var(--color-live)" pulseDuration="1s" />

      {activity.sha && activity.sha !== 'unknown' && (
        <span
          className="shrink-0 font-mono text-[11px] uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {activity.sha.slice(0, 7)}
        </span>
      )}

      <span
        className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-snug"
        style={{ color: 'var(--color-text-secondary)' }}
        title={label}
      >
        {label}
      </span>

      <span aria-hidden="true" style={{ color: 'var(--color-border)' }}>·</span>

      <span
        className="shrink-0 font-mono text-[11px]"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {activity.ago}
      </span>
    </p>
  );
}
