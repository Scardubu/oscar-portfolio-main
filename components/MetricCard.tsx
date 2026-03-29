import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  body: string;
  icon?: ReactNode;
  breath?: boolean;
}

export function MetricCard({ label, body, icon, breath = false }: Readonly<MetricCardProps>) {
  return (
    <article className={`metric-card h-full p-6 ${breath ? 'metric-breath' : ''}`} aria-label={label}>
      {icon ? <div className="mb-[var(--space-4)] text-[var(--color-accent)]">{icon}</div> : null}
      <p className="label mb-[var(--space-2)] text-white/45">{label}</p>
      <p className="text-sm leading-7 text-white/68">{body}</p>
    </article>
  );
}
