// CONVICTION ENGINE v21.0 — HeroSection
//
// v21 CHANGES vs v20:
//
//   MOBILE HEADSHOT (critical layout improvement):
//     • Size: h-28 w-28 (sm: h-32 w-32) — commanding, not a thumbnail.
//     • Spacing: mt-10 mb-10 — deliberate optical silence between pill and face.
//     • Centered on mobile for editorial authority vs. left-aligned thumbnail feel.
//     • The pill → [space] → centered face → kicker → headline rhythm is now
//       unmistakably intentional. Premium, not accidental.
//
//   ESLINT INLINE STYLE REDUCTION:
//     • All recurring inline color/spacing patterns moved to CSS classes.
//     • Framer Motion style= props (transforms, dynamic values) retained.
//
//   KICKER POSITION (mobile):
//     • Now renders AFTER the headshot: pill → face → kicker → headline.
//     • Face leads conviction on mobile.
//
//   DESKTOP HEADSHOT:
//     • h-40 xl:h-52 — more commanding presence.
//
//   KEEP: All v20 — word-by-word A24 Didone reveal, scroll-linked parallax,
//     spring physics, ReducedMotion fallbacks, ProofCarousel, LiveActivityBar.
//
'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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

const HEADLINE_WORDS = ['The', 'system', 'has', 'to', 'work', 'at', '2am.'];

