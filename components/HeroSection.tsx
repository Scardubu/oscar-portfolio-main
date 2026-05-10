// CONVICTION ENGINE v15.1 — HeroSection
//
// CHANGELOG from v15.0:
//
//   FIX:  Duplicate `style` prop on <m.section>. JSX allows only one `style`
//     attribute per element — the second silently overwrites the first.
//     In v15.0, `style={{ opacity: heroOpacity }}` was declared on one line
//     and `style={{ opacity, paddingTop, paddingBottom }}` on another.
//     TypeScript accepts this because framer-motion's m.* components accept
//     MotionStyle and CSSProperties separately, but at runtime the second
//     object wins and the MotionValue opacity never binds correctly.
//     FIX: merged into a single style object. Opacity MotionValue now applies
//     alongside the padding values as intended.
//
//   FIX:  Location kicker: "Abuja → Global" corrected to "Lagos → Global".
//     Location of record is Lagos, Nigeria.
//
//   FIX:  Proof callout: "Built in Abuja. Running globally." corrected to
//     "Built in Lagos. Running globally."
//
//   KEEP: All v15.0 mobile-native architecture — single column mobile,
//     2-column desktop grid, CTAs in thumb comfort zone (bottom 60%),
//     HeroVisual deferred below fold on mobile for LCP priority.
//   KEEP: A24 word-by-word Didone headline reveal.
//   KEEP: Spring physics on proof card hover (stiffness 420, damping 30).
//   KEEP: LiveActivityBar operational cadence proof.
//   KEEP: prefers-reduced-motion: noMotion fallback throughout.
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

// HeroVisual: SSR-disabled — hydration mismatch prevention.
const HeroVisual = dynamic(() => import('@/components/HeroVisual').then((m) => m.HeroVisual), {
  ssr: false,
  loading: () => (
    <div
      className="glass-elevated rounded-[var(--radius-xl)] w-full"
      style={{ minHeight: '320px', opacity: 0.3 }}
      aria-hidden="true"
    />
  ),
});

// ── Proof pillars ────────────────────────────────────────────────────────────
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

