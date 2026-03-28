import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/data/portfolio";

const statusConfig: Record<
  ProjectStatus,
  { label: string; className: string; pulse: boolean }
> = {
  live:         { label: "Live",         className: "bg-[var(--metric-live-dim)] text-[var(--metric-live)] border-[var(--metric-live-border)]",             pulse: true  },
  documented:   { label: "Documented",   className: "bg-[var(--metric-documented-dim)] text-[var(--metric-documented)] border-[var(--metric-documented-border)]", pulse: false },
  backtested:   { label: "Backtested",   className: "bg-[var(--metric-backtested-dim)] text-[var(--metric-backtested)] border-[var(--metric-backtested-border)]", pulse: false },
  snapshot:     { label: "Snapshot",     className: "bg-[var(--metric-snapshot-dim)] text-[var(--metric-snapshot)] border-[var(--metric-snapshot-border)]",       pulse: false },
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
