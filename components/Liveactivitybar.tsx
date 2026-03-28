"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface ActivityData {
  message: string;
  repo?: string;
  time?: string | null;
  url?: string;
}

/**
 * LiveActivityBar
 *
 * Fetches latest public GitHub commit via /api/activity edge route.
 * Falls back to "Active · [date]" with zero cold start.
 * Renders as a sticky glass bar at the bottom of the hero section.
 */
export function LiveActivityBar() {
  const pRM = useReducedMotion();
  const [activity, setActivity] = useState<ActivityData | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/activity", { signal: controller.signal })
      .then(r => r.json())
      .then((data: ActivityData) => {
        setActivity(data);
      })
      .catch(() => {
        setActivity({
          message: "Active development",
          repo: "oscar-portfolio",
          time: null,
        });
      });

    return () => controller.abort();
  }, []);

  const relativeTime = useMemo(() => {
    if (!activity?.time) {
      return "Live now";
    }

    const diffMs = Date.now() - new Date(activity.time).getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    if (Math.abs(diffMinutes) < 60) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-diffMinutes, "minute");
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-diffHours, "hour");
    }

    const diffDays = Math.round(diffHours / 24);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-diffDays, "day");
  }, [activity?.time]);

  return (
    <motion.div
      initial={pRM ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-no-hover glass-light mx-auto mt-8 flex max-w-[1200px] flex-wrap items-center gap-3 px-4 py-3 text-sm text-white/70"
      role="status"
      aria-live="polite"
      aria-label="Live activity"
    >
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
        Live Activity
      </span>
      <span className="live-dot" aria-hidden="true" />
      {activity?.url ? (
        <Link
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-white/72 transition hover:text-white sm:text-sm"
        >
          {activity.repo ?? "oscar-portfolio"} · {activity.message}
        </Link>
      ) : (
        <span className="font-mono text-xs text-white/72 sm:text-sm">
          {activity?.repo ?? "oscar-portfolio"} · {activity?.message ?? "Active development"}
        </span>
      )}
      <span className="ml-auto font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
        {relativeTime}
      </span>
    </motion.div>
  );
}
