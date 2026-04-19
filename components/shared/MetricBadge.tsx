import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/data/portfolio";

const statusConfig: Record<ProjectStatus, { label: string; className: string; pulse: boolean }> = {
  live: {
    label: 'Live',
    className: 'bg-(--metric-live-dim) text-(--metric-live) border-(--metric-live-border)',
    pulse: true,
  },
  documented: {
    label: 'Documented',
    className:
      'bg-(--metric-documented-dim) text-(--metric-documented) border-(--metric-documented-border)',
    pulse: false,
  },
  backtested: {
    label: 'Backtested',
    className:
      'bg-(--metric-backtested-dim) text-(--metric-backtested) border-(--metric-backtested-border)',
    pulse: false,
  },
  snapshot: {
    label: 'Snapshot',
    className:
      'bg-(--metric-snapshot-dim) text-(--metric-snapshot) border-(--metric-snapshot-border)',
    pulse: false,
  },
};

interface MetricBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function MetricBadge({ status, className }: MetricBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "badge",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "live-dot",
          config.pulse && "animate-ping-glow"
        )}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
