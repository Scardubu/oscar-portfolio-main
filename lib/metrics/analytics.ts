/// lib/metrics/analytics.ts

import { trackEvent } from '@/app/lib/analytics';

const seenMetricViews = new Set<string>();

export function trackMetricView(metricId: string) {
  if (typeof window === 'undefined' || seenMetricViews.has(metricId)) return;

  seenMetricViews.add(metricId);

  trackEvent('Portfolio', 'MetricView', metricId, undefined, {
    metric_id: metricId,
    non_interaction: true,
  });
}
