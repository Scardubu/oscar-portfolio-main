'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Architecture depth signal: four production patterns, each expandable.
// Mobile-native: tap to expand, 48px touch targets, spring physics.
// Migrated from legacy @/lib/motion → @/lib/motionVariants.

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';

import { cardReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

/* ── Pattern data ──────────────────────────────────────────────────────────── */
const PRODUCTION_PATTERNS = [
  {
    id: 'mlops',
    caption: 'ML SYSTEMS',
    title: 'Ensemble inference with live drift monitoring',
    description:
      "SabiScore uses three models in production — XGBoost, LightGBM, and CatBoost — with Prometheus tracking feature drift against training baselines. When any model's AUC drops below threshold, the ensemble weight shifts automatically without redeployment. MTTD went from reactive-alerting hours to 45% improvement over baseline.",
    accent: 'teal',
  },
  {
    id: 'rls',
    caption: 'COMPLIANCE · FINTECH',
    title: 'Row-Level Security at the database engine',
    description:
      "TaxBridge enforces tenant isolation at the PostgreSQL engine, not the application layer. NRS audit scrutiny requires mathematical proof that one TIN's data cannot be read by another session. RLS policies fire before any query reaches application code — even a full application compromise cannot leak cross-tenant records.",
    accent: 'cyan',
  },
  {
    id: 'zk',
    caption: 'CRYPTOGRAPHIC PROOF',
    title: 'Zero-knowledge proofs for document integrity',
    description:
      'Hashablanca generates ZK proofs for document hash sequences, allowing any verifier to confirm a document existed and was unmodified at a given timestamp — without revealing document contents. Critical for legal and financial evidence chains where confidentiality and verifiability are simultaneously required.',
    accent: 'violet',
  },
  {
    id: 'observability',
    caption: 'RELIABILITY · DEVOPS',
    title: 'Zero-downtime deploy with full observability',
    description:
      'Health checks, idempotent BullMQ queues, circuit breakers, and rate-limit scoping are baseline — not retrofitted after the first 3am incident. Blue-green deploys with automated rollback on SLO breach. OpenTelemetry traces from HTTP edge to DB query, with Grafana alerting on p99 latency regression within 60s.',
    accent: 'amber',
  },
] as const;

/* ── Icons ─────────────────────────────────────────────────────────────────── */
const ICONS: Record<string, React.FC<{ color: string }>> = {
  mlops: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="5" cy="14" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="14" cy="5" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="23" cy="14" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="14" cy="23" r="3" stroke={color} strokeWidth="1.5" />
      <path
        d="M8 12l3-5M17 7l3 5M20 16l-3 5M11 21l-3-5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  rls: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="12" width="20" height="12" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M9 12V9a5 5 0 0 1 10 0v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="18" r="2" fill={color} />
    </svg>
  ),
  zk: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3l10 5.5v11L14 25 4 19.5V8.5z" stroke={color} strokeWidth="1.5" />
      <circle cx="14" cy="14" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M14 10v8M10 14h8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  observability: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <polyline
        points="3,21 8,14 13,17 18,9 23,13 26,6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="14" r="1.5" fill={color} />
      <circle cx="18" cy="9" r="1.5" fill={color} />
      <circle cx="26" cy="6" r="1.5" fill={color} />
    </svg>
  ),
  amber: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="10" stroke={color} strokeWidth="1.5" />
      <path d="M14 8v6l4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const ACCENT: Record<string, { color: string; bg: string }> = {
  teal: { color: 'var(--color-film-teal)', bg: 'var(--color-film-teal-surface)' },
  cyan: { color: 'var(--color-cyan)', bg: 'var(--color-cyan-surface)' },
  violet: { color: 'var(--color-accent)', bg: 'var(--color-accent-surface)' },
  amber: { color: 'var(--color-film-amber)', bg: 'var(--color-film-amber-surface)' },
};

/* ── Pattern card ─────────────────────────────────────────────────────────── */
function PatternCard({
  pattern,
  reducedMotion,
}: Readonly<{
  pattern: (typeof PRODUCTION_PATTERNS)[number];
  reducedMotion: boolean;
}>) {
  const [expanded, setExpanded] = useState(false);
  const accent = ACCENT[pattern.accent] ?? ACCENT.teal;
  const Icon = ICONS[pattern.id] ?? ICONS.observability;
  const cardVar = reducedMotion ? noMotion : cardReveal(20);

  function toggle() {
    setExpanded((v) => !v);
  }

  return (
    <m.div
      variants={cardVar}
      className="glass-medium overflow-hidden rounded-[var(--radius-xl)]"
      whileHover={
        reducedMotion
          ? undefined
          : { y: -3, transition: { type: 'spring', stiffness: 380, damping: 28 } }
      }
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} details: ${pattern.title}`}
        className="flex min-h-[80px] w-full items-start gap-4 rounded-[var(--radius-xl)] p-5 text-left focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:outline-none sm:p-6"
      >
        {/* Icon */}
        <div
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          // eslint-disable-next-line no-restricted-syntax
          style={{ background: accent.bg }}
        >
          <Icon color={accent.color} />
        </div>

        {/* Header */}
        <div className="min-w-0 flex-1">
          <p
            className="label-mono mb-1 text-[10px]"
            // eslint-disable-next-line no-restricted-syntax
            style={{ color: accent.color }}
          >
            {pattern.caption}
          </p>
          <h3 className="text-color-text-primary text-sm leading-snug font-semibold tracking-tight sm:text-base">
            {pattern.title}
          </h3>
        </div>

        {/* Chevron */}
        <m.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="mt-1 shrink-0"
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.9 }}
            className="overflow-hidden"
          >
            <div className="border-color-border-subtle border-t px-5 pb-5 sm:px-6 sm:pb-6">
              <p className="text-color-text-secondary mt-4 text-sm leading-[1.8]">
                {pattern.description}
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */
export function ProductionPatterns() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();

  const container = staggerContainer(0.08, 0.05);
  const child = reducedMotion ? noMotion : fadeRise;

  return (
    <section
      ref={ref}
      aria-labelledby="patterns-heading"
      className="border-color-border border-t py-[var(--section-py)]"
    >
      <div className="container">
        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <m.div variants={child} className="mb-8 sm:mb-12">
            <div className="section-kicker-row">
              <span className="section-number" aria-hidden="true">
                ↳
              </span>
              <span className="section-label">Architecture Depth</span>
            </div>

            <h2 id="patterns-heading" className="text-color-text-primary mt-3 max-w-[24ch]">
              Patterns that hold at 2am.
            </h2>

            <p className="text-color-text-secondary mt-4 max-w-[52ch] text-sm leading-8 sm:text-base">
              The architectural choices in every system — not retrofitted after incidents, designed
              in before first deploy.
            </p>
          </m.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {PRODUCTION_PATTERNS.map((pattern) => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                reducedMotion={reducedMotion ?? false}
              />
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
