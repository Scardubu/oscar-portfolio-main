import { cn } from '@/lib/utils';
import type { MetricType } from '@/lib/portfolio-data';

interface MetricBadgeProps {
  type:       MetricType;
  label?:     string;
  className?: string;
}

const CONFIG: Record<MetricType, { label: string; colorClass: string }> = {
  live:        { label: 'Live',        colorClass: 'metric-live'        },
  documented:  { label: 'Documented',  colorClass: 'metric-documented'  },
  backtested:  { label: 'Backtested',  colorClass: 'metric-backtested'  },
  snapshot:    { label: 'Snapshot',    colorClass: 'metric-snapshot'    },
};

export function MetricBadge({ type, label, className }: Readonly<MetricBadgeProps>) {
  const cfg  = CONFIG[type];
  const text = label ?? cfg.label;

  return (
    <span
      className={cn('badge text-caption metric-dot', cfg.colorClass, className)}
      aria-label={`Metric source: ${text}`}
    >
      {text}
    </span>
  );
}

// ── MetricValue — number + label + optional badge ─────────────────────────────

interface MetricValueProps {
  value:      string | number;
  label:      string;
  type?:      MetricType;
  size?:      'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<MetricValueProps['size']>, string> = {
  sm: 'text-metric',
  md: 'text-metric',
  lg: 'text-kinetic-metric',
};

export function MetricValue({
  value,
  label,
  type,
  size      = 'md',
  className,
}: Readonly<MetricValueProps>) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span
        className={cn(
          SIZE_CLASS[size],
          'font-mono font-extrabold',
          type === 'live' ? 'text-gradient-accent' : 'text-primary'
        )}
        aria-label={`${value} — ${label}`}
      >
        {value}
      </span>
      <span className="text-caption text-muted">{label}</span>
      {type && (
        <MetricBadge type={type} className="mt-1 self-start" />
      )}
    </div>
  );
}