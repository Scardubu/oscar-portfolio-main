/// lib/metrics/analytics.ts

const seenMetricViews = new Set<string>()

export function trackMetricView(metricId: string) {
  if (typeof window === 'undefined' || seenMetricViews.has(metricId)) return

  seenMetricViews.add(metricId)

  const win = window as Window & {
    gtag?: (
      command: string,
      action: string,
      params: Record<string, unknown>
    ) => void
  }

  win.gtag?.('event', 'metric_view', {
    metric_id: metricId,
    non_interaction: true,
  })
}
