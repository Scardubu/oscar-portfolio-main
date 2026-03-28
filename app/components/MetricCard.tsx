'use client';

import { memo } from 'react';
import { GlassCard } from './GlassCard';

interface MetricCardProps {
  label: string;
  heading: string;
  body: string;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

/**
 * MetricCard — V10
 *
 * Upgrades:
 * - Removed inline styles → full design system compliance
 * - Added semantic <article>
 * - Added variant system
 * - Memoized for performance
 * - Fully token-driven
 */
export const MetricCard = memo(function MetricCard({
  label,
  heading,
  body,
  variant = 'default',
  className = '',
}: MetricCardProps) {
  return (
    <article aria-label={heading}>
      <GlassCard
        level="full"
        chromatic={variant === 'featured'}
        className={`metric-card ${variant} ${className}`}
      >
        <div className="metric-card-inner">
          <span className="metric-label">
            {label}
          </span>

          <h3 className="metric-heading">
            {heading}
          </h3>

          <p className="metric-body">
            {body}
          </p>
        </div>
      </GlassCard>
    </article>
  );
});