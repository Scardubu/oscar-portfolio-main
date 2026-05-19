'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface Metric {
  label: string;
  value: number; // 0–100
  unit?: string;
  color?: string; // CSS color or variable
}

interface LiquidGlassMetricBarProps {
  metrics: Metric[];
  title?: string;
  className?: string;
}

export function LiquidGlassMetricBar({
  metrics,
  title,
  className = '',
}: Readonly<LiquidGlassMetricBarProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={ref} className={`glass-medium rounded-[var(--radius-xl)] p-5 sm:p-6 ${className}`}>
      {title && (
        <p className="text-color-text-muted mb-4 font-mono text-[10px] tracking-widest uppercase">
          {title}
        </p>
      )}

      <div className="space-y-4">
        {metrics.map((metric) => {
          const accentColor = metric.color ?? 'var(--color-film-teal)';

          return (
            <div key={metric.label} className="flex min-h-[44px] flex-col justify-center gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-color-text-primary text-sm font-medium">{metric.label}</span>
                <span
                  className="font-mono text-sm font-semibold"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ color: accentColor }}
                >
                  {metric.value}
                  {metric.unit ?? '%'}
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="bg-color-border h-[3px] w-full overflow-hidden rounded-full"
                aria-label={`${metric.label}: ${metric.value}${metric.unit ?? '%'}`}
                role="progressbar"
                aria-valuenow={metric.value}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <m.div
                  className="h-full rounded-full"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ background: accentColor }}
                  initial={{ width: '0%' }}
                  animate={inView ? { width: `${metric.value}%` } : { width: '0%' }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 60, damping: 18, mass: 1.2 }
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
