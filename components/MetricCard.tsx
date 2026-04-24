import type { CSSProperties, ReactNode } from 'react';

type MetricAccent = 'live' | 'accent' | 'wip';

const accentColorMap: Record<MetricAccent, string> = {
  live: 'var(--color-live)',
  accent: 'var(--color-accent)',
  wip: 'var(--color-wip)',
};

interface MetricCardProps {
  label: string;
  headline?: string;
  body: string;
  icon?: ReactNode;
  breath?: boolean;
  accent?: MetricAccent;
}

export function MetricCard({
  label,
  headline,
  body,
  icon,
  breath = false,
  accent,
}: Readonly<MetricCardProps>) {
  const labelStyle: CSSProperties | undefined = accent
    ? { color: accentColorMap[accent] }
    : undefined;

  return (
    <article
      className={`glass glass-medium metric-card card-lift h-full border-t-2 p-6 ${breath ? 'metric-breath' : ''}`}
      aria-label={label}
      data-pillar="true"
      // eslint-disable-next-line no-restricted-syntax
      style={accent ? { borderTopColor: accentColorMap[accent] } : undefined}
    >
      {icon ? <div className="mb-(--space-4) text-(--color-accent)">{icon}</div> : null}
      <p
        className="label mb-(--space-2)"
        // eslint-disable-next-line no-restricted-syntax
        style={labelStyle}
      >
        {label}
      </p>
      {headline ? <p className="mb-2 text-base font-semibold text-white">{headline}</p> : null}
      <p className="text-sm leading-7 text-white/65">{body}</p>
    </article>
  );
}
