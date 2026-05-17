'use client';
// CONVICTION ENGINE v2.0 — TestimonialsSection
//
// v2.0 vs v1.1:
//   [CHANGE 1]: Section content — replaced 4 unverified named testimonials with 4
//     verifiable system proof cards sourced directly from lib/projects.ts.
//     The component header in v1.1 contained an explicit warning: "⚠ VERIFICATION
//     REQUIRED — MUST NOT go live unverified." They were live. This closes that risk.
//     Framework: Cialdini Authority — specificity and traceability outperform
//     unverifiable social proof for technical evaluators and for basic honesty.
//   [CHANGE 2]: Section number "01.5" removed from rendered output.
//     v1.1 comment stated this was the intent; the code never executed it.
//     Interstitial sections do not carry a number — consistent with the sequence
//     contract (01 Projects → 02 OSS → 03 Skills → 04 About → 05 Writing → 06 Contact).
//     (Nielsen: Minimalist Design)
//   [CHANGE 3]: Heading — "What the teams say." → "Shipped systems. Verified outcomes."
//     Traceable claim replaces unverifiable framing.
//   KEEP: Grid layout, motion choreography, card border-left accent pattern,
//     all CSS variables and design tokens, section ID for nav anchor compatibility.

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import {
  cardReveal,
  clipReveal,
  fadeRise,
  noMotion,
  staggerContainer,
} from '@/lib/motionVariants';

// ── Proof card data — sourced from lib/projects.ts verified outcomes ──────────
// Every metric here is traceable to a project slug and its outcomes[] or description.
// TaxBridge: 4h→15min (tagline), NRS rate limits (constraint), 95% coverage (outcomes)
// SabiScore: 99.9%+ uptime (outcomes), 45% MTTD (outcomes), 30% latency (description)
// SwarmXQ:   self-improving fleet (outcomes), checkpoint recovery (outcomes), 8GB RAM (constraint)
// UBEC:      36 states (outcomes), <2% dedup (description), 40M students (tagline)

const PROOF_CARDS = [
  {
    id:        'taxbridge',
    type:      'COMPLIANCE PLATFORM · FINTECH',
    metric:    '4h \u2192 15min',
    metricSub: 'Filing time',
    headline:  'Tax filing compressed. Zero data-loss record.',
    body:      'BullMQ absorbs NRS API rate limits (30 req/min per TIN) without client-visible failure. PostgreSQL RLS isolates each tenant at the database engine level — not the application layer. Immutable hash-chained audit trail. 95% test coverage.',
    decision:  'Chosen: RLS at engine level, not application-layer filtering — NRS audit scrutiny demands proof that tenant data cannot cross-contaminate.',
    accent:    'var(--color-film-teal)',
  },
  {
    id:        'sabiscore',
    type:      'ML PLATFORM · OBSERVABILITY',
    metric:    '99.9%+',
    metricSub: '90-day uptime',
    headline:  'Ensemble ML. Engineers alerted before users notice.',
    body:      'XGBoost, LightGBM, and CatBoost inference with real-time model quality monitoring. ~30% inference latency reduction via Redis caching. 45% MTTD improvement over reactive alerting baseline. Prometheus 90-day proof window.',
    decision:  'Chosen: FastAPI + Redis Pub/Sub — sub-50ms event fan-out at sustained load, impossible with synchronous polling under concurrent sessions.',
    accent:    'oklch(72% 0.17 160)',
  },
  {
    id:        'swarmxq',
    type:      'AI AGENT PLATFORM · ORCHESTRATION',
    metric:    'Zero',
    metricSub: 'Manual tuning cycles',
    headline:  'Self-improving fleet. Checkpoint recovery.',
    body:      'Triadic LLM routing under 8GB RAM — Phi-4-mini for task routing, DeepSeek-R1 for multi-step reasoning, Qwen2.5-Coder for generation. Agents evolve their own task strategies between runs. Failed sub-tasks restart from last consistent checkpoint, not from scratch.',
    decision:  'Chosen: Autonomous evolution layer over static agent configs — manual tuning cannot adapt to novel inputs at scale.',
    accent:    'oklch(75% 0.16 300)',
  },
  {
    id:        'ubec',
    type:      'FEDERAL INFRASTRUCTURE · DATA',
    metric:    '36',
    metricSub: 'State sources',
    headline:  '40M Nigerian students. <2% deduplication error.',
    body:      'Batch ingestion for the Universal Basic Education Commission across all 36 Nigerian states. Probabilistic record linkage (dedupe.io + PostgreSQL) where exact-match alone misses 15\u201320% of true duplicates. Per-state DAG tasks — one late submission does not block reporting for the other 35.',
    decision:  'Chosen: Probabilistic deduplication over exact-match — state submissions use inconsistent school name spellings across ministries.',
    accent:    'oklch(78% 0.17 65)',
  },
] as const;

// ── Main section ──────────────────────────────────────────────────────────────

export function TestimonialsSection() {
  const ref           = useRef<HTMLElement>(null);
  const inView        = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();

  const container   = staggerContainer(0.08, 0.05);
  const itemVariant = reducedMotion ? noMotion : fadeRise;
  const headVariant = reducedMotion ? noMotion : clipReveal;

  return (
    <section
      id="section-testimonials"
      ref={ref}
      aria-labelledby="proof-record-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* ── Eyebrow — no section number; interstitial between 01 and 02 ── */}
          <m.div variants={itemVariant} className="section-kicker-row">
            <span className="section-label">Production record</span>
          </m.div>

          <m.h2
            variants={headVariant}
            id="proof-record-heading"
            className="mt-4 mb-3"
          >
            Shipped systems. Verified outcomes.
          </m.h2>

          <m.p
            variants={itemVariant}
            className="mb-10 max-w-[52ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Four production systems. Every metric traceable to a deployed
            codebase. All of it running.
          </m.p>

          {/* ── 2-col grid (mobile: 1-col) ──────────────────────────────── */}
          <m.div
            variants={container}
            className="grid gap-4 sm:grid-cols-2"
          >
            {PROOF_CARDS.map((card, i) => (
              <m.article
                key={card.id}
                variants={reducedMotion ? noMotion : cardReveal(i % 2 === 0 ? 20 : 28)}
                className="glass-medium rounded-[var(--radius-xl)] p-6 flex flex-col gap-3"
                style={{ borderLeft: `3px solid ${card.accent}` }}
                aria-label={`${card.type}: ${card.headline}`}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: -2, transition: { type: 'spring', stiffness: 420, damping: 30 } }
                }
              >
                {/* Type label */}
                <p
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: card.accent, opacity: 0.8 }}
                >
                  {card.type}
                </p>

                {/* Metric row */}
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-mono text-2xl font-bold leading-none"
                    style={{ color: card.accent }}
                  >
                    {card.metric}
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {card.metricSub}
                  </span>
                </div>

                {/* Headline */}
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {card.headline}
                </p>

                {/* System detail */}
                <p
                  className="text-xs leading-6 flex-1"
                  style={{ color: 'var(--color-text-secondary)', opacity: 0.85 }}
                >
                  {card.body}
                </p>

                {/* Architecture decision — Layer 2 for technical evaluators */}
                <p
                  className="font-mono text-[10px] leading-5 border-t pt-3 italic"
                  style={{
                    borderColor: 'var(--color-border-subtle)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {card.decision}
                </p>
              </m.article>
            ))}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}