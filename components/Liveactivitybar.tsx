'use client';

import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/Skeleton';

interface ActivityData {
  ago: string;
  type: string;
  repo: string;
}

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
      .then((response) => response.json())
      .then((data: ActivityData) => {
        setActivity(data);
        setLoading(false);
      })
      .catch(() => {
        setActivity({ ago: 'Recently', type: 'PushEvent', repo: 'oscar-portfolio-main' });
        setLoading(false);
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
      className="mt-2 flex items-center gap-2 text-sm text-[color:var(--color-text-muted)]"
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--color-success)',
          flexShrink: 0,
        }}
      />
      {typeLabel(activity.type)} · {activity.ago}
    </p>
  );
}
