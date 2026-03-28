// components/LiveActivityBar.tsx
"use client";
import { useEffect, useState } from "react";
interface Activity { message: string; repo: string; time: string | null; }

export function LiveActivityBar() {
  const [activity, setActivity] = useState<Activity | null>(null);
  useEffect(() => {
    fetch("/api/activity").then(r => r.json()).then(setActivity);
  }, []);
  if (!activity) return null;
  const relative = activity.time
    ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        Math.round((new Date(activity.time).getTime() - Date.now()) / 60000), "minute"
      )
    : null;
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
      <span className="live-dot" aria-hidden="true" />
      <span>
        {activity.message}
        {relative && <span className="text-zinc-600 ml-2">{relative}</span>}
      </span>
    </div>
  );
}