const HEADLINE_WORDS = ['The', 'system', 'has', 'to', 'work', 'at', '2am.'];

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // ── Scroll-linked parallax — desktop only ───────────────────────────────
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: HERO_SCROLL_CONFIG.offset,
  });

  const textY = useTransform(
    scrollYProgress,
    HERO_SCROLL_CONFIG.textRange,
    reducedMotion ? ['0%', '0%'] : HERO_SCROLL_CONFIG.textOutput,
  );

  const visualY = useTransform(
    scrollYProgress,
    HERO_SCROLL_CONFIG.visualRange,
    reducedMotion ? ['0%', '0%'] : HERO_SCROLL_CONFIG.visualOutput,
  );

  const heroOpacity = useTransform(
    scrollYProgress,
    HERO_SCROLL_CONFIG.opacityRange,
    reducedMotion ? [1, 1] : HERO_SCROLL_CONFIG.opacityOutput,
  );

  // ── Variant configuration ─────────────────────────────────────────────────
  const heroContainer = staggerContainer(0.055, 0.05);
  const proofContainer = staggerContainer(0.08, 0.45);
  const child = reducedMotion ? noMotion : fadeRise;
  const card = reducedMotion ? noMotion : cardReveal(24);
  const wordContainer = reducedMotion ? noMotion : wordRevealContainer(0.055, 0.08);

  return (
    <m.section
      id="hero"
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      // v15.1 FIX: Single merged style object — was two separate `style`
      // props. The second overwrote the first at runtime, causing the
      // scroll-linked opacity MotionValue to silently bind to nothing.
      style={{
        opacity: heroOpacity,
        paddingTop: 'clamp(5rem, 8vw, 7rem)',
        paddingBottom: 'clamp(2rem, 4vw, 6rem)',
      }}
    >
      {/* Ambient background glows — suppressed on mobile via CSS */}
      <div className="work-surface-glow" aria-hidden="true" />

      <div className="relative z-10 container">
        <div className="grid items-center gap-[var(--hero-col-gap)] lg:grid-cols-[var(--hero-left-width)_var(--hero-right-width)]">

          {/* ── Left column: conviction copy stack ─────────────────────────── */}
          <m.div
            style={{ y: textY }}
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Availability pill */}
            <m.div variants={child}>
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2"
                aria-label="Availability status: Available for Staff+ roles"
              >
                <span className="dot-live" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
                  AVAILABLE · STAFF+ ROLES
                </span>
              </div>
            </m.div>

            {/* Kicker — v15.1 FIX: "Abuja → Global" → "Lagos → Global" */}
            <m.p
              variants={child}
              className="mb-4 font-mono text-[11px] tracking-[0.14em] uppercase"
              style={{ color: 'var(--color-cyan)' }}
            >
              Full-Stack · Infrastructure · AI Systems · Lagos → Global
            </m.p>

            {/* Hero headline: A24 Didone word-by-word reveal */}
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

            {/* Didone sub-line */}
            <m.p
              variants={child}
              className="text-didone-sub mt-4 max-w-[30ch]"
              aria-hidden="true"
            >
              {"That's not a slogan. It's a design constraint."}
            </m.p>

            {/* ── Mobile CTA block — thumb comfort zone ──────────────────── */}
            {/*
              Placed immediately after headline — before body copy.
              Mobile: full-width stacked buttons, no grip shift required.
              Desktop: inline flex row.
              Conversion logic: intention first, evidence confirms.
            */}
            <m.div
              variants={child}
              className="mt-8 mb-8 cta-hero-group"
            >
              <a
                href="mailto:scardubu@gmail.com"
                className="cta-primary"
                aria-label="Email Oscar to start a conversation"
              >
                Book a Call
              </a>
              <Link href="#section-projects" className="cta-secondary">
                View Projects <span aria-hidden="true">→</span>
              </Link>
            </m.div>

            {/* Body: Stripe "you" language */}
            <m.p
              variants={child}
              className="max-w-[52ch] text-base leading-[1.8]"
              style={{ color: 'oklch(93% 0.006 264 / 0.72)' }}
            >
              Your fintech product needs to be alive at 2am, compliant in
              audit season, and fast on the first request — quiet Tuesday
              or FIRS filing deadline.
            </m.p>

            {/* Proof callout — v15.1 FIX: "Built in Abuja" → "Built in Lagos" */}
            <m.div variants={child} className="hero-proof-callout">
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'oklch(93% 0.006 264 / 0.55)' }}
              >
                TaxBridge: filing time 4h → 15 min. SabiScore: zero data-loss
                across 90-day production window. Built in Lagos. Running globally.
              </p>
            </m.div>

            {/* Performance bar */}
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

            {/* Ghost CV link */}
            <m.div variants={child} className="mt-4 mb-2">
              <a
                href="/cv/oscar-ndugbu-resume.pdf"
                download
                className="cta-ghost"
                aria-label="Download Oscar's resume as PDF"
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>
            </m.div>

            {/* Live activity bar */}
            <m.div variants={child} className="mt-4">
              <LiveActivityBar />
            </m.div>

            {/* Proof cards grid */}
            <m.div
              variants={proofContainer}
              initial="hidden"
              animate="visible"
              className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {PROOF_COLUMNS.map((column) => (
                <m.article
                  key={column.label}
                  variants={card}
                  className="proof-card"
                  whileHover={
                    reducedMotion
                      ? undefined
                      : { y: -2, transition: { type: 'spring', stiffness: 420, damping: 30 } }
                  }
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

          {/* ── Right column: HeroVisual — desktop only ─────────────────────── */}
          <m.div style={{ y: visualY }} className="hidden lg:block">
            <HeroVisual />
          </m.div>

        </div>

        {/* ── Mobile HeroVisual — below fold, after proof ─────────────────── */}
        {/*
          v15: On mobile, HeroVisual renders AFTER the conversion content.
          Preserves LCP for the text headline while still providing
          live metrics terminal as credibility reinforcement below fold.
          Hidden on desktop — handled by the grid column above.
        */}
        <div className="mt-10 lg:hidden">
          <HeroVisual />
        </div>

      </div>
    </m.section>
  );
}
