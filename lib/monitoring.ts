// CONVICTION ENGINE v8.0 — FULL REPLACEMENT
// lib/monitoring.ts - Web Vitals monitoring

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
 * Integrates with Vercel Analytics and Google Analytics
 */
export function reportWebVitals(metric: WebVitalMetric) {
  // Send to Vercel Analytics (automatically handled by @vercel/analytics)
  // The SpeedInsights component handles this

  // Send to Google Analytics if configured
  if (typeof window !== 'undefined') {
    const win = window as Window & {
      gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
    };

    if (win.gtag) {
      win.gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
        // Custom dimensions for better analysis
        metric_rating: metric.rating,
        metric_delta: Math.round(metric.delta),
      });
    }
  }
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
