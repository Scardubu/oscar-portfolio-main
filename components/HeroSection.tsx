// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import { LiveActivityBar } from '@/components/Liveactivitybar';
import { CV_ASSET_PATH, anchorUrl } from '@/lib/config';
import {
  HERO_SCROLL_CONFIG,
  cardReveal,
  fadeRise,
  noMotion,
  staggerContainer,
  wordReveal,
  wordRevealContainer,
} from '@/lib/motionVariants';
import { HERO } from '@/lib/portfolio-data';

const HeroVisual = dynamic(() => import('@/components/HeroVisual').then((m) => m.HeroVisual), {
  ssr: false,
  loading: () => (
    <div
      className="glass-elevated min-h-[320px] w-full rounded-[var(--radius-xl)] opacity-30"
      aria-hidden="true"
    />
  ),
});

const HEADLINE_WORDS = ['The', 'system', 'has', 'to', 'work', 'at', '2am.'];

// v26 FIX: Synced to lib/portfolio-data.ts CONVICTION_STATS (canonical source).
// '45% MTTD' / 'Improvement' replaces '45% faster' / 'Alert detection' —
// MTTD is the precise Prometheus-traceable metric; "faster" was imprecise.
const CONVICTION_STATS = [
  { value: '4h → 15min', label: 'Filing time', stat: 'filing' },
  { value: '99.9%+', label: '90-day uptime', stat: 'uptime' },
  { value: 'sub-150ms', label: 'API p99', stat: 'latency' },
  { value: '45% MTTD', label: 'Improvement', stat: 'mttd' },
] as const;

// v26 FIX: PROOF_COLUMNS body copy updated to match corrected stat.
// "45% MTTD improvement over reactive alerting baseline" replaces
// "45% faster alert detection" — consistent with SabiScore outcomes[].
const PROOF_COLUMNS = [
  {
    label: 'LIVE IN PRODUCTION',
    body: 'SabiScore holds 99.9%+ uptime across a 90-day Prometheus window. Ensemble XGBoost, LightGBM, and CatBoost inference delivered 45% MTTD improvement over reactive alerting baseline. Production reality, not staging theater.',
  },
  {
    label: 'DECISIONS DOCUMENTED',
    body: 'Every tradeoff is written as Chosen / Over / Because. The next engineer inherits clear architectural reasoning instead of hunting context in chat logs or tribal memory.',
  },
  {
    label: 'ZERO-DOWNTIME DESIGN',
    body: 'Health checks, idempotent BullMQ queues, circuit breakers, and scoped rate limits ship in the foundation — before the first incident, never as emergency patches.',
  },
  {
    label: 'FULL STACK OWNERSHIP',
    body: 'React Native mobile → Next.js 15 dashboard → FastAPI inference → PostgreSQL. One engineer owns the entire surface. Zero handoff tax. Zero blame diffusion.',
  },
] as const;

function formatAvailabilityMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Recently verified';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function ProofCarousel({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  const cardVariants = reducedMotion ? noMotion : cardReveal(24);

  /** Programmatic scroll with fallback */
  const scrollToIndex = useCallback(
    (index: number) => {
      const root = scrollRef.current;
      const target = cardRefs.current[index];
      if (!root || !target) return;

      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        inline: 'start',
        block: 'nearest',
      });
      setActiveIndex(index);
    },
    [reducedMotion]
  );

  /** Full keyboard navigation */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

      e.preventDefault();

      if (e.key === 'Home') {
        scrollToIndex(0);
        return;
      }
      if (e.key === 'End') {
        scrollToIndex(PROOF_COLUMNS.length - 1);
        return;
      }

      const direction = e.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(PROOF_COLUMNS.length - 1, activeIndex + direction));
      scrollToIndex(nextIndex);
    },
    [activeIndex, scrollToIndex]
  );

  /** Desktop detection */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setIsDesktop(mq.matches);

    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /** Intersection Observer for active card tracking */
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    if (isDesktop) {
      setActiveIndex(0);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = 0;
        let bestRatio = 0;

        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target as HTMLElement);
          if (index === -1) return;

          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = index;
          }
        });

        if (bestRatio > 0.35) {
          setActiveIndex(bestIndex);
        }
      },
      {
        root,
        threshold: [0.4, 0.75],
        rootMargin: '-8px 0px -12px 0px',
      }
    );

    const validCards = cardRefs.current.filter(Boolean) as HTMLElement[];
    validCards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [isDesktop]);

  const activeLabel = PROOF_COLUMNS[activeIndex]?.label ?? PROOF_COLUMNS[0].label;

  return (
    <>
      <p id="hero-proof-help" className="sr-only">
        Production proof pillars. On mobile, swipe horizontally or use arrow keys, Home, and End. On
        larger screens, displayed as a two-column grid.
      </p>
      <p id="hero-proof-status" className="sr-only" aria-live="polite">
        Showing proof {activeIndex + 1} of {PROOF_COLUMNS.length}: {activeLabel}
      </p>

      <div className="relative">
        <div
          ref={scrollRef}
          className="mobile-carousel -mx-[clamp(1rem,5vw,3rem)] snap-x snap-mandatory scroll-smooth [padding-inline:clamp(1rem,5vw,3rem)]"
          role="region"
          aria-roledescription="carousel"
          aria-describedby="hero-proof-help hero-proof-status"
          aria-label="Production proof pillars"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {PROOF_COLUMNS.map((col, index) => (
            <m.article
              key={col.label}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              variants={cardVariants}
              className="mobile-carousel-item proof-card snap-center"
              whileHover={
                reducedMotion
                  ? undefined
                  : { y: -3, transition: { type: 'spring', stiffness: 400, damping: 28 } }
              }
              aria-label={`${index + 1} of ${PROOF_COLUMNS.length}: ${col.label}`}
            >
              <p className="label-mono text-color-film-teal">{col.label}</p>
              <p className="mt-3 text-sm leading-7 text-[oklch(94%_0.007_80_/_0.62)]">{col.body}</p>
            </m.article>
          ))}
        </div>

        {/* Scroll fade affordance - mobile only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-[var(--color-bg)]/90 sm:hidden"
        />
      </div>

      <div className="carousel-dots sm:hidden" aria-hidden="true">
        {PROOF_COLUMNS.map((_, i) => (
          <span key={i} className={`carousel-dot${i === activeIndex ? 'active' : ''}`} />
        ))}
      </div>
    </>
  );
}

// V1.0 Change 7: Count-up animation for CONVICTION_STATS.
// Numeric values animate 0 → target over 600ms (easeOutQuart) on first viewport
// intersection. Non-numeric strings ("4h → 15min", "sub-150ms", "45% MTTD")
// render immediately — intentional per spec. prefers-reduced-motion respected.
function ConvictionStat({
  value,
  label,
  stat,
  reducedMotion,
  shouldAnimate,
}: {
  value: string;
  label: string;
  stat: string;
  reducedMotion: boolean;
  shouldAnimate: boolean;
}) {
  const [displayed, setDisplayed] = useState(value);
  const frameRef = useRef<number | null>(null);
  const numericMatch = value.match(/^(\d+(?:\.\d+)?)(.*)/);

  useEffect(() => {
    if (reducedMotion || !shouldAnimate || !numericMatch) {
      setDisplayed(value);
      return;
    }
    const target = parseFloat(numericMatch[1]);
    const suffix = numericMatch[2];
    const duration = 600;
    const start = performance.now();

    function easeOutQuart(t: number) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = target * easeOutQuart(progress);
      const formatted = Number.isInteger(target)
        ? Math.round(current).toString()
        : current.toFixed(1);
      setDisplayed(formatted + suffix);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(value);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAnimate, reducedMotion]);

  return (
    <div className="conviction-stat" data-stat={stat} role="listitem">
      <span className="conviction-stat-value">{displayed}</span>
      <span className="conviction-stat-label">{label}</span>
    </div>
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
    reducedMotion ? ['0%', '0%'] : HERO_SCROLL_CONFIG.textOutput
  );

  const visualY = useTransform(
    scrollYProgress,
    HERO_SCROLL_CONFIG.visualRange,
    reducedMotion ? ['0%', '0%'] : HERO_SCROLL_CONFIG.visualOutput
  );

  const heroOpacity = useTransform(
    scrollYProgress,
    HERO_SCROLL_CONFIG.opacityRange,
    reducedMotion ? [1, 1] : HERO_SCROLL_CONFIG.opacityOutput
  );

  const heroContainer = staggerContainer(0.055, 0.05);
  const proofContainer = staggerContainer(0.08, 0.45);
  const child = reducedMotion ? noMotion : fadeRise;
  const wordContainer = reducedMotion ? noMotion : wordRevealContainer(0.055, 0.08);

  // V1.0 Change 7: IntersectionObserver for count-up — fires once on first viewport entry
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <m.section
      id="hero"
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-start overflow-hidden sm:justify-center"
      // eslint-disable-next-line no-restricted-syntax
      style={{
        opacity: heroOpacity,
        paddingTop: 'clamp(4rem, 6vw, 6.5rem)',
        paddingBottom: 'clamp(2rem, 5vw, 7rem)',
      }}
    >
      <div className="work-surface-glow" aria-hidden="true" />

      <div className="relative z-10 container">
        <div className="grid items-center gap-[var(--hero-col-gap)] lg:grid-cols-[var(--hero-left-width)_var(--hero-right-width)]">
          {/* ── Left Column: Conviction Content ── */}
          <m.div
            // eslint-disable-next-line no-restricted-syntax
            style={{ y: textY }}
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="hero-grid-child"
          >
            {/* Availability Pill — dark pattern ban: no fake slot counts or artificial deadlines */}
            <m.div variants={child}>
              <div
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2"
                aria-label="Currently available for Staff+ roles"
              >
                <span className="dot-live" aria-hidden="true" />
                <span className="font-mono text-[11px] leading-tight tracking-widest text-white/70 uppercase">
                  AVAILABLE · STAFF+ ROLES
                  <span className="ml-2 text-[9px] tracking-normal normal-case opacity-50">
                    · Updated {formatAvailabilityMonthYear(HERO.availabilityLastUpdated)}
                  </span>
                </span>
              </div>
            </m.div>

            {/* Mobile Headshot */}
            <m.div
              variants={child}
              className="flex justify-center py-8 sm:py-12 lg:hidden"
              aria-hidden="true"
            >
              <div
                className="hero-headshot-ring relative h-32 w-32 overflow-hidden rounded-full sm:h-36 sm:w-36"
                // eslint-disable-next-line no-restricted-syntax
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
                  src="/images/scar-headshot.jpeg"
                  alt="Oscar Ndugbu — Staff+ Full-Stack Engineer, Lagos"
                  fill
                  sizes="(min-width: 640px) 144px, 128px"
                  className="object-cover"
                  priority
                />
              </div>
            </m.div>

            {/* Kicker */}
            <m.p
              variants={child}
              className="hero-kicker text-color-film-teal font-mono text-[11px] leading-relaxed tracking-[0.12em] uppercase"
            >
              <span className="inline sm:hidden">
                <span className="whitespace-nowrap">Full-Stack</span>
                {' · '}
                <span className="whitespace-nowrap">React Native</span>
                {' · '}
                <span className="whitespace-nowrap">Next.js 15</span>
                <br />
                <span className="whitespace-nowrap">AI Systems</span>
                {' · '}
                <span className="whitespace-nowrap">Lagos → Global</span>
              </span>
              <span className="hidden sm:inline">
                Full-Stack · React Native · Next.js 15 · AI Systems · Lagos → Global
              </span>
            </m.p>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="w-full [max-width:min(100%,22rem)] text-balance"
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
                    // eslint-disable-next-line no-restricted-syntax
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

            <m.p variants={child} className="text-didone-sub max-w-[30ch]" aria-hidden="true">
              {"That's not a slogan. It's a design constraint."}
            </m.p>

            {/* Body */}
            <m.p
              variants={child}
              className="hero-body-text w-full [max-width:min(100%,56ch)] text-base leading-[1.8] text-[oklch(94%_0.007_80_/_0.70)]"
            >
              Production systems that stay alive when it matters most — compliant, fast, and
              relentlessly reliable. Built under Lagos constraints. Deployed to global standards.
            </m.p>

            {/* Stats Strip — V1.0 Change 7: count-up on viewport intersection */}
            <m.div variants={child} aria-label="Performance metrics" ref={statsRef}>
              <div className="conviction-stat-strip" role="list">
                {CONVICTION_STATS.map(({ value, label, stat }) => (
                  <ConvictionStat
                    key={label}
                    value={value}
                    label={label}
                    stat={stat}
                    reducedMotion={Boolean(reducedMotion)}
                    shouldAnimate={statsVisible}
                  />
                ))}
              </div>
            </m.div>

            {/* Proof Callout — v27.1: rhythm fix — each system on its own line via block spans for better readability at sm viewport */}
            <m.div variants={child} className="hero-proof-callout hidden overflow-hidden sm:block">
              <p className="hero-body-text text-sm leading-7 font-medium text-[oklch(94%_0.007_80_/_0.70)]">
                <span className="block">
                  TaxBridge: 4h → 15min filing · NRS compliance · zero data-loss record.
                </span>
                <span className="block">
                  SabiScore: 99.9%+ uptime · 45% MTTD improvement · ensemble ML inference.
                </span>
                <span className="block">
                  SwarmXQ: self-improving agent fleet · checkpoint recovery · zero manual tuning.
                </span>
                <span className="text-color-film-teal mt-1 block">
                  Shipped in Lagos · Running globally · Battle-tested.
                </span>
              </p>
            </m.div>

            <m.div variants={child} className="live-bar-wrapper-hero">
              <LiveActivityBar />
            </m.div>

            {/* CTAs */}
            <m.div variants={child} className="cta-hero-group">
              <Link
                href={anchorUrl('section-contact')}
                className="cta-primary cta-primary--lg tactile-press"
                aria-label="Tell me about your constraints"
              >
                <span
                  className="bg-color-success inline-block h-2 w-2 rounded-full"
                  aria-hidden="true"
                />
                Tell me your constraints
              </Link>
              <Link
                href={anchorUrl('section-projects')}
                className="cta-secondary tactile-press"
                aria-label="See the work"
              >
                See the work <span aria-hidden="true">↓</span>
              </Link>
            </m.div>

            <m.div variants={child} className="response-reassurance">
              {/* v27.1 FIX: flex row replaces inline-block + align-middle.
                  On iOS Safari, a h-1.5 inline-block dot with align-middle
                  visually merges with the capital "I" at 10px mono — the
                  baseline offset collapses the gap that mr-1.5 should create.
                  Flex + items-center is cross-browser reliable. */}
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-[oklch(93%_0.006_264_/_0.50)]">
                <span
                  className="bg-color-success inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  aria-hidden="true"
                />
                I respond within 24 hours — usually faster.
              </p>
            </m.div>

            <m.div variants={child} className="cv-ghost-wrapper">
              <a
                href={CV_ASSET_PATH}
                download
                className="cta-ghost tactile-press"
                aria-label="Download Oscar's resume as PDF"
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>
            </m.div>

            {/* V1.0 Change 2: Warmup micro-CTA — per spec §CONVERSION_MISS:warmup.
                For the evaluating visitor who reads before committing.
                mono 12px, opacity 0.45, not a button. */}
            <m.div variants={child} className="mt-2">
              <Link
                href={anchorUrl('section-writing')}
                className="text-color-text-muted font-mono text-[12px] opacity-45 transition-opacity hover:opacity-70"
                aria-label="Read how the 2am constraint became the design system"
              >
                Or read how the 2am constraint became the design system →
              </Link>
            </m.div>

            {/* Proof Carousel */}
            <m.div variants={proofContainer} initial="hidden" animate="visible">
              <ProofCarousel reducedMotion={Boolean(reducedMotion)} />
            </m.div>

            {/* V1.0 Change 8: ⌘K hint — surfaces the command palette for power users.
                Per spec §DELIGHT_MISS:personality. Hidden from screen readers (aria-hidden). */}
            <m.div
              variants={child}
              className="mt-4 flex transform-gpu justify-end"
              aria-hidden="true"
            >
              <button
                type="button"
                onClick={() => globalThis.dispatchEvent(new Event('command-palette:open'))}
                className="border-color-border text-color-text-muted inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 font-mono text-[10px] tracking-widest uppercase opacity-30 transition-opacity hover:opacity-60"
                aria-label="Open command palette"
              >
                <kbd>⌘K</kbd>
                <span>Navigate</span>
              </button>
            </m.div>
          </m.div>

          {/* ── Right Column: Desktop Visuals ── */}
          <m.div
            // eslint-disable-next-line no-restricted-syntax
            style={{ y: visualY }}
            className="hidden lg:flex lg:flex-col lg:items-end lg:gap-6"
          >
            <div className="flex justify-end">
              <m.div
                className="hero-headshot-ring relative h-40 w-40 overflow-hidden rounded-full xl:h-52 xl:w-52"
                // eslint-disable-next-line no-restricted-syntax
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
      </div>
    </m.section>
  );
}
