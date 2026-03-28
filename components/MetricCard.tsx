import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  body: string;
  icon?: ReactNode;
  breath?: boolean;
}

export function MetricCard({ label, body, icon, breath = false }: MetricCardProps) {
  return (
    <article
      className="h-full"
      aria-label={label}
    >
      <div className={`metric-card-inner glass-full h-full p-5 ${breath ? "metric-card-breath" : ""}`}>
        {icon ? <div className="mb-4 text-white/70">{icon}</div> : null}
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.26em] text-white/50">{label}</p>
        <p className="mt-4 text-sm leading-7 text-white/72 sm:text-base">{body}</p>
      </div>
    </article>
  );
}
