/**
 * lib/data/blog-articles.ts  — v2
 *
 * All metrics verified against live article content (2026-03-23).
 *
 * Uptime article (newly verified from live article):
 *   Before: ~97–98% uptime, 80+ incidents/month, p95 ~800ms
 *   After:  99.9%+ over following quarter, ~2/month, p95 ~150–200ms
 *
 * FastAPI article (newly verified):
 *   Independently confirms 73% cache hit rate — two-source confirmation.
 *   Confirms 450ms → 87ms p95 latency journey from Flask migration.
 */

import { blogUrl }       from '@/lib/config'
import type { BlogPost } from '@/lib/types'

// ─── Tier 1 — Staff+ signal ───────────────────────────────────────────────────

export const TIER_1_ARTICLES: BlogPost[] = [
  {
    slug:              'ensemble-models-production',
    title:             'Ensemble Models in Production: How We Achieved 71% Accuracy',
    tier:              1,
    system_tag:        'sabiscore',
    key_metric:        '64% → 71%',
    metric_badge:      'documented',
    read_time_minutes: 11,
    published_at:      '2024-11-25',
    excerpt:
      'The stacking pipeline that took SabiScore from 64% to 71% — OOF leakage prevention, why LogisticRegression(C=0.1) beat a neural meta-learner, Brier score from 0.19 to 0.15, and the 73% Redis cache hit rate from production.',
    tags: ['xgboost', 'lightgbm', 'ensemble', 'python'],
  },
  {
    slug:              'fastapi-ml-engineers',
    title:             'FastAPI for ML Engineers: Serving Models with <100ms Latency',
    tier:              1,
    system_tag:        'sabiscore',
    key_metric:        '450ms → 87ms',
    metric_badge:      'documented',
    read_time_minutes: 10,
    published_at:      '2024-11-22',
    excerpt:
      'The full migration from Flask to FastAPI that drove p95 latency from 450ms to 87ms. Async model loading, Redis caching (73% hit rate from production), Prometheus metrics, and the uvicorn config that holds under load.',
    tags: ['fastapi', 'python', 'api', 'performance'],
  },
  {
    slug:              'mlops-999-uptime-transformation-case-study',
    title:             '0 to 99.9% Uptime: Turning a Flaky ML API Into a Reliable Product in 4 Weeks',
    tier:              1,
    system_tag:        'sabiscore',
    key_metric:        '80+ incidents → 2/month',
    metric_badge:      'documented',
    read_time_minutes: 12,
    published_at:      '2024-12-05',
    excerpt:
      '80+ incidents/month, p95 at 800ms, founders calling it a reliability crisis. Four weeks later: 99.9%+ uptime, p95 under 200ms, 2 incidents/month. Week-by-week playbook: instrumentation, topology redesign, monitoring thresholds, zero-downtime deploys.',
    tags: ['mlops', 'uptime', 'reliability', 'monitoring'],
  },
  {
    slug:              'redis-caching-patterns-ml-apis',
    title:             'Redis Caching Patterns for ML APIs',
    tier:              1,
    system_tag:        'sabiscore',
    key_metric:        '73% cache hit rate',
    metric_badge:      'documented',
    read_time_minutes: 7,
    published_at:      '2024-11-18',
    excerpt:
      'Production Redis patterns for ML inference: cache key on match_id + model_version hash, TTL design, invalidation on retrain. The 73% hit rate is confirmed independently in both this article and the ensemble deep dive.',
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
