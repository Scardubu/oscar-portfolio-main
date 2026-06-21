// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// lib/monitoring.ts - Web Vitals monitoring

import { trackEvent } from '@/app/lib/analytics';

// Web Vitals metric type. Structurally compatible with the `NextWebVitalsMetric`
// that `useReportWebVitals` (next/web-vitals) passes to its callback: the core
// web-vital variant carries `rating`/`delta`, while the Next.js custom metrics
// ('Next.js-hydration', '…-render', etc.) only carry id/name/value/label — so
// rating, delta, and label are optional here.
interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  label?: string;
}

/**
 * Report Web Vitals to analytics.
 * Integrates with Vercel Analytics custom events. Consumed by the client-side
 * `<WebVitals />` reporter, which subscribes via `useReportWebVitals`.
 */
export function reportWebVitals(metric: WebVitalMetric) {
  trackEvent('Performance', 'WebVital', metric.name, Math.round(metric.value), {
    metric_id: metric.id,
    metric_rating: metric.rating,
    metric_delta: typeof metric.delta === 'number' ? Math.round(metric.delta) : undefined,
    metric_label: metric.label,
    non_interaction: true,
  });
}

/**
 * Performance thresholds based on Core Web Vitals
 */
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  INP: {
    good: 200,
    needsImprovement: 500,
  },
} as const;

/**
 * Get performance rating based on metric value
 */
export function getPerformanceRating(
  metricName: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName];

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}
