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
  const accentColor = accent ? ACCENT_COLOR[accent] : undefined;

  const borderStyle: CSSProperties | undefined = accentColor
    ? { borderTopColor: accentColor }
    : undefined;

  const labelStyle: CSSProperties | undefined = accentColor
    ? { color: accentColor }
    : undefined;

  return (
    <article
      className={`glass glass-medium metric-card h-full border-t-2 p-5 sm:p-6 ${breath ? 'metric-breath' : ''}`}
      aria-label={label}
      data-pillar="true"
      // eslint-disable-next-line no-restricted-syntax
      style={borderStyle}
    >
      {icon ? (
        <div
          className="mb-4"
          style={{ color: 'var(--color-accent)' }}
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}

      <p
        className="label mb-2 text-[10px] tracking-widest uppercase font-mono"
        // eslint-disable-next-line no-restricted-syntax
        style={labelStyle}
      >
        {label}
      </p>

      {headline ? (
        <p className="mb-2 text-base font-semibold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
          {headline}
        </p>
      ) : null}

      <p className="text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>
        {body}
      </p>
    </article>
  );
}