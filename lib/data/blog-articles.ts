/**
 * lib/data/blog-articles.ts  — v2
 *
 * Article metadata for portfolio cross-links. Operational measurements remain
 * private unless an inspectable report and measurement window are linked.
 */

import { blogUrl }       from '@/lib/config'
import type { BlogPost } from '@/lib/types'

// ─── Tier 1 — Staff+ signal ───────────────────────────────────────────────────

export const TIER_1_ARTICLES: BlogPost[] = [
  {
    slug:              'ensemble-models-production',
    title:             'Ensemble Models in Production: Designing the Evaluation Path',
    tier:              1,
    system_tag:        'sabiscore',
    key_metric:        'Chronological evaluation',
    metric_badge:      'documented',
    read_time_minutes: 11,
    published_at:      '2024-11-25',
    excerpt:
      'The stacking pipeline behind SabiScore: out-of-fold leakage prevention, calibrated comparison, model-versioned caching, and a deterministic fallback when inference is unavailable.',
    tags: ['xgboost', 'lightgbm', 'ensemble', 'python'],
  },
  {
    slug:              'fastapi-ml-engineers',
    title:             'FastAPI for ML Engineers: Designing the Serving Path',
    tier:              1,
    system_tag:        'sabiscore',
    key_metric:        'Observable serving path',
    metric_badge:      'documented',
    read_time_minutes: 10,
    published_at:      '2024-11-22',
    excerpt:
      'Async model loading, model-versioned Redis caching, Prometheus metrics, and the serving configuration used to keep degraded behavior visible and recoverable.',
    tags: ['fastapi', 'python', 'api', 'performance'],
  },
  {
    slug:              'mlops-999-uptime-transformation-case-study',
    title:             'Turning a Flaky ML API Into a Recoverable Service',
    tier:              1,
    system_tag:        'sabiscore',
    key_metric:        'Evidence-led recovery',
    metric_badge:      'documented',
    read_time_minutes: 12,
    published_at:      '2024-12-05',
    excerpt:
      'A week-by-week playbook covering instrumentation, topology redesign, monitoring thresholds, staged deployment, and the evidence needed to make a recovery decision.',
    tags: ['mlops', 'uptime', 'reliability', 'monitoring'],
  },
  {
    slug:              'redis-caching-patterns-ml-apis',
    title:             'Redis Caching Patterns for ML APIs',
    tier:              1,
    system_tag:        'sabiscore',
    key_metric:        'Versioned cache contract',
    metric_badge:      'documented',
    read_time_minutes: 7,
    published_at:      '2024-11-18',
    excerpt:
      'Redis patterns for ML inference: cache keys based on match and model identity, bounded TTLs, and precise invalidation after retraining.',
    tags: ['redis', 'caching', 'performance', 'ml-apis'],
  },
]

// ─── Tier 2 — Supporting signal (blog index only) ────────────────────────────

export const TIER_2_SLUGS: readonly string[] = [
  'africa-ai-infra-stack-for-founders',
  'how-i-built-ai-sports-prediction-platform-sabiscore',
  'production-ml-systems-2024',
  'mlops-playbook-999-uptime-production-ml-systems',
  'ai-in-nigeria-opportunities',
] as const

// ─── Tier 3 — Suppress from portfolio surfaces ───────────────────────────────

export const TIER_3_SLUGS: readonly string[] = [
  'your-life-in-2030-ai-realistic-forecast',
  'side-project-to-mrr-12-month-playbook',
  'ai-demystified-what-machine-learning-actually-does',
  'nigeria-ml-engineer-mrr-playbook',
  'building-in-nigeria-shipping-globally-remote-ml-engineer',
  'fastapi-deploy-production-5-min',
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTier1ForSystem(systemId: string): BlogPost | undefined {
  return TIER_1_ARTICLES.find(a => a.system_tag === systemId)
}

export function getTier1Articles(): BlogPost[] {
  return TIER_1_ARTICLES
}

export function isTier3(slug: string): boolean {
  return (TIER_3_SLUGS as readonly string[]).includes(slug)
}

export function isTier1(slug: string): boolean {
  return TIER_1_ARTICLES.some(a => a.slug === slug)
}

export function getArticleUrl(slug: string): string {
  return blogUrl(slug)
}
