// CONVICTION ENGINE v16.0 — HeroSection
//
// CHANGELOG from v15.1:
//
//   MOBILE ARCHITECTURE OVERHAUL:
//     - Proof cards moved to horizontal scroll-snap carousel on mobile.
//       4 cards ≤ 430px = excessive scroll before next section. Carousel
//       shows 1.15 cards (peek) to signal swipeability — no grip shift.
//     - Proof carousel replaced full-width grid (sm:grid-cols-2) — grid
//       preserved at 640px+.
//     - ProofCarousel component with CarouselDot indicator row.
//
//   FOLD COMPRESSION:
//     - Body copy reduced from 2 paragraphs to 1 (DM copy tightened).
//     - Performance bar moved BELOW proof carousel — after evidence, not before.
//     - Ghost CV link moved after LiveActivityBar — conversion sequence: intent
//       → proof → credential download.
//     - HeroVisual on mobile: remains below fold, below carousel.
//
//   CTA UPGRADE:
//     - cta-primary upgraded to cta-primary--lg on mobile (56px height).
//     - tactile-press class added for immediate :active feedback on touch.
//     - Contact sticky CTA (FloatingCTA) injected globally via ContactStickyLoader.
//
//   KEEP: A24 word-by-word Didone headline reveal.
//   KEEP: Spring physics on proof card hover (stiffness 420, damping 30).
//   KEEP: LiveActivityBar operational cadence proof.
//   KEEP: prefers-reduced-motion: noMotion fallback throughout.
//   KEEP: Lagos → Global (v15.1 fix).
//   KEEP: scroll-linked parallax (desktop only — mobilé hook returns [0,1]→[0%,0%]).
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

/* ── Proof pillars ────────────────────────────────────────────────────────── */
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
        {PROOF_COLUMNS.map((col, i) => (
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
            <p className="label-mono" style={{ color: 'var(--color-cyan)' }}>
              {col.label}
            </p>
            <p
              className="mt-3 text-sm leading-7"
              style={{ color: 'oklch(93% 0.006 264 / 0.65)' }}
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

            {/* ── CTA block — thumb comfort zone, immediately after headline ── */}
            {/*
              Mobile: 56px full-width "Book a Call" + secondary "View Projects".
              Desktop: inline flex row, standard 48px height.
              Conversion sequence: intent → evidence. CTA before body copy.
            */}
            <m.div variants={child} className="mt-8 mb-8 cta-hero-group">
              <a
                href="mailto:scardubu@gmail.com"
                className="cta-primary cta-primary--lg tactile-press"
                aria-label="Email Oscar to start a conversation"
              >
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

            {/* Body: Stripe "you" language — 1 paragraph max on mobile */}
            <m.p
              variants={child}
              className="max-w-[52ch] text-base leading-[1.8]"
              style={{ color: 'oklch(93% 0.006 264 / 0.72)' }}
            >
              Your fintech product needs to be alive at 2am, compliant in
              audit season, and fast on the first request — quiet Tuesday
              or FIRS filing deadline.
            </m.p>

            {/* Proof callout — objection: "I don't know your work" */}
            <m.div variants={child} className="hero-proof-callout">
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'oklch(93% 0.006 264 / 0.55)' }}
              >
                TaxBridge: filing time 4h → 15 min. SabiScore: zero data-loss
                across 90-day production window. Built in Lagos. Running globally.
              </p>
            </m.div>

            {/* Live activity bar — operational cadence proof */}
            <m.div variants={child} className="mt-4">
              <LiveActivityBar />
            </m.div>

            {/* Ghost CV link */}
            <m.div variants={child} className="mt-4 mb-2">
              <a
                href="/cv/oscar-ndugbu-resume.pdf"
                download
                className="cta-ghost tactile-press"
                aria-label="Download Oscar's resume as PDF"
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>
            </m.div>

            {/* ── Proof carousel: swipeable on mobile, grid on sm+ ─────────── */}
            {/*
              v16: Proof cards moved out of the main stagger container.
              They animate as a batch below the above content.
              On mobile: horizontal snap carousel with dot indicators.
              On sm+: 2-column grid (existing behavior preserved).
            */}
            <m.div
              variants={proofContainer}
              initial="hidden"
              animate="visible"
            >
              <ProofCarousel reducedMotion={reducedMotion ?? false} />
            </m.div>

            {/* Performance bar — below proof, as validation not teaser */}
            <m.p
              variants={child}
              className="mt-6 font-mono text-[11px] tracking-widest uppercase"
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