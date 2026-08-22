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
// This section does not repeat homepage metrics. It names the failure mode,
// response, and evidence path behind each project record.

const PROOF_CARDS = [
  {
    id: 'taxbridge',
    type: 'COMPLIANCE PLATFORM · FINTECH',
    metric: 'RLS + Queue',
    metricSub: 'Failure boundary',
    headline: 'Duplicate filing and tenant leakage are designed out of the critical path.',
    body: 'BullMQ absorbs NRS API rate limits with idempotent submission keys. PostgreSQL RLS keeps tenant isolation at the database engine, while the case study records the integration status and private evidence path.',
    decision:
      'Chosen: RLS at engine level, not application-layer filtering — NRS audit scrutiny demands proof that tenant data cannot cross-contaminate.',
    accent: 'var(--color-film-teal)',
  },
  {
    id: 'sabiscore',
    type: 'ML PLATFORM · OBSERVABILITY',
    metric: 'Fallback',
    metricSub: 'Degraded mode',
    headline: 'Inference stays useful when cache or feature-store dependencies fail.',
    body: 'Versioned Redis caching and a lower-confidence baseline model provide a deliberate degraded path. The measured record is bounded to a 90-day Prometheus window and a named reactive-alerting baseline.',
    decision:
      'Chosen: FastAPI + Redis Pub/Sub — sub-50ms event fan-out at sustained load, impossible with synchronous polling under concurrent sessions.',
    accent: 'oklch(72% 0.17 160)',
  },
  {
    id: 'swarmxq',
    type: 'AI AGENT PLATFORM · ORCHESTRATION',
    metric: 'Checkpoint',
    metricSub: 'Recovery model',
    headline: 'Agent work resumes from a known state instead of replaying the entire run.',
    body: 'Task-specific model routing operates within an 8GB local-inference budget. Checkpointed state, timeout budgets, and bounded fallbacks make partial failure visible and recoverable.',
    decision:
      'Chosen: Autonomous evolution layer over static agent configs — manual tuning cannot adapt to novel inputs at scale.',
    accent: 'oklch(75% 0.16 300)',
  },
  {
    id: 'ubec',
    type: 'FEDERAL INFRASTRUCTURE · DATA',
    metric: 'Per-state',
    metricSub: 'Retry boundary',
    headline: 'One late state submission does not block every completed report.',
    body: 'Isolated Airflow task groups, canonical ingest schemas, probabilistic record linkage, and cross-state validation gates keep partial output explicit across 36 state sources.',
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
                Failure modes, <br className="hidden lg:block" />
                made explicit.
              </>
            }
            description="The evidence is strongest when the failure boundary is named: what can break, how the system responds, and which record supports the claim."
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
             container. The capped grid stays centered within the container. */}
        <m.div
          variants={container}
          className="metrics-grid grid gap-4 sm:grid-cols-2 xl:[grid-template-columns:repeat(4,minmax(0,320px))] xl:grid-cols-4"
        >
          {PROOF_CARDS.map((card, i) => (
            <m.article
              key={card.id}
              variants={reducedMotion ? noMotion : cardReveal(i % 2 === 0 ? 20 : 28)}
              data-cinematic="proof"
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
          {/* V1.2: 'Tools extracted' > 'What got open-sourced' — more specific (tools, not
              vague 'what'), more vivid (extracted = real surgery on live systems), shorter
              scan time on mobile. Same Lenis-friendly anchor link unchanged. */}
          <Link href={anchorUrl('open-source')} className="transition-opacity hover:opacity-80">
            Tools extracted from these systems and open-sourced →
          </Link>
        </m.p>
      </div>
    </ChapterFrame>
  );
}
