// CONVICTION ENGINE v14.0 — HeroSection
//
// CHANGELOG from v13.0:
//
//   CRITICAL FIX: "Built in Lagos." — duplicated token from v12.x
//     find/replace (Lagos → Abuja) created "Lagos" artifact.
//     Corrected to "Built in Abuja. Running globally." — clean, precise.
//
//   REF:  Proof callout sub-line upgraded: moved "sub-150ms p99" to
//     first position — engineers parse the most specific metric first.
//
//   REF:  Kicker line: "Lagos → Global" corrected to "Abuja → Global"
//     consistent with the global location correction pass.
//
//   REF:  Performance bar: colour-coded values now use a span wrapper
//     with explicit aria-label for the full bar — single screen reader
//     announcement instead of five fragmented readings.
//
//   ADD:  Availability pill now renders with a micro spring-in entrance
//     before the headline words — sequences the trust signal earlier.
//
//   ADD:  Hero headline aria-label now includes the Didone sub-line text
//     so screen readers experience the full opening statement as one.
//
//   REF:  Proof card grid: gap 3 → gap-3.5 for breathing room at 2-col.
//
//   KEEP: A24 word-by-word headline reveal — strongest motion signal.
//   KEEP: Scroll-linked parallax — Z-depth on commit-to-scroll.
//   KEEP: Proof columns — concrete denominators, no adjectives.
//   KEEP: Spring physics on card hover (stiffness 420, damping 30).
//   KEEP: LiveActivityBar — operational cadence proof.
//
'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef } from 'react';

import { LiveActivityBar } from '@/components/Liveactivitybar';
import {
  HERO_SCROLL_CONFIG,
  cardReveal,
  fadeRise,
  noMotion,
  staggerContainer,
  wordReveal,
  wordRevealContainer,
} from '@/lib/motionVariants';

// HeroVisual: SSR-disabled — terminal animation hydration mismatch prevention.
const HeroVisual = dynamic(() => import('@/components/HeroVisual').then((m) => m.HeroVisual), {
  ssr: false,
});

// ── Proof pillars: Stripe-style — every claim has a denominator ─────────────
// No adjectives. Numbers with context. Engineers verify; DMs feel the weight.
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
    body: 'Health checks, idempotent BullMQ queues, circuit breakers, and rate-limit scoping are in the baseline — not retrofitted after the first 3am incident.',
  },
  {
    label: 'FULL STACK OWNERSHIP',
    body: 'Feature engineering through FastAPI inference to the Next.js frontend. One engineer, complete ownership — no handoff tax, no translation loss, no ticket queue.',
  },
] as const;

