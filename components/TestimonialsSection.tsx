'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import { m, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { ChapterFrame } from '@/components/cinematic/ChapterFrame';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { getChapterBySectionId } from '@/lib/cinematic/chapters';
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
  const reducedMotion = useReducedMotion();
  const chapter = getChapterBySectionId('section-testimonials');
  // Tightened from staggerContainer(0.08, 0.05) — at 4 cards the original
  // 0.08s per-child stagger totalled ~0.37s, which felt slow on desktop
  // where all cards are visible simultaneously. 0.055s stagger = ~0.26s total.
  const container = staggerContainer(0.055, 0.04);
  const itemVariant = reducedMotion ? noMotion : fadeRise;
  const headVariant = reducedMotion ? noMotion : clipReveal;

  return (
    <ChapterFrame
      chapter={chapter}
      ariaLabelledBy="proof-record-heading"
      className="border-color-border section-deferred overflow-x-clip"
    >
      <div>
        <m.div variants={itemVariant} className="mb-10 sm:mb-14">
          <SectionIntro
            eyebrowLabel="Production record"
            headingId="proof-record-heading"
            title={
              <>
                Shipped systems. <br className="hidden lg:block" />
                Verified outcomes.
              </>
            }
            description="Three live platforms. One federal engagement. Every metric traceable to a deployed codebase."
            eyebrowVariant={itemVariant}
            titleVariant={headVariant}
            descriptionVariant={itemVariant}
            titleClassName="text-color-text-primary mt-4 max-w-[24ch]"
            descriptionClassName="text-color-text-secondary mt-4 max-w-[52ch] text-base leading-8 lg:mt-0"
          />
        </m.div>

        {/* ── Proof grid: 1-col → 2-col (sm) → 4-col (xl) ──────────────
             metrics-grid applies the CSS-level ultrawide max-width cap (≥1536px).
             xl:[grid-template-columns:...] caps each card at 320px on ultrawide
             so cards don't stretch beyond comfortable reading width at 1680px+
             container. The grid stays left-aligned within the container naturally. */}
        <m.div
          variants={container}
          className="metrics-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:[grid-template-columns:repeat(4,minmax(0,320px))]"
        >
          {PROOF_CARDS.map((card, i) => (
            <m.article
              key={card.id}
              variants={reducedMotion ? noMotion : cardReveal(i % 2 === 0 ? 20 : 28)}
              data-cinematic="proof"
              data-live={card.id === 'taxbridge' || card.id === 'sabiscore' ? 'true' : undefined}
              className="proof-card-item glass-medium flex min-w-0 flex-col gap-3 rounded-[var(--radius-xl)] p-6"
              // eslint-disable-next-line no-restricted-syntax
              style={{ borderLeft: `3px solid ${card.accent}` }}
              aria-label={`${card.type}: ${card.headline}`}
              whileHover={reducedMotion ? undefined : hoverLift(-2)}
            >
              {/* Type label — live pulse dot for confirmed production systems */}
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
                {(card.id === 'taxbridge' || card.id === 'sabiscore') && (
                  // live-indicator: solid dot + CSS ::before ping ripple (see globals.css PATCH v2026.17).
                  // Upgraded from animate-pulse (opacity fade) to sonar-ring expansion — more precise
                  // "actively receiving production traffic" signal. role="img" + aria-label for a11y.
                  <span
                    className="live-indicator mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current align-middle"
                    role="img"
                    aria-label="Live in production"
                  />
                )}
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
          data-cinematic="cta"
          className="text-color-text-muted mt-10 font-mono text-[13px] [letter-spacing:0.06em] opacity-50"
        >
          <Link href={anchorUrl('open-source')} className="transition-opacity hover:opacity-80">
            What got open-sourced from these production systems →
          </Link>
        </m.p>
      </div>
    </ChapterFrame>
  );
}
