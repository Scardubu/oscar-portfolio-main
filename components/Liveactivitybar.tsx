'use client';

import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/Skeleton';

interface ActivityData {
  ago: string;
  type: string;
  repo: string;
  sha?: string;
  message?: string;
}

const FALLBACK_ACTIVITY: ActivityData = {
  ago: 'Recently',
  type: 'PushEvent',
  repo: 'oscar-portfolio-main',
  sha: 'unknown',
  message: 'Recent update',
};

function typeLabel(type: string): string {
  switch (type) {
    case 'PushEvent':
      return 'Active development';
    case 'PullRequestEvent':
      return 'Pull request';
    case 'CreateEvent':
      return 'Branch created';
    case 'IssuesEvent':
      return 'Issue activity';
    default:
      return 'Recent activity';
  }
}

export function LiveActivityBar() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/activity', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Activity request failed with status ${response.status}`);
        }

        return response.json();
      })
      .then((data: ActivityData) => {
        setActivity(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setActivity(FALLBACK_ACTIVITY);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return <Skeleton width={280} height={16} />;
  }

  if (!activity) {
    return null;
  }

  return (
    <p
      role="status"
      aria-live="polite"
      className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[color:var(--color-text-muted)]"
    >
      <span aria-hidden="true" className="dot-live h-[6px] w-[6px]" />
      {activity.sha && activity.sha !== 'unknown' ? (
        <span className="font-mono text-[11px] text-[color:var(--color-text-secondary)] uppercase">
          {activity.sha}
        </span>
      ) : null}
      <span
        className="block max-w-[18ch] overflow-hidden text-ellipsis whitespace-nowrap text-[color:var(--color-text-secondary)] sm:max-w-[28ch]"
        title={activity.message ?? typeLabel(activity.type)}
      >
        {activity.message ?? typeLabel(activity.type)}
      </span>
      <span aria-hidden="true">·</span>
      <span>{activity.ago}</span>
    </p>
  );
}
