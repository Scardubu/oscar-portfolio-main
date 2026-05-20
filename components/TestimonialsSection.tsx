'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import { m, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

import { anchorUrl } from '@/lib/config';
import {
    cardReveal,
    clipReveal,
    fadeRise,
    hoverLift,
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
    id: 'taxbridge',
    type: 'COMPLIANCE PLATFORM · FINTECH',
    metric: '4h \u2192 15min',
    metricSub: 'Filing time',
    headline: 'Tax filing compressed. Zero data-loss record.',
    body: 'BullMQ absorbs NRS API rate limits (30 req/min per TIN) without client-visible failure. PostgreSQL RLS isolates each tenant at the database engine level — not the application layer. Immutable hash-chained audit trail. 95% test coverage.',
    decision:
      'Chosen: RLS at engine level, not application-layer filtering — NRS audit scrutiny demands proof that tenant data cannot cross-contaminate.',
    accent: 'var(--color-film-teal)',
  },
  {
    id: 'sabiscore',
    type: 'ML PLATFORM · OBSERVABILITY',
    metric: '99.9%+',
    metricSub: '90-day uptime',
    headline: 'Ensemble ML. Engineers alerted before users notice.',
    body: 'XGBoost, LightGBM, and CatBoost inference with real-time model quality monitoring. ~30% inference latency reduction via Redis caching. 45% MTTD improvement over reactive alerting baseline. Prometheus 90-day proof window.',
    decision:
      'Chosen: FastAPI + Redis Pub/Sub — sub-50ms event fan-out at sustained load, impossible with synchronous polling under concurrent sessions.',
    accent: 'oklch(72% 0.17 160)',
  },
  {
    id: 'swarmxq',
    type: 'AI AGENT PLATFORM · ORCHESTRATION',
    metric: 'Zero',
    metricSub: 'Manual tuning cycles',
    headline: 'Self-improving fleet. Checkpoint recovery.',
    body: 'Triadic LLM routing under 8GB RAM — Phi-4-mini for task routing, DeepSeek-R1 for multi-step reasoning, Qwen2.5-Coder for generation. Agents evolve their own task strategies between runs. Failed sub-tasks restart from last consistent checkpoint, not from scratch.',
    decision:
      'Chosen: Autonomous evolution layer over static agent configs — manual tuning cannot adapt to novel inputs at scale.',
    accent: 'oklch(75% 0.16 300)',
  },
  {
    id: 'ubec',
    type: 'FEDERAL INFRASTRUCTURE · DATA',
    metric: '36',
    metricSub: 'State sources',
    headline: '40M Nigerian students. <2% deduplication error.',
    body: 'Batch ingestion for the Universal Basic Education Commission across all 36 Nigerian states. Probabilistic record linkage (dedupe.io + PostgreSQL) where exact-match alone misses 15\u201320% of true duplicates. Per-state DAG tasks — one late submission does not block reporting for the other 35.',
    decision:
      'Chosen: Probabilistic deduplication over exact-match — state submissions use inconsistent school name spellings across ministries.',
    accent: 'oklch(78% 0.17 65)',
  },
] as const;

// ── Main section ──────────────────────────────────────────────────────────────

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();

  const container = staggerContainer(0.08, 0.05);
  const itemVariant = reducedMotion ? noMotion : fadeRise;
  const headVariant = reducedMotion ? noMotion : clipReveal;

  return (
    <section
      id="section-testimonials"
      ref={ref}
      aria-labelledby="proof-record-heading"
      className="border-color-border section-deferred overflow-x-clip border-t py-[var(--section-py)]"
    >
      <div className="container">
        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          {/* ── Section header — editorial 2-col at lg+ (matches Projects v25, Writing v23, OSS v24) ── */}
          <m.div variants={itemVariant} className="section-intro-editorial mb-10 sm:mb-14">
            {/* Left: kicker + heading */}
            <div>
              <div className="section-kicker-row">
                <span className="section-label">Production record</span>
              </div>
              <m.h2 variants={headVariant} id="proof-record-heading" className="mt-4">
                Shipped systems. <br className="hidden lg:block" />
                Verified outcomes.
              </m.h2>
            </div>
            {/* Right: description — editorial counterweight at lg+ */}
            <div className="lg:flex lg:flex-col lg:justify-end">
              <m.p
                variants={itemVariant}
                className="text-color-text-secondary mt-4 max-w-[52ch] text-base leading-8 lg:mt-0"
              >
                Three live platforms. One federal engagement. Every metric traceable to a deployed
                codebase.
              </m.p>
            </div>
          </m.div>

          {/* ── 2-col grid (mobile: 1-col) ──────────────────────────────── */}
          <m.div variants={container} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PROOF_CARDS.map((card, i) => (
              <m.article
                key={card.id}
                variants={reducedMotion ? noMotion : cardReveal(i % 2 === 0 ? 20 : 28)}
                className="glass-medium flex min-w-0 flex-col gap-3 rounded-[var(--radius-xl)] p-6"
                // eslint-disable-next-line no-restricted-syntax
                style={{ borderLeft: `3px solid ${card.accent}` }}
                aria-label={`${card.type}: ${card.headline}`}
                whileHover={
                  reducedMotion
                    ? undefined
                    : hoverLift(-2)
                }
              >
                {/* Type label */}
                <p
                  className="font-mono text-[10px] tracking-widest break-words uppercase"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{
                    color: card.accent,
                    opacity: 0.8,
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                  }}
                >
                  {card.type}
                </p>

                {/* Metric row — larger display for scannable proof */}
                <div className="flex flex-wrap items-baseline gap-2">
                  <span
                    className="font-mono text-[clamp(1.35rem,2.8vw,2rem)] leading-none font-bold"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{ color: card.accent }}
                  >
                    {card.metric}
                  </span>
                  <span className="text-color-text-muted font-mono text-[10px] tracking-widest uppercase">
                    {card.metricSub}
                  </span>
                </div>

                {/* Headline */}
                <p className="text-color-text-primary font-display text-sm leading-snug font-semibold break-words">
                  {card.headline}
                </p>

                {/* System detail */}
                {/* v2.1 FIX: removed opacity:0.85 — var(--color-text-secondary) is already
                    dimmed; stacking opacity degrades OLED readability on mobile below
                    the WCAG AA contrast threshold for 12px text. */}
                <p className="text-color-text-secondary flex-1 text-xs leading-6">{card.body}</p>

                {/* Architecture decision — Layer 2 for technical evaluators */}
                <p className="border-color-border-subtle text-color-text-muted border-t pt-3 font-mono text-[10px] leading-5 break-words italic">
                  {card.decision}
                </p>
              </m.article>
            ))}
          </m.div>

          <m.p
            variants={itemVariant}
            className="text-color-text-muted mt-10 font-mono text-[13px] [letter-spacing:0.06em] opacity-50"
          >
            <Link href={anchorUrl('open-source')} className="transition-opacity hover:opacity-80">
              What got open-sourced from these production systems →
            </Link>
          </m.p>
        </m.div>
      </div>
    </section>
  );
}
