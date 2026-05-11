'use client';
// components/SystemStatus.tsx — CONVICTION ENGINE v22.0
// Live operational status pill for the Navbar.
// Fetches /api/live-metrics → systemStatus field.
// States: loading | operational (teal pulse) | degraded (amber) | down (red)
// Falls back to 'operational' silently on network failure — never shows a broken pill.
// Pulse animation: CSS-only keyframe, zero JS tick overhead on mobile.

import { useEffect, useState } from 'react';

type StatusValue = 'operational' | 'degraded' | 'down';

const STATUS_CONFIG: Record<StatusValue, { label: string; color: string; glow: string }> = {
  operational: {
    label: 'All systems operational',
    color: 'var(--color-film-teal)',
    glow:  'var(--color-film-teal-glow)',
  },
  degraded: {
    label: 'Degraded performance',
    color: 'var(--color-warning)',
    glow:  'var(--color-film-amber-glow)',
  },
  down: {
    label: 'Service disruption',
    color: 'var(--color-danger)',
    glow:  'oklch(60% 0.22 25 / 0.18)',
  },
};

export function SystemStatus() {
  const [status, setStatus]   = useState<StatusValue>('operational');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    fetch('/api/live-metrics')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { systemStatus?: string } | null) => {
        if (cancelled) return;
        const raw = data?.systemStatus ?? 'operational';
        if (raw === 'operational' || raw === 'degraded' || raw === 'down') {
          setStatus(raw as StatusValue);
        }
      })
      .catch(() => {
        // Network failure — remain on operational default.
      });

    return () => { cancelled = true; };
  }, []);

  // Avoid hydration mismatch on status pill (SSR always operational)
  if (!mounted) {
    return (
      <span
        className="relative inline-flex items-center gap-1.5 select-none"
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-film-teal)' }} />
      </span>
    );
  }

  const cfg = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      aria-label={cfg.label}
      title={cfg.label}
      className="relative inline-flex items-center gap-1.5 select-none font-mono text-[10px] tracking-widest uppercase"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {/* CSS-only pulse dot — zero JS ticks */}
      <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{
            background: cfg.color,
            animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
          }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ background: cfg.color }}
        />
      </span>

      <span className="hidden sm:inline">
        {status === 'operational'
          ? 'Systems OK'
          : status === 'degraded'
            ? 'Degraded'
            : 'Down'}
      </span>
    </span>
  );
}