// ── Headline words — each wrapped in overflow:hidden for A24 unfurl ─────────
const HEADLINE_WORDS = ['The', 'system', 'has', 'to', 'work', 'at', '2am.'];

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // ── Scroll-linked parallax ─────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: HERO_SCROLL_CONFIG.offset,
  });

  // Text column drifts slightly faster than the visual — creates Z-depth.
  const textY = useTransform(
    scrollYProgress,
    HERO_SCROLL_CONFIG.textRange,
    reducedMotion ? ['0%', '0%'] : HERO_SCROLL_CONFIG.textOutput,
  );

  // HeroVisual drifts slower — appears "further back" on Z axis.
  const visualY = useTransform(
    scrollYProgress,
    HERO_SCROLL_CONFIG.visualRange,
    reducedMotion ? ['0%', '0%'] : HERO_SCROLL_CONFIG.visualOutput,
  );

  // Entire hero fades as user commits to scroll — cinematic exit.
  const heroOpacity = useTransform(
    scrollYProgress,
    HERO_SCROLL_CONFIG.opacityRange,
    reducedMotion ? [1, 1] : HERO_SCROLL_CONFIG.opacityOutput,
  );

  // ── Variant configuration ─────────────────────────────────────────────────
  const heroContainer = staggerContainer(0.065, 0.1);
  const proofContainer = staggerContainer(0.09, 0.55);
  const child = reducedMotion ? noMotion : fadeRise;
  const card = reducedMotion ? noMotion : cardReveal(24);
  const wordContainer = reducedMotion ? noMotion : wordRevealContainer(0.065, 0.1);

  return (
    <m.section
      id="hero"
      ref={heroRef}
      aria-labelledby="hero-heading"
      style={{ opacity: heroOpacity }}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-20 pt-28 sm:pt-32 sm:pb-24"
    >
      {/* ── Ambient background glows (GPU layer, pointer-events: none) ──────── */}
      {/* v14.0: warm amber glow now composited in .work-surface-glow — CSS token */}
      <div className="work-surface-glow" aria-hidden="true" />

      <div className="relative z-10 container">
        {/* ── 2-column grid: left text column, right live metrics terminal ───── */}
        <div className="grid items-center gap-[var(--hero-col-gap)] lg:grid-cols-[var(--hero-left-width)_var(--hero-right-width)]">

          {/* ═══════════════════════════════════════════════════════════════════
              LEFT COLUMN — Conviction copy stack
              Hierarchy: pill → kicker → headline → sub-line → body → proof → CTAs
              DM reads: pill → headline → body → book call.
              Engineer reads: kicker → headline → metrics strip → proof cards.
              ═══════════════════════════════════════════════════════════════════ */}
          <m.div
            style={{ y: textY }}
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            {/* ── Availability pill ─────────────────────────────────────────── */}
            {/*
              "OPEN TO WORK" = LinkedIn junior-market signal.
              "AVAILABLE · STAFF+ ROLES" = senior professional signal.
              DMs at VP/CTO level respond to the latter in ~200ms.
            */}
            <m.div variants={child}>
              <div
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2"
                aria-label="Availability status: Available for Staff+ roles"
              >
                <span className="dot-live" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
                  AVAILABLE · STAFF+ ROLES
                </span>
              </div>
            </m.div>

            {/* ── Kicker: role taxonomy — engineer reads this first ─────────── */}
            {/* v14.0: "Lagos → Global" corrected to "Abuja → Global" */}
            <m.p
              variants={child}
              className="mb-5 font-mono text-[11px] tracking-[0.14em] uppercase"
              style={{ color: 'var(--color-cyan)' }}
            >
              Full-Stack · Infrastructure · AI Systems · Abuja → Global
            </m.p>

            {/* ── Hero headline: A24 Didone word-by-word reveal ─────────────── */}
            {/*
              Each word is an overflow:hidden clip box.
              Inner span translates from Y: 110% → 0% on spring.
              "The system has to work at 2am." — a design constraint expressed
              as a character trait. Engineers read it as technical; DMs read
              it as reliability.
            */}
            <h1
              id="hero-heading"
              className="max-w-[18ch] text-balance"
              aria-label="The system has to work at 2am. That's not a slogan. It's a design constraint."
            >
              <m.span
                variants={wordContainer}
                initial="hidden"
                animate="visible"
                className="inline"
                aria-hidden="true"
              >
                {HEADLINE_WORDS.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="inline-block overflow-hidden"
                    style={{
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

            {/* ── Didone sub-line: italic serif — emotional resonance ────────── */}
            {/*
              Renders in Playfair Display (true Didone). At 1.875rem+ the
              hairline strokes carry the tone Georgia can only approximate.
              Declarative — owns the claim. No hedge. A24 confidence.
            */}
            <m.p
              variants={child}
              className="text-didone-sub mt-5 max-w-[30ch]"
              aria-hidden="true"
            >
              {"That's not a slogan. It's a design constraint."}
            </m.p>

            {/* ── Body: Stripe "you" language — your situation, your problem ─── */}
            {/*
              Tightened 28 words. Shorter = more confident.
              "FIRS filing deadline" — Federal Inland Revenue Service specificity
              is a Nigeria-market credibility signal DMs at African fintechs
              parse instantly.
            */}
            <m.p
              variants={child}
              className="mt-6 max-w-[52ch] text-base leading-[1.8]"
              style={{ color: 'oklch(93% 0.006 264 / 0.72)' }}
            >
              Your fintech product needs to be alive at 2am, compliant in
              audit season, and fast on the first request — quiet Tuesday
              or FIRS filing deadline.
            </m.p>

            {/* ── Proof callout: left-border accent, concrete metrics ─────────── */}
            {/* v14.0 FIX: "Built in Abuja. Running globally." — was "Lagos" */}
            <m.div variants={child} className="hero-proof-callout">
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'oklch(93% 0.006 264 / 0.55)' }}
              >
                TaxBridge: filing time 4h → 15 min. SabiScore: zero data-loss
                across 90-day production window. Built in Abuja. Running globally.
              </p>
            </m.div>

            {/* ── Performance bar: high-density tech credibility strip ─────────── */}
            {/*
              Engineers parse this in <400ms. Green colour signals healthy.
              v14.0: wrapped in single aria-label for screen reader coherence.
            */}
            <m.p
              variants={child}
              className="font-mono text-[11px] tracking-widest uppercase"
              style={{ color: 'oklch(93% 0.006 264 / 0.42)' }}
              aria-label="Performance: sub-150ms API p99, 99.9% uptime, 40% ops reduction, 95% test coverage"
            >
              <span aria-hidden="true">
                <span style={{ color: 'var(--color-success)' }}>Sub-150ms</span> API p99 ·{' '}
                <span style={{ color: 'var(--color-success)' }}>99.9%+</span> uptime ·{' '}
                <span style={{ color: 'var(--color-success)' }}>40%</span> ops reduction ·{' '}
                <span style={{ color: 'var(--color-success)' }}>95%</span> test coverage
              </span>
            </m.p>

            {/* ── CTAs: Stripe friction-removal hierarchy ────────────────────── */}
            {/*
              CTA architecture (Stripe rule: one primary per viewport):
              Primary:   Book a Call (DM action — email intent signal)
              Secondary: View Projects (engineer action — evidence path)
              Ghost:     Download CV (document artifact for enterprise HR)
            */}
            <m.div
              variants={child}
              className="mt-8 mb-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <a
                href="mailto:scardubu@gmail.com"
                className="cta-primary"
                aria-label="Email Oscar to start a conversation"
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
                aria-label="Download Oscar's resume as PDF"
              >
                Download CV
              </a>
            </m.div>

            {/* ── Live activity bar ───────────────────────────────────────────── */}
            <m.div variants={child}>
              <LiveActivityBar />
            </m.div>

            {/* ── Proof cards grid: glass-full, 4 pillars ─────────────────────── */}
            {/*
              Card layout: 2-up on sm+, single column on mobile.
              Each card serves one trust dimension:
                LIVE IN PRODUCTION    → DM: "systems exist and work"
                DECISIONS DOCUMENTED  → Engineer: "reasoning is explicit"
                ZERO-DOWNTIME DESIGN  → Both: "reliability is first-class"
                FULL STACK OWNERSHIP  → DM: "no coordination overhead"
              v14.0: gap-3 → gap-3.5 for breathing room at 2-col layout.
            */}
            <m.div
              variants={proofContainer}
              initial="hidden"
              animate="visible"
              className="mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2"
            >
              {PROOF_COLUMNS.map((column) => (
                <m.article
                  key={column.label}
                  variants={card}
                  className="proof-card"
                  whileHover={{
                    y: -2,
                    transition: { type: 'spring', stiffness: 420, damping: 30 },
                  }}
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

          {/* ═══════════════════════════════════════════════════════════════════
              RIGHT COLUMN — Live metrics dashboard
              Slower parallax rate creates Z-axis separation — visual appears
              to float behind the text as the user scrolls.
              ═══════════════════════════════════════════════════════════════════ */}
          <m.div style={{ y: visualY }}>
            <HeroVisual />
          </m.div>

        </div>
      </div>
    </m.section>
  );
}