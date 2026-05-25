// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// lib/monitoring.ts - Web Vitals monitoring

import { trackEvent } from '@/app/lib/analytics';

// Web Vitals metric type (compatible with Next.js built-in types)
interface WebVitalMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

/**
 * Report Web Vitals to analytics
 * Integrates with Vercel Analytics custom events.
 */
export function reportWebVitals(metric: WebVitalMetric) {
  trackEvent('Performance', 'WebVital', metric.name, Math.round(metric.value), {
    metric_id: metric.id,
    metric_rating: metric.rating,
    metric_delta: Math.round(metric.delta),
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
