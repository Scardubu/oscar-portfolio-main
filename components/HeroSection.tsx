// CONVICTION ENGINE v11.0 — HeroSection
//
// Design principles applied:
//   • A24 Didone: word-by-word rise reveal ("The system has to work at 2am.")
//     Each word is wrapped in overflow:hidden — inner span translates Y 110%→0.
//     Creates the cinematic "unknown → revealed" letterform unfurl.
//   • Stripe trust architecture: proof callout is concrete data, not promise.
//     No adjectives. Every claim is a number with a denominator.
//   • Dual-audience: engineer reads metrics in <400ms; DM reads outcomes first.
//     CTA hierarchy: primary = book a call (DM), secondary = view projects (engineer).
//   • Linear Liquid Glass: glass-full proof cards with fresnel edge lighting.
//   • Spring physics: hero reveal is gentle (stiffness 180), not snappy.
//
'use client';

import { m, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { LiveActivityBar } from '@/components/Liveactivitybar';
import {
  cardReveal,
  fadeRise,
  noMotion,
  staggerContainer,
  wordReveal,
  wordRevealContainer,
} from '@/lib/motionVariants';

// HeroVisual: SSR-disabled — terminal animation hydration mismatch prevention
const HeroVisual = dynamic(() => import('@/components/HeroVisual').then((m) => m.HeroVisual), {
  ssr: false,
});

// ── Proof pillars: Stripe-style — claims with denominators ──────────────────
const PROOF_COLUMNS = [
  {
    label: 'LIVE IN PRODUCTION',
    body: 'SabiScore holds 99.9%+ uptime across a 90-day Prometheus window — ensemble XGBoost, LightGBM, and CatBoost inference with 45% MTTD improvement over reactive alerting.',
  },
  {
    label: 'DECISIONS DOCUMENTED',
    body: 'Every tradeoff is written as Chosen / Over / Because — architecture reasoning at every layer, legible to the next engineer without clicking a link.',
  },
  {
    label: 'ZERO-DOWNTIME DESIGN',
    body: 'Health checks, idempotent BullMQ queues, circuit breakers, and rate-limit scoping are in the baseline — not added after the first 3am incident.',
  },
  {
    label: 'FULL STACK OWNERSHIP',
    body: 'Feature engineering through FastAPI inference to the Next.js frontend. One engineer, complete ownership — no handoff tax, no translation loss, no ticket queue.',
  },
] as const;

// Headline words — each gets its own overflow:hidden clip wrapper
const HEADLINE_WORDS = ['The', 'system', 'has', 'to', 'work', 'at', '2am.'];

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  const heroContainer = staggerContainer(0.065, 0.1);
  const proofContainer = staggerContainer(0.09, 0.55);
  const child = reducedMotion ? noMotion : fadeRise;
  const card = reducedMotion ? noMotion : cardReveal(24);
  const wordContainer = reducedMotion ? noMotion : wordRevealContainer(0.065, 0.1);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-20 pt-28 sm:pt-32 sm:pb-24"
    >
      {/* ── Ambient background glows (GPU layer, pointer-events: none) ── */}
      <div className="work-surface-glow" aria-hidden="true" />

      <div className="relative z-10 container">
        {/* ── 2-column grid: left text, right live metrics terminal ─── */}
        <div className="grid items-center gap-[var(--hero-col-gap)] lg:grid-cols-[var(--hero-left-width)_var(--hero-right-width)]">

          {/* ═══════════════════════════════════════════════════════════
              LEFT COLUMN — Conviction copy stack
              Hierarchy: kicker → headline → sub-line → body → proof → CTAs
              ═══════════════════════════════════════════════════════════ */}
          <m.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            {/* ── Availability pill ────────────────────────────────── */}
            <m.div variants={child}>
              <div
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2"
                aria-label="Availability status"
              >
                <span className="dot-live" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
                  AVAILABLE · STAFF+ / PRINCIPAL · BACKEND & INFRASTRUCTURE
                </span>
              </div>
            </m.div>

            {/* ── Kicker: role classification ───────────────────────── */}
            <m.p
              variants={child}
              className="mb-5 font-mono text-[11px] tracking-[0.14em] uppercase"
              style={{ color: 'var(--color-cyan)' }}
            >
              Principal Backend Engineer · Infrastructure & SRE Architect · AI Systems
            </m.p>

            {/* ── Hero headline: A24 Didone word-by-word reveal ─────── */}
            {/* Each word is an overflow:hidden box; inner span translates Y */}
            <h1
              id="hero-heading"
              className="max-w-[18ch] text-balance"
              aria-label="The system has to work at 2am."
            >
              <m.span
                variants={wordContainer}
                initial="hidden"
                animate="visible"
                className="inline"
                aria-hidden="true" /* Screen reader reads the aria-label above */
              >
                {HEADLINE_WORDS.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="inline-block overflow-hidden"
                    style={{
                      // Space between words, hanging punctuation for '2am.'
                      marginRight: i < HEADLINE_WORDS.length - 1 ? '0.28em' : '0',
                      lineHeight: 'var(--leading-tight)',
                      verticalAlign: 'bottom',
                    }}
                  >
                    <m.span
                      variants={reducedMotion ? noMotion : wordReveal}
                      className="inline-block"
                    >
                      {word}
                    </m.span>
                  </span>
                ))}
              </m.span>
            </h1>

            {/* ── Didone sub-line: italic serif — emotional resonance ── */}
            <m.p
              variants={child}
              className="text-didone-sub mt-5 max-w-[30ch]"
            >
              {"That's not a slogan. It's a design constraint."}
            </m.p>

            {/* ── Body: Stripe "you" language — concrete, no adjectives */}
            <m.p
              variants={child}
              className="mt-6 max-w-[52ch] text-base leading-[1.8]"
              style={{ color: 'oklch(93% 0.006 264 / 0.72)' }}
            >
              I build backend systems that keep fintech products alive, compliant, and fast —
              whether it&apos;s a quiet Tuesday or a FIRS audit season.
            </m.p>

            {/* ── Proof callout: left-border accent, concrete metrics ── */}
            <m.div variants={child} className="hero-proof-callout">
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'oklch(93% 0.006 264 / 0.55)' }}
              >
                Tax filing time: 4 hours → 15 minutes. Zero data-loss record across three
                production systems.
              </p>
            </m.div>

            {/* ── Performance bar: high-density tech credibility strip ── */}
            <m.p
              variants={child}
              className="font-mono text-[11px] tracking-widest uppercase"
              style={{ color: 'oklch(93% 0.006 264 / 0.42)' }}
            >
              <span style={{ color: 'var(--color-success)' }}>Sub-150ms</span> API p99 ·{' '}
              <span style={{ color: 'var(--color-success)' }}>99.9%+</span> uptime ·{' '}
              <span style={{ color: 'var(--color-success)' }}>40%</span> ops reduction ·{' '}
              <span style={{ color: 'var(--color-success)' }}>95%</span> test coverage
            </m.p>

            {/* ── CTAs: Stripe friction-removal hierarchy ───────────── */}
            {/* Primary: book call (DM) — one per viewport rule */}
            {/* Secondary: view projects (engineer) — ghost, lower weight */}
            <m.div
              variants={child}
              className="mt-8 mb-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <a
                href="mailto:scardubu@gmail.com"
                className="cta-primary"
                aria-label="Email Oscar to book a call"
              >
                Book a Call
              </a>
              <Link href="#section-projects" className="cta-secondary">
                View Projects{' '}
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="/cv/oscar-ndugbu-resume.pdf"
                download
                className="cta-ghost"
                aria-label="Download resume PDF"
              >
                Download CV
              </a>
            </m.div>

            {/* ── Live activity bar ─────────────────────────────────── */}
            <m.div variants={child}>
              <LiveActivityBar />
            </m.div>

            {/* ── Proof cards grid: glass-full, 4 pillars ───────────── */}
            <m.div
              variants={proofContainer}
              initial="hidden"
              animate="visible"
              className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {PROOF_COLUMNS.map((column) => (
                <m.article
                  key={column.label}
                  variants={card}
                  className="proof-card"
                  // Engineer audience: hover reveals more depth on proof
                  whileHover={{ y: -2, transition: { type: 'spring', stiffness: 420, damping: 30 } }}
                >
                  <p className="label-mono" style={{ color: 'var(--color-cyan)' }}>
                    {column.label}
                  </p>
                  <p
                    className="mt-3 text-sm leading-7"
                    style={{ color: 'oklch(93% 0.006 264 / 0.65)' }}
                  >
                    {column.body}
                  </p>
                </m.article>
              ))}
            </m.div>
          </m.div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT COLUMN — Live metrics dashboard
              (Replaces static terminal: signals live system authority)
              ═══════════════════════════════════════════════════════════ */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
