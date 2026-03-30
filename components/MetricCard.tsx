import type { CSSProperties, ReactNode } from 'react';

type MetricAccent = 'cyan' | 'indigo' | 'success';

const accentColorMap: Record<MetricAccent, string> = {
  cyan: 'var(--color-cyan)',
  indigo: 'var(--color-accent-hover)',
  success: 'var(--color-success)',
};

interface MetricCardProps {
  label: string;
  body: string;
  icon?: ReactNode;
  breath?: boolean;
  accent?: MetricAccent;
}

export function MetricCard({
  label,
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
      className={`metric-card h-full p-6 ${breath ? 'metric-breath' : ''}`}
      aria-label={label}
    >
      {icon ? <div className="mb-[var(--space-4)] text-[var(--color-accent)]">{icon}</div> : null}
      <p className="label mb-[var(--space-2)]" style={labelStyle}>
        {label}
      </p>
      <p className="text-sm leading-7 text-white/65">{body}</p>
    </article>
  );
}
