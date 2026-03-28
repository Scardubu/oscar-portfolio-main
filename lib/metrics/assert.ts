/// lib/metrics/assert.ts

export function assertMetricIntegrity(metric: {
  value: string
  label: string
}) {
  if (process.env.NODE_ENV === 'production') return

  // ❌ Block fake percentages
  if (metric.value === '100%') {
    throw new Error(`[MetricIntegrity] Forbidden value: 100%`)
  }

  // ❌ Must contain numeric signal
  const hasNumber = /\d/.test(metric.value)
  if (!hasNumber) {
    throw new Error(
      `[MetricIntegrity] Value must contain a number: "${metric.value}"`
    )
  }

  // ❌ Prevent vague labels
  if (metric.label.length < 3) {
    throw new Error(`[MetricIntegrity] Label too vague`)
  }
}
