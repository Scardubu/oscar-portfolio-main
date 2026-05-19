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

interface SystemStatusProps {
  showLabel?: boolean;
  labelMode?: 'short' | 'full';
}

const STATUS_CONFIG: Record<StatusValue, { label: string; shortLabel: string; color: string }> = {
  operational: {
    label: 'All systems operational',
    shortLabel: 'Systems OK',
    color: 'var(--color-film-teal)',
  },
  degraded: {
    label: 'Degraded performance',
    shortLabel: 'Degraded',
    color: 'var(--color-warning)',
  },
  down: {
    label: 'Service disruption',
    shortLabel: 'Down',
    color: 'var(--color-danger)',
  },
};

export function SystemStatus({ showLabel = true, labelMode = 'short' }: SystemStatusProps = {}) {
  const [status, setStatus] = useState<StatusValue>('operational');
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

    return () => {
      cancelled = true;
    };
  }, []);

  // Avoid hydration mismatch on status pill (SSR always operational)
  if (!mounted) {
    return (
      <span className="relative inline-flex items-center gap-1.5 select-none" aria-hidden="true">
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
      className="text-color-text-muted relative inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase select-none"
    >
      <StatusPulseDot color={cfg.color} pulseDuration="1.4s" />

      {showLabel && (
        <span className={labelMode === 'full' ? 'inline' : 'hidden sm:inline'}>
          {labelMode === 'full' ? cfg.label : cfg.shortLabel}
        </span>
      )}
    </span>
  );
}
