"use client";

import { useEffect, useMemo, useState } from 'react';

import { formatRelativeTime } from '@/lib/utils';

interface Activity {
  message: string;
  repo?: string;
  time: string | null;
}

const FALLBACK_ACTIVITY: Activity = {
  message: 'Active development',
  repo: 'oscar-portfolio-main',
  time: null,
};

export function LiveActivityBar() {
  const [activity, setActivity] = useState<Activity>(FALLBACK_ACTIVITY);

  useEffect(() => {
    let mounted = true;

    fetch('/api/activity')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`${response.status}`))))
      .then((payload: Activity) => {
        if (mounted) {
          setActivity({
            message: payload.message || FALLBACK_ACTIVITY.message,
            repo: payload.repo || FALLBACK_ACTIVITY.repo,
            time: payload.time ?? null,
          });
        }
      })
      .catch(() => {
        if (mounted) {
          setActivity(FALLBACK_ACTIVITY);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const relativeTime = useMemo(() => {
    return activity.time ? formatRelativeTime(activity.time) : null;
  }, [activity.time]);

  return (
    <div className="flex min-h-4 items-center gap-2 font-mono text-xs text-white/45" role="status">
      <span className="live-dot" aria-hidden="true" />
      <span>
        {activity.message}
        {relativeTime ? <span className="ml-2 text-white/30">{relativeTime}</span> : null}
      </span>
    </div>
  );
}