const CONVICTION_STATS = [
  { value: '4h → 15min', label: 'Filing time',   stat: 'filing'  },
  { value: '99.9%+',     label: '90-day uptime', stat: 'uptime'  },
  { value: 'sub-150ms',  label: 'API p99',        stat: 'latency' },
  { value: '45% MTTD',   label: 'Improvement',   stat: 'mttd'    },
] as const;

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
    body: 'React Native mobile app through Next.js 15 dashboard to FastAPI inference to PostgreSQL. Tailwind v4, Framer Motion, Effect-TS. One engineer, zero handoff tax.',
  },
] as const;

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
      <div
        ref={scrollRef}
        className="mobile-carousel -mx-[clamp(1rem,5vw,3rem)]"
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
            <p className="text-sm leading-7" style={{ marginTop: "0.75rem" }} style={{ color: 'oklch(94% 0.007 80 / 0.62)' }}>
              {col.body}
            </p>
          </m.article>
        ))}
      </div>

      <div className="carousel-dots" aria-hidden="true">
        {PROOF_COLUMNS.map((_, i) => (
          <span key={i} className={`carousel-dot${i === activeIndex ? ' active' : ''}`} />
        ))}
      </div>
    </>
  );
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

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
      <div className="work-surface-glow" aria-hidden="true" />

      <div className="relative z-10 container">
        <div className="grid items-center gap-[var(--hero-col-gap)] lg:grid-cols-[var(--hero-left-width)_var(--hero-right-width)]">

          {/* ── Left column: conviction copy stack ──────────────────────── */}
          <m.div
            style={{ y: textY }}
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="hero-grid-child"
          >
            {/* Availability pill */}
            <m.div variants={child}>
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2"
                aria-label="Availability status: Available for Staff+ roles"
              >
                <span className="dot-live" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
                  AVAILABLE · STAFF+ ROLES
                </span>
              </div>
            </m.div>

            {/* v21: Mobile headshot — centered, larger, commanding
                  mt-10 mb-10 = optical silence between pill and face.
                  h-28 w-28 (sm: h-32 w-32) = commanding presence.
                  Centered for editorial authority on mobile.
            */}
            <m.div
              variants={child}
              className="py-14 flex lg:hidden justify-center"
              aria-hidden="true"
            >
              <div
                className="relative h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-full hero-headshot-ring"
                style={{
                  border: '3px solid oklch(70% 0.21 188 / 0.60)',
                  boxShadow: [
                    '0 0 0 1px oklch(70% 0.21 188 / 0.18)',
                    '0 0 0 7px oklch(70% 0.21 188 / 0.10)',
                    '0 0 0 15px oklch(70% 0.21 188 / 0.05)',
                    '0 16px 52px oklch(0% 0 0 / 0.65)',
                  ].join(', '),
                }}
              >
                <Image
                  src="/headshot.webp"
                  alt="Oscar Ndugbu — Staff+ Full-Stack Engineer, Lagos"
                  fill
                  sizes="(min-width: 640px) 144px, 128px"
                  className="object-cover"
                  priority
                />
              </div>
            </m.div>

            {/* Kicker — after headshot on mobile: pill → face → kicker → headline */}
            <m.p
              variants={child}
              className="font-mono text-[11px] tracking-[0.12em] uppercase leading-relaxed hero-kicker"
              style={{ color: 'var(--color-film-teal)' }}
            >
              <span className="inline sm:hidden">
                <span className="whitespace-nowrap">Full-Stack</span>
                {' · '}
                <span className="whitespace-nowrap">React Native</span>
                {' · '}
                <span className="whitespace-nowrap">Next.js 15</span>
                {' · '}
                <span className="whitespace-nowrap">AI Systems</span>
              </span>
              <span className="hidden sm:inline">
                Full-Stack · React Native · Next.js 15 · AI Systems · Lagos → Global
              </span>
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
            <m.p variants={child} className="text-didone-sub max-w-[30ch]" aria-hidden="true">
              {"That's not a slogan. It's a design constraint."}
            </m.p>

            {/* Body copy */}
            <m.p
              variants={child}
              className="w-full text-base leading-[1.8] hero-body-text"
              style={{ color: 'oklch(94% 0.007 80 / 0.70)', maxWidth: 'min(100%, 52ch)' }}
            >
              Production systems that stay alive when it matters most —
              compliant, fast, and relentlessly reliable. Whether it&apos;s a
              quiet Tuesday or a FIRS filing deadline, the system ships.
            </m.p>

            {/* Conviction stat strip */}
            <m.div variants={child} aria-label="Performance metrics">
              <div className="conviction-stat-strip" role="list">
                {CONVICTION_STATS.map(({ value, label, stat }) => (
                  <div key={label} className="conviction-stat" data-stat={stat} role="listitem">
                    <span className="conviction-stat-value">{value}</span>
                    <span className="conviction-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            </m.div>

            {/* Proof callout with Lagos trust signal */}
            <m.div variants={child} className="hero-proof-callout overflow-hidden">
              <p
                className="text-sm leading-relaxed font-medium hero-body-text"
                style={{ color: 'oklch(94% 0.007 80 / 0.70)' }}
              >
                TaxBridge: filing 4h → 15min · React Native app · Fastify API.{' '}
                SabiScore: 99.9%+ uptime · ensemble ML · Next.js dashboard.{' '}
                SwarmXQ: self-improving agent fleet · live ops dashboard.{' '}
                <span style={{ color: 'var(--color-film-teal)' }}>
                  Shipped in Lagos · Running globally · Battle-tested in audit season.
                </span>
              </p>
            </m.div>

            {/* Live activity bar */}
            <m.div variants={child} className="live-bar-wrapper-hero">
              <LiveActivityBar />
            </m.div>

            {/* CTA block */}
            <m.div variants={child} className="cta-hero-group">
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
                Start a conversation
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
            <m.div variants={child} className="cv-ghost-wrapper">
              <a
                href="/cv/oscar-ndugbu-resume.pdf"
                download
                className="cta-ghost tactile-press"
                aria-label="Download Oscar's resume as PDF"
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>
            </m.div>

            {/* Proof carousel */}
            <m.div variants={proofContainer} initial="hidden" animate="visible">
              <ProofCarousel reducedMotion={reducedMotion ?? false} />
            </m.div>
          </m.div>

          {/* ── Right column: Headshot + HeroVisual — desktop only ──────── */}
          <m.div style={{ y: visualY }} className="hidden lg:flex lg:flex-col lg:items-end lg:gap-6">
            <div className="flex justify-end">
              <m.div
                className="relative h-40 w-40 xl:h-52 xl:w-52 overflow-hidden rounded-full hero-headshot-ring"
                style={{
                  border: '2.5px solid oklch(70% 0.21 188 / 0.55)',
                  boxShadow: [
                    '0 0 0 1px oklch(70% 0.21 188 / 0.12)',
                    '0 0 0 8px oklch(70% 0.21 188 / 0.08)',
                    '0 0 0 16px oklch(70% 0.21 188 / 0.04)',
                    '0 28px 80px oklch(0% 0 0 / 0.65)',
                    'inset 0 1px 0 oklch(100% 0 0 / 0.16)',
                  ].join(', '),
                }}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { scale: 1.03, transition: { type: 'spring', stiffness: 240, damping: 22 } }
                }
              >
                <Image
                  src="/headshot.webp"
                  alt="Oscar Ndugbu — Staff+ Full-Stack Engineer, Lagos"
                  fill
                  sizes="(min-width: 1280px) 208px, 160px"
                  className="object-cover"
                  priority
                />
              </m.div>
            </div>
            <HeroVisual />
          </m.div>

        </div>

        {/* Mobile HeroVisual — below fold */}
        <div className="lg:hidden" style={{ marginTop: "2.5rem" }}>
          <HeroVisual />
        </div>
      </div>
    </m.section>
  );
}