// components/reusable/MetricBadge.tsx
// ─────────────────────────────────────────────────────────────────────
// Displays a stat (value + label) with coloured dot indicator.
// Variant drives dot colour + background via CSS token classes.
// ─────────────────────────────────────────────────────────────────────
import type { MetricType } from '@/lib/data'
 
interface MetricBadgeProps {
  value:   string
  label:   string
  type?:   MetricType
  size?:   'sm' | 'md' | 'lg'
  className?: string
}
 
const typeLabel: Record<MetricType, string> = {
  live:        'Live',
  documented:  'Documented',
  backtested:  'Backtested',
  snapshot:    'Snapshot',
}
 
export function MetricBadge({
  value,
  label,
  type = 'live',
  size = 'md',
  className = '',
}: MetricBadgeProps) {
  const sizeClasses = {
    sm: 'gap-1 px-2 py-1',
    md: 'gap-1.5 px-3 py-1.5',
    lg: 'gap-2 px-4 py-2',
  }[size]
 
  const valueSizeClass = {
    sm: 'text-sm font-bold',
    md: 'text-base font-bold',
    lg: 'text-lg font-bold',
  }[size]
 
  return (
    <div
      className={`
        inline-flex flex-col items-start rounded-xl
        border border-white/8 bg-white/3
        ${sizeClasses} ${className}
      `}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Top row: dot + type label */}
      <div className={`flex items-center gap-1 metric-${type} metric-dot`}>
        <span className="text-caption">{typeLabel[type]}</span>
      </div>
 
      {/* Value */}
      <span
        className={`text-metric ${valueSizeClass} tabular-nums`}
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </span>
 
      {/* Label */}
      <span className="text-caption mt-0.5">{label}</span>
    </div>
  )
}