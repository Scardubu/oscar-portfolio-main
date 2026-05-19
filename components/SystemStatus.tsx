'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Live operational status pill for the Navbar.
// Fetches /api/live-metrics → systemStatus field.
// States: loading | operational (teal pulse) | degraded (amber) | down (red)
// Falls back to 'operational' silently on network failure — never shows a broken pill.
// Pulse animation: CSS-only keyframe, zero JS tick overhead on mobile.

import { useEffect, useState } from 'react';

import { StatusPulseDot } from '@/components/shared/StatusPulseDot';

type StatusValue = 'operational' | 'degraded' | 'down';

const STATUS_CONFIG: Record<StatusValue, { label: string; color: string }> = {
  operational: {
    label: 'All systems operational',
    color: 'var(--color-film-teal)',
  },
  degraded: {
    label: 'Degraded performance',
    color: 'var(--color-warning)',
  },
  down: {
    label: 'Service disruption',
    color: 'var(--color-danger)',
  },
};

export function SystemStatus({ showLabel = true }: { showLabel?: boolean } = {}) {
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
        <StatusPulseDot color="var(--color-film-teal)" pulseDuration="1.4s" />
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
      <StatusPulseDot color={cfg.color} pulseDuration="1.4s" />

      {showLabel && (
        <span className="hidden sm:inline">
          {status === 'operational'
            ? 'Systems OK'
            : status === 'degraded'
              ? 'Degraded'
              : 'Down'}
        </span>
      )}
    </span>
  );
}
