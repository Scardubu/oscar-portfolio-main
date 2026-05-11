// CONVICTION ENGINE v17.0 — HeroSection
//
// ARCHITECTURE CHANGE FROM v16:
//
//   CONVERSION SEQUENCE REORDERED:
//     Old: Headline → Sub-line → CTA → Body → Proof callout → LiveBar → CV → Carousel → Metrics
//     New: Headline → Sub-line → Body → Conviction stats → Proof callout → LiveBar → CTA → CV → Carousel
//     Rationale: Stripe law — build conviction BEFORE the ask.
//     CTA after 3 proof signals converts 2–3x better than CTA before proof.
//
//   CONVICTION STAT STRIP (NEW):
//     Four concrete metrics rendered in a horizontal strip between body and proof callout.
//     These are irrefutable numbers, not claims: 4h→15min, 99.9%, sub-150ms, 45% MTTD.
//     Visual language: green mono values, tiny uppercase labels — engineered, not designed.
//     Mobile: 2-column grid, desktop: single row.
//
//   PROOF CALLOUT UPGRADED:
//     Background: film-teal-surface. Left border: 2px film-teal (was 2px cyan).
//     Padding increased to 0.75rem 1rem (was padding-left only).
//     Copy tightened: "TaxBridge · 4h→15min." "SabiScore · 99.9% 90-day."
//
//   CTA BLOCK MOVED DOWN:
//     CTA group now sits AFTER conviction stats + proof callout + LiveActivityBar.
//     On mobile, thumb ergonomics preserved: CTA is still in bottom 60% of viewport
//     because headline + stats + proof only consume ~55svh.
//
//   MOBILE CAROUSEL ITEM WIDTH:
//     v16: calc(100vw - clamp(2rem, 10vw, 6rem) - 0.75rem) — too wide on 430px.
//     v17: calc(min(88vw, 320px)) — shows 1.2 cards at 430px, clear peek signal.
//
//   KEEP: A24 word-by-word Didone headline reveal.
//   KEEP: Spring physics on proof card hover (stiffness 420, damping 30).
//   KEEP: LiveActivityBar operational cadence proof.
//   KEEP: prefers-reduced-motion: noMotion fallback throughout.
//   KEEP: Lagos → Global (location truth).
//   KEEP: scroll-linked parallax (desktop only).
//
'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

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

/* ── Headline words ────────────────────────────────────────────────────────── */
const HEADLINE_WORDS = ['The', 'system', 'has', 'to', 'work', 'at', '2am.'];

/* ── Conviction stats — irrefutable metrics pre-CTA ───────────────────────── */
const CONVICTION_STATS = [
  { value: '4h → 15min', label: 'Filing time' },
  { value: '99.9%+',     label: '90-day uptime' },
  { value: 'sub-150ms',  label: 'API p99' },
  { value: '45% MTTD',   label: 'Improvement' },
] as const;

/* ── Proof pillars — swipeable on mobile ──────────────────────────────────── */
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

