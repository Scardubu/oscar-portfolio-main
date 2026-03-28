/// lib/metrics/registry.ts

import type { BadgeType } from '@/lib/types'

export interface MetricDefinition {
  id: string
  value: string
  label: string
  sublabel?: string

  badge: BadgeType
  sourceLabel: string
  sourceHref?: string

  // V5 additions
  category?: 'performance' | 'reliability' | 'infra' | 'ml'
  lastUpdated?: string
  confidence?: 'high' | 'medium' | 'low'
}

export const METRICS: Record<string, MetricDefinition> = {
  model_accuracy_v1: {
    id: 'model_accuracy_v1',
    value: '71%',
    label: 'prediction accuracy',
    sublabel: 'ensemble model — production',
    badge: 'live',
    sourceLabel: 'ensemble-models-production',
    category: 'ml',
    confidence: 'high',
  },

  api_latency_p95: {
    id: 'api_latency_p95',
    value: '87ms',
    label: 'p95 latency',
    sublabel: 'global edge network',
    badge: 'live',
    sourceLabel: 'vercel-edge-observability',
    category: 'performance',
  },
}
