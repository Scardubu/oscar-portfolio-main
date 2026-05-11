// components/MetricCard.tsx — CONVICTION ENGINE v22.0
// Mobile-native: consistent spacing scale, accessible article structure.
// Used as a standalone card in any section needing a labelled metric display.

import type { CSSProperties, ReactNode } from 'react';

type MetricAccent = 'teal' | 'amber' | 'live' | 'accent' | 'wip';

const ACCENT_COLOR: Record<MetricAccent, string> = {
  teal:   'var(--color-film-teal)',
  amber:  'var(--color-film-amber)',
  live:   'var(--color-live)',
  accent: 'var(--color-accent)',
  wip:    'var(--color-warning)',
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
  const accentColor = accent ? ACCENT_COLOR[accent] : 'var(--color-border)';

  const borderStyle: CSSProperties = { borderTopColor: accentColor };
  const labelStyle:  CSSProperties = accent
    ? { color: accentColor }
    : { color: 'var(--color-text-muted)' };

  return (
    <article
      className={`glass glass-medium h-full border-t-2 p-4 sm:p-5 lg:p-6${breath ? ' metric-breath' : ''}`}
      aria-label={label}
      data-metric="true"
      style={borderStyle}
    >
      {icon ? (
        <div
          className="mb-3"
          style={{ color: accentColor }}
          aria-hidden="true"
          role="presentation"
        >
          {icon}
        </div>
      ) : null}

      <p
        className="mb-2 font-mono text-[10px] tracking-widest uppercase"
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