/* ── Proof carousel — swipeable on mobile, grid on sm+ ───────────────────── */
function ProofCarousel({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const card = reducedMotion ? noMotion : cardReveal(24);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const itemW = el.firstElementChild?.clientWidth ?? 280;
    const idx = Math.round(el.scrollLeft / (itemW + 12));
    setActiveIndex(Math.min(idx, PROOF_COLUMNS.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Carousel — mobile scroll-snap, desktop grid */}
      <div
        ref={scrollRef}
        className="mobile-carousel -mx-[clamp(1rem,5vw,3rem)] mt-8"
        style={{ paddingInline: 'clamp(1rem, 5vw, 3rem)' }}
        role="region"
        aria-label="Production proof pillars"
      >
        {PROOF_COLUMNS.map((col) => (
          <m.article
            key={col.label}
            variants={card}
            className="mobile-carousel-item proof-card"
            whileHover={
              reducedMotion
                ? undefined
                : { y: -2, transition: { type: 'spring', stiffness: 420, damping: 30 } }
            }
            aria-label={col.label}
          >
            <p className="label-mono" style={{ color: 'var(--color-film-teal)' }}>
              {col.label}
            </p>
            <p
              className="mt-3 text-sm leading-7"
              style={{ color: 'oklch(94% 0.007 80 / 0.62)' }}
            >
              {col.body}
            </p>
          </m.article>
        ))}
      </div>

      {/* Scroll indicator dots — mobile only */}
      <div className="carousel-dots" aria-hidden="true">
        {PROOF_COLUMNS.map((_, i) => (
          <span
            key={i}
            className={`carousel-dot${i === activeIndex ? ' active' : ''}`}
          />
        ))}
      </div>
    </>
  );
}

/* ── Main HeroSection ──────────────────────────────────────────────────────── */
export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  /* ── Scroll-linked parallax — desktop only ────────────────────────────── */
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

  /* ── Variant configuration ───────────────────────────────────────────── */
  const heroContainer = staggerContainer(0.055, 0.05);
  const proofContainer = staggerContainer(0.08, 0.45);
  const child = reducedMotion ? noMotion : fadeRise;
  const wordContainer = reducedMotion ? noMotion : wordRevealContainer(0.055, 0.08);

  return (
    <m.section
      id="hero"
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
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

          {/* ── Left column: conviction copy stack ──────────────────────── */}
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

            {/* Kicker */}
            <m.p
              variants={child}
              className="mb-4 font-mono text-[11px] tracking-[0.12em] uppercase leading-relaxed"
              style={{ color: 'var(--color-film-teal)', wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              Full-Stack · Infrastructure · AI Systems · Lagos → Global
            </m.p>

            {/* Hero headline: A24 Didone word-by-word reveal */}
            <h1
              id="hero-heading"
              className="w-full text-balance"
              style={{ maxWidth: 'min(100%, 22rem)' }}
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

            {/* ── 1. Body copy — "you"-centric, 1 para max on mobile ───── */}
            {/*
              Conversion law: body copy BEFORE the ask.
              Let them understand the value proposition first.
              One crisp paragraph. No corporate filler.
            */}
            <m.p
              variants={child}
              className="mt-6 w-full text-base leading-[1.8]"
              style={{ color: 'oklch(94% 0.007 80 / 0.70)', maxWidth: 'min(100%, 52ch)', overflowWrap: 'break-word' }}
            >
              Your fintech product needs to be alive at 2am, compliant in
              audit season, and fast on the first request — quiet Tuesday
              or FIRS filing deadline.
            </m.p>

            {/* ── 2. Conviction stat strip — irrefutable metrics ────────── */}
            {/*
              Four concrete numbers. Not claims — proof.
              Engineers read these before reading the body copy.
              DMs read them as "this engineer has shipped."
            */}
            <m.div variants={child} aria-label="Performance metrics">
              <div className="conviction-stat-strip" role="list">
                {CONVICTION_STATS.map(({ value, label }) => (
                  <div key={label} className="conviction-stat" role="listitem">
                    <span className="conviction-stat-value">{value}</span>
                    <span className="conviction-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            </m.div>

            {/* ── 3. Proof callout — pre-CTA social proof anchor ─────────── */}
            {/*
              Objection: "I don't know your work."
              Answer: Two projects, two results, both in one line.
              Placed BEFORE the CTA — you earn the click.
            */}
            <m.div variants={child} className="hero-proof-callout">
              <p
                className="text-sm leading-relaxed font-medium"
                style={{ color: 'oklch(94% 0.007 80 / 0.70)' }}
              >
                TaxBridge: filing time 4h → 15 min.
                <span style={{ color: 'var(--color-text-muted)' }}> · </span>
                SabiScore: zero data-loss across 90-day production window.
                <span style={{ color: 'var(--color-text-muted)' }}> · </span>
                Built in Lagos. Running globally.
              </p>
            </m.div>

            {/* ── 4. Live activity bar — operational cadence proof ──────── */}
            <m.div variants={child} className="mt-5">
              <LiveActivityBar />
            </m.div>

            {/* ── 5. CTA block — AFTER conviction is built ─────────────── */}
            {/*
              PLACEMENT LAW: CTA after 3+ proof signals.
              On mobile at 390px: headline + stats + proof callout + LiveBar
              = ~52svh consumed. CTA lands in lower 48% — thumb comfort zone.
              Conversion sequence: intent → evidence → CTA.
            */}
            <m.div variants={child} className="mt-8 mb-4 cta-hero-group">
              <a
                href="mailto:scardubu@gmail.com"
                className="cta-primary cta-primary--lg tactile-press"
                aria-label="Email Oscar to start a conversation"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: 'var(--color-success)' }}
                  aria-hidden="true"
                />
                Book a Call
              </a>
              <Link
                href="#section-projects"
                className="cta-secondary tactile-press"
                aria-label="Jump to projects section"
              >
                View Projects <span aria-hidden="true">↓</span>
              </Link>
            </m.div>

            {/* Ghost CV link */}
            <m.div variants={child} className="mb-2">
              <a
                href="/cv/oscar-ndugbu-resume.pdf"
                download
                className="cta-ghost tactile-press"
                aria-label="Download Oscar's resume as PDF"
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>
            </m.div>

            {/* ── 6. Proof carousel: swipeable on mobile, grid on sm+ ───── */}
            {/*
              Deep proof for those who continue scrolling.
              Four engineering pillars — each card is a validation,
              not a feature. Carousel on mobile to compress scroll distance.
            */}
            <m.div
              variants={proofContainer}
              initial="hidden"
              animate="visible"
            >
              <ProofCarousel reducedMotion={reducedMotion ?? false} />
            </m.div>
          </m.div>

          {/* ── Right column: HeroVisual — desktop only ─────────────────── */}
          <m.div style={{ y: visualY }} className="hidden lg:block">
            <HeroVisual />
          </m.div>

        </div>

        {/* ── Mobile HeroVisual — below fold, credibility reinforcement ──── */}
        {/*
          On mobile, HeroVisual renders AFTER proof carousel.
          Preserves LCP for text headline. Terminal as secondary evidence.
          Hidden on desktop — handled by the grid column above.
        */}
        <div className="mt-10 lg:hidden">
          <HeroVisual />
        </div>
      </div>
    </m.section>
  );
}