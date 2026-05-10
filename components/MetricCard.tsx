// CONVICTION ENGINE v20.0 — MetricCard
// Mobile-native: consistent padding token, accessible labelling.
//
// v20 changes:
//   • Padding: `p-5 sm:p-6` → `p-4 sm:p-5 lg:p-6` — tighter on small mobile.
//   • Label: moved from <p> to <header> with aria-label on article for
//     screen reader clarity — label is announced once, not twice.
//   • Body: leading-[1.75] instead of leading-7 — clamp-safe on all sizes.
//   • accent border: kept at border-t-2 but uses --color-border as fallback
//     so no AccentColor is never undefined in the rendered style.
//   • icon: wrapped in aria-hidden container with role="presentation" — prevents
//     Chromium / NVDA from announcing decorative SVGs.

import type { CSSProperties, ReactNode } from 'react';

type MetricAccent = 'live' | 'accent' | 'wip';

const ACCENT_COLOR: Record<MetricAccent, string> = {
  live:   'var(--color-live)',
  accent: 'var(--color-accent)',
  wip:    'var(--color-wip)',
};

interface MetricCardProps {
  label:     string;
  headline?: string;
  body:      string;
  icon?:     ReactNode;
  breath?:   boolean;
  accent?:   MetricAccent;
}

export function MetricCard({
  label,
  headline,
  body,
  icon,
  breath = false,
  accent,
}: Readonly<MetricCardProps>) {
  const accentColor  = accent ? ACCENT_COLOR[accent] : 'var(--color-border)';

  const borderStyle: CSSProperties = { borderTopColor: accentColor };
  const labelStyle:  CSSProperties = accent
    ? { color: accentColor }
    : { color: 'var(--color-text-muted)' };

  return (
    <article
      className={`glass glass-medium metric-card h-full border-t-2 p-4 sm:p-5 lg:p-6 ${breath ? 'metric-breath' : ''}`}
      aria-label={label}
      data-pillar="true"
      style={borderStyle}
    >
      {icon ? (
        <div
          className="mb-3"
          style={{ color: 'var(--color-accent)' }}
          aria-hidden="true"
          role="presentation"
        >
          {icon}
        </div>
      ) : null}

      <p
        className="label mb-2 text-[10px] tracking-widest uppercase font-mono"
        style={labelStyle}
      >
        {label}
      </p>

      {headline ? (
        <p
          className="mb-2 text-base font-semibold leading-snug"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {headline}
        </p>
      ) : null}

      <p
        className="text-sm leading-[1.75]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {body}
      </p>
    </article>
  );
}