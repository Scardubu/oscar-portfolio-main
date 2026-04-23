// CONVICTION ENGINE v9.0 — FULL REPLACEMENT
// components/SystemStatus.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Live operational status pill for the Navbar.
// Fetches from /api/live-metrics (already exists) to read systemStatus field.
// States: loading → operational (green pulse) | degraded (amber) | down (red)
// Falls back to "operational" if fetch fails (never show a broken pill in nav).
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useEffect, useState } from 'react';

type StatusValue = 'operational' | 'degraded' | 'down';

interface StatusConfig {
  label: string;
  color: string; // Tailwind/CSS class for the dot
  pulse: string; // Tailwind/CSS class for the animated ring
}

const STATUS_CONFIG: Record<StatusValue, StatusConfig> = {
  operational: {
    label: 'All systems operational',
    color: 'bg-(--color-live)',
    pulse: 'animate-ping bg-(--color-live)',
  },
  degraded: {
    label: 'Degraded performance',
    color: 'bg-amber-400',
    pulse: 'animate-ping bg-amber-400',
  },
  down: {
    label: 'Service disruption',
    color: 'bg-red-500',
    pulse: 'animate-ping bg-red-500',
  },
};

export function SystemStatus() {
  const [status, setStatus] = useState<StatusValue>('operational');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/live-metrics', { next: { revalidate: 60 } } as RequestInit)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { systemStatus?: string } | null) => {
        if (cancelled) return;
        const raw = data?.systemStatus ?? 'operational';
        if (raw === 'operational' || raw === 'degraded' || raw === 'down') {
          setStatus(raw as StatusValue);
        }
      })
      .catch(() => {
        // Network failure — stay on default 'operational' pill.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cfg = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      aria-label={cfg.label}
      title={cfg.label}
      className="relative inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-(--color-text-muted) uppercase select-none"
    >
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.pulse}`}
        />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cfg.color}`} />
      </span>
      <span className="hidden sm:inline">
        {status === 'operational' ? 'Systems OK' : status === 'degraded' ? 'Degraded' : 'Down'}
      </span>
    </span>
  );
}
