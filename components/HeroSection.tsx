// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// CHANGELOG v2026.7 (cumulative — all prior fixes included):
//
//   FIX 7 (v2026.7): Hero section overflow corrected to `overflow-x-clip`.
//           Previous `overflow-x-hidden overflow-y-visible` was upgraded by the
//           CSS spec (CSS Overflow §3) to compute `overflow-y: auto`, turning
//           the hero into a potential inner scroll container at exactly viewport
//           height. `overflow-x-clip` clips horizontally without creating a BFC
//           or scroll container — native and Lenis scroll remain free.
//           Desktop preserves `lg:overflow-hidden` for parallax containment.
//
//   FIX 8 (v2026.7): Carousel dot active-class string concatenation, again.
//           The v2026.3 changelog claimed the fix landed; the live source
//           still emitted `carousel-dotactive` (single token). Now correctly
//           emits `carousel-dot active` (compound). The `.carousel-dot.active::before`
//           pill-expansion + chapter-accent animation now matches as designed.
//           The `[role='tab'][aria-selected='true']` belt-and-suspenders rule
//           had been masking partial correctness, but the ::before width/color
//           animation was silently inactive on every dot click.
//
//   COMPANION (globals.css v2026.7): html/body switched to `overflow-x: clip`
//           at cascade end, neutralising the reversed fixes.css import order in
//           layout.tsx and resolving the iOS Safari scroll trap + absolutely-
//           positioned-descendant rendering failures (Next.js `fill` images).
//           Also scopes a `transform-style: flat` override to <1024px on the
//           IdentityCard figure to defeat the WebKit ancestor-preserve-3d-
//           disables-descendant-overflow-hidden clipping bug — the portrait
//           now renders correctly inside its rounded-corner mask on iOS Safari.
//
// CHANGELOG v2026.4 (retained for traceability):
//
//   FIX 1 (v2026.3): carousel-dot active class — `' active'` space added.
//           `.carousel-dot.active` is a compound selector; "carousel-dotactive"
//           (no space) never matched it. Active pill indicator was silently broken.
//
//   FIX 2 (v2026.3): HeroPortrait — removed ghost CSS classes `hero-headshot-container`
//           and `hero-headshot-rail` (desktop) — zero CSS rules, inert noise from
//           refactors. Layout owned by hero-headshot-frame (desktop) and
//           mobile-headshot-wrap (mobile) — both have canonical CSS definitions.
//
//   FIX 3 (v2026.4): proofContainer double-animation driver — removed.
//           The `m.div variants={proofContainer} initial="hidden" animate="visible"` wrapper
//           was a nested independent animation runner inside heroContainer, which
//           already drives the cascade. Having two separate `animate="visible"` triggers
//           on ancestor/descendant m.* elements causes sequencing drift: the carousel
//           could animate in before the stagger reaches it. Replaced with
//           `variants={child}` — inherits heroContainer orchestration, animates at the
//           correct stagger position, and no longer double-drives the visible state.
//
//   FIX 4 (v2026.4): proofContainer import — staggerContainer import retained
//           for heroContainer construction. proofContainer variable removed.
//
//   FIX 5 (v2026.5): portrait geometry decoupled from legacy global hero
//           selectors. Mobile and desktop wrappers now reserve deterministic
//           4:5 media space directly in component classes, eliminating CLS and
//           narrow-screen composition drift caused by competing global rules.
//
//   FIX 6 (v2026.5): right-rail parallax now maps to hero-local scroll range
//           using provider scrollY as source-of-truth. This avoids jitter from
//           full-page normalization changes during async layout growth.

'use client';

import { IdentityCard, type IdentityCardVariant } from '@/components/IdentityCard';
import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { trackEvent } from '@/app/lib/analytics';
import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import { LiveActivityBar } from '@/components/Liveactivitybar';
import { useMagnetic } from '@/hooks/useMagnetic';
import { CV_ASSET_PATH, anchorUrl } from '@/lib/config';
import { trackMetricView } from '@/lib/metrics/analytics';
import {
  cardReveal,
  fadeRise,
  hoverLift,
  magneticButton,
  noMotion,
  staggerContainer,
  wordReveal,
  wordRevealContainer,
} from '@/lib/motionVariants';
import { CONVICTION_STATS, HERO } from '@/lib/portfolio-data';
import { formatMonthYear } from '@/lib/utils';

const HeroVisual = dynamic(() => import('@/components/HeroVisual').then((m) => m.HeroVisual), {
  ssr: false,
  loading: () => (
    <div
      className="glass-elevated min-h-[320px] w-full rounded-[var(--radius-xl)] opacity-30"
      aria-hidden="true"
    />
  ),
});

const HEADLINE_WORDS = HERO.h1.split(' ') as readonly string[];
const TRUST_STRIP_ITEMS = HERO.trustStrip.split(' · ') as readonly string[];

type HeroMetricKey = (typeof CONVICTION_STATS)[number]['stat'];

const METRIC_DETAILS: Record<
  HeroMetricKey,
  {
    source: string;
    detail: string;
    status: string;
  }
> = {
  filing: {
    source: 'TaxBridge · NRS',
    detail: 'Compressed a live tax workflow under real audit-season pressure.',
    status: 'Audit live',
  },
  uptime: {
    source: 'Prometheus · 90d',
    detail: 'Observed in production over time, not reconstructed from staging.',
    status: 'Healthy',
  },
  latency: {
    source: 'API surface · p99',
    detail: 'Fast under real user load, with Lagos network reality in the loop.',
    status: 'Stable',
  },
  mttd: {
    source: 'SabiScore · ops',
    detail: 'Detection tightened before incidents could turn into user pain.',
    status: 'Improved',
  },
};

type HeroPortraitVariant = IdentityCardVariant;

function HeroPortrait({
  reducedMotion,
  variant,
  className,
  priority,
}: Readonly<{
  reducedMotion: boolean;
  variant: HeroPortraitVariant;
  className?: string;
  priority?: boolean;
}>) {
  return (
    <IdentityCard
      className={className}
      priority={priority}
      reducedMotion={reducedMotion}
      variant={variant}
    />
  );
}

// v26 FIX: PROOF_COLUMNS body copy updated to match corrected stat.
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

        if (bestRatio > 0.35) setActiveIndex(bestIndex);
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
          className="mobile-carousel snap-x snap-mandatory scroll-smooth"
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
              id={`hero-proof-card-${index}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              role="tabpanel"
              aria-labelledby={`hero-proof-tab-${index}`}
              aria-hidden={!isDesktop && index !== activeIndex}
              variants={cardVariants}
              className="mobile-carousel-item proof-card snap-center"
              whileHover={reducedMotion ? undefined : hoverLift(-3)}
              aria-label={`${index + 1} of ${PROOF_COLUMNS.length}: ${col.label}`}
            >
              <p className="label-mono text-color-film-teal">{col.label}</p>
              <p className="mt-3 text-sm leading-7 text-[oklch(94%_0.007_80_/_0.62)]">{col.body}</p>
            </m.article>
          ))}
        </div>

        {/* Scroll fade affordance — mobile only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-[var(--color-bg)]/90 sm:hidden"
        />
      </div>

      {/* FIX 1 (v2026.3): className=`carousel-dot${active ? ' active' : ''}` — note the space.
          Previous version `carousel-dot${active ? 'active' : ''}` produced "carousel-dotactive"
          (single class), which never matched the compound selector `.carousel-dot.active`.
          The active pill indicator — expanding width + chapter-accent color — was silent. */}
      <div className="carousel-dots sm:hidden" role="tablist" aria-label="Proof pillar navigation">
        {PROOF_COLUMNS.map((col, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            id={`hero-proof-tab-${i}`}
            aria-selected={i === activeIndex}
            aria-controls={`hero-proof-card-${i}`}
            tabIndex={i === activeIndex ? 0 : -1}
            aria-label={`Go to ${col.label}`}
            onClick={() => scrollToIndex(i)}
            className={`carousel-dot${i === activeIndex ? ' active' : ''}`}
          />
        ))}
      </div>
    </>
  );
}

// V1.0 Change 7: Count-up animation for CONVICTION_STATS.
// Numeric values animate 0 → target over 600ms (easeOutQuart) on first viewport
// intersection. Non-numeric strings render immediately — intentional per spec.
// prefers-reduced-motion respected throughout.
function ConvictionStat({
  value,
  label,
  stat,
  source,
  detail,
  status,
  reducedMotion,
  shouldAnimate,
}: {
  value: string;
  label: string;
  stat: HeroMetricKey;
  source: string;
  detail: string;
  status: string;
  reducedMotion: boolean;
  shouldAnimate: boolean;
}) {
  const [displayed, setDisplayed] = useState(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (shouldAnimate || reducedMotion) {
      trackMetricView(`hero-${stat}`);
    }
  }, [reducedMotion, shouldAnimate, stat]);

  useEffect(() => {
    const numericMatch = value.match(/^(\d+(?:\.\d+)?)(.*)/);
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
  }, [value, shouldAnimate, reducedMotion]);

  return (
    <m.article
      className="conviction-stat hero-metric-card group"
      data-stat={stat}
      role="listitem"
      aria-label={`${value} ${label}. ${detail}`}
      whileHover={reducedMotion ? undefined : hoverLift(-4)}
    >
      <div className="hero-metric-head">
        <span className="hero-metric-source">{source}</span>
        <span className="hero-metric-status">{status}</span>
      </div>
      <span className="conviction-stat-value">{displayed}</span>
      <div className="hero-metric-copy">
        <span className="conviction-stat-label">{label}</span>
        <span className="hero-metric-detail">{detail}</span>
      </div>
    </m.article>
  );
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const { scrollToSection, setActiveChapter, scrollYRef } = useScrollCinema();
  const primaryMagnetic = useMagnetic<HTMLDivElement>({ strength: 0.2, radius: 144 });
  const secondaryMagnetic = useMagnetic<HTMLDivElement>({ strength: 0.18, radius: 120 });
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [showHeroVisual, setShowHeroVisual] = useState(false);

  const heroProgress = useMotionValue(0);

  const rightRailY = useSpring(useTransform(heroProgress, [0, 1], [0, -18]), {
    stiffness: 170,
    damping: 24,
    mass: 0.28,
  });
  const rightRailOpacity = useSpring(useTransform(heroProgress, [0, 1], [1, 0.94]), {
    stiffness: 160,
    damping: 26,
    mass: 0.32,
  });

  const previousHeroProgressRef = useRef(0);
  const heroScrollStartRef = useRef(0);
  const heroScrollRangeRef = useRef(1);

  // BUG FIX 3: heroRef + IntersectionObserver keeps the prologue chapter active whenever
  // the hero comes back into view. HeroSection is a bare <m.section> — not wrapped in
  // ChapterFrame — so useChapterTimeline is never called here. Without this,
  // activeChapter stays on the last chapter after scrolling down and the navbar dot /
  // brush field palette remain wrong on scroll-back.
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    setActiveChapter('prologue');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActiveChapter('prologue');
      },
      {
        threshold: 0.35,
        rootMargin: '-12% 0px -48% 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [setActiveChapter]);

  const syncHeroScrollRange = useCallback(() => {
    if (typeof window === 'undefined') return;
    const el = heroRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const start = rect.top + scrollYRef.current;
    const localRange = Math.max(el.offsetHeight * 0.82, window.innerHeight * 0.72, 1);

    heroScrollStartRef.current = start;
    heroScrollRangeRef.current = localRange;
  }, [scrollYRef]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = heroRef.current;
    if (!el) return;

    syncHeroScrollRange();

    const onViewportChange = () => {
      syncHeroScrollRange();
    };

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            syncHeroScrollRange();
          })
        : null;

    observer?.observe(el);
    window.addEventListener('resize', onViewportChange, { passive: true });
    window.addEventListener('orientationchange', onViewportChange, { passive: true });

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(() => {
        syncHeroScrollRange();
      });
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('orientationchange', onViewportChange);
    };
  }, [syncHeroScrollRange]);

  useEffect(() => {
    if (reducedMotion) {
      previousHeroProgressRef.current = 0;
      heroProgress.set(0);
    }
  }, [heroProgress, reducedMotion]);

  useAnimationFrame(() => {
    if (reducedMotion) return;
    const localScroll = Math.max(0, scrollYRef.current - heroScrollStartRef.current);
    const progress = Math.min(1, localScroll / heroScrollRangeRef.current);
    if (Math.abs(progress - previousHeroProgressRef.current) < 0.0015) return;
    previousHeroProgressRef.current = progress;
    heroProgress.set(progress);
  });

  // FIX 4 (v2026.4): proofContainer removed — was causing double-animation with heroContainer.
  // All carousel children now animate at their stagger position within heroContainer via `child`.
  const heroContainer = staggerContainer(0.055, 0.05);
  const child = reducedMotion ? noMotion : fadeRise;
  const wordContainer = reducedMotion ? noMotion : wordRevealContainer(0.055, 0.08);
  const heroRightRailStyle = reducedMotion
    ? undefined
    : { y: rightRailY, opacity: rightRailOpacity };

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktopViewport(mq.matches);

    sync();
    mq.addEventListener('change', sync);

    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isDesktopViewport) {
      setShowHeroVisual(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowHeroVisual(true);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [isDesktopViewport]);

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

  const handleAnchorJump = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, sectionId: string, ctaLabel: string) => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      event.preventDefault();
      trackEvent('Portfolio', 'HeroCtaClick', ctaLabel, undefined, {
        target_section: sectionId,
      });
      window.history.replaceState(null, '', anchorUrl(sectionId));
      scrollToSection(sectionId);
    },
    [scrollToSection]
  );

  return (
    <m.section
      ref={heroRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100dvh] min-h-[100svh] flex-col justify-start overflow-x-clip pt-[var(--hero-pad-top)] pb-[var(--hero-pad-bottom)] sm:justify-center lg:overflow-hidden"
    >
      <div className="work-surface-glow" aria-hidden="true" />

      <div className="relative z-10 container">
        <m.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="hero-shell flex flex-col gap-8 lg:gap-10"
        >
          <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(19rem,0.92fr)] lg:gap-14 xl:gap-16">
            {/* ── Left Column: Conviction Content ── */}
            <div className="flex min-w-0 flex-col items-start text-left">
              <m.div variants={child} data-cinematic="panel">
                <div
                  className="hero-availability-pill inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2"
                  aria-label="Currently available for Staff+ roles"
                >
                  <span className="dot-live" aria-hidden="true" />
                  <span className="hero-availability-label font-mono text-[11px] leading-tight tracking-widest text-white/70 uppercase">
                    {HERO.availability}
                    <span className="hero-availability-updated mt-1 block text-[9px] tracking-normal text-white/50 normal-case sm:mt-0 sm:ml-2 sm:inline">
                      · Updated {formatMonthYear(HERO.availabilityLastUpdated)}
                    </span>
                  </span>
                </div>
              </m.div>

              <m.p
                variants={child}
                data-cinematic="eyebrow"
                className="hero-kicker text-color-film-teal mt-4 max-w-[42ch] font-mono text-[11px] leading-relaxed tracking-[0.14em] uppercase"
              >
                {HERO.kicker}
              </m.p>

              <m.div
                variants={child}
                className="hero-heading-stack mt-4 flex w-full max-w-[var(--hero-body-max)] flex-col gap-4 sm:gap-5"
              >
                <h1
                  id="hero-heading"
                  data-cinematic="title"
                  className="w-full max-w-[var(--hero-headline-max)] text-balance"
                  aria-label={`${HERO.h1} ${HERO.subHeadline}`}
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
                          marginRight:
                            i < HEADLINE_WORDS.length - 1 ? 'var(--hero-word-gap,0.28em)' : '0',
                          lineHeight: 'var(--leading-tight)',
                          paddingBottom: 'var(--hero-word-pad-bottom, 0em)',
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

                <p className="text-didone-sub max-w-[30ch]" aria-hidden="true">
                  {HERO.subHeadline}
                </p>

                <p
                  data-cinematic="lede"
                  className="hero-body-text w-full max-w-[var(--hero-body-max)] text-base leading-[1.8] text-[oklch(94%_0.007_80_/_0.70)]"
                >
                  {HERO.body}
                </p>
              </m.div>

              <m.div
                variants={child}
                className="hero-mobile-portrait-wrap mt-2 flex w-full justify-center lg:hidden"
              >
                <div className="hero-mobile-portrait-shell">
                  <HeroPortrait
                    className="mx-auto"
                    priority={!isDesktopViewport}
                    reducedMotion={Boolean(reducedMotion)}
                    variant="mobile"
                  />
                </div>
              </m.div>

              <m.div variants={child} className="hero-trust-strip mt-4" aria-label="Trust signals">
                {TRUST_STRIP_ITEMS.map((item) => (
                  <span key={item} className="hero-trust-chip">
                    {item}
                  </span>
                ))}
              </m.div>

              <m.div
                variants={child}
                data-cinematic="proof"
                aria-label="Performance metrics"
                ref={statsRef}
                className="w-full"
              >
                <div className="conviction-stat-strip hero-metrics-grid" role="list">
                  {CONVICTION_STATS.map(({ value, label, stat }) => {
                    const detail = METRIC_DETAILS[stat];

                    return (
                      <ConvictionStat
                        key={label}
                        value={value}
                        label={label}
                        stat={stat}
                        source={detail.source}
                        detail={detail.detail}
                        status={detail.status}
                        reducedMotion={Boolean(reducedMotion)}
                        shouldAnimate={statsVisible}
                      />
                    );
                  })}
                </div>
              </m.div>

              <m.div variants={child} data-cinematic="cta" className="cta-hero-group mt-2">
                <m.div
                  ref={primaryMagnetic.ref}
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ x: primaryMagnetic.x, y: primaryMagnetic.y }}
                  variants={magneticButton}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href={HERO.cta.primary.href}
                    onClick={(event) => handleAnchorJump(event, 'section-contact', 'contact')}
                    className="cta-primary cta-primary--lg tactile-press"
                    aria-label="Tell me about your constraints"
                  >
                    <span
                      className="bg-color-success inline-block h-2 w-2 rounded-full"
                      aria-hidden="true"
                    />
                    {HERO.cta.primary.label}
                  </Link>
                </m.div>

                <m.div
                  ref={secondaryMagnetic.ref}
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ x: secondaryMagnetic.x, y: secondaryMagnetic.y }}
                  variants={magneticButton}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href={HERO.cta.secondary.href}
                    onClick={(event) => handleAnchorJump(event, 'section-projects', 'projects')}
                    className="cta-secondary tactile-press"
                    aria-label="See the work"
                  >
                    {HERO.cta.secondary.label} <span aria-hidden="true">↓</span>
                  </Link>
                </m.div>
              </m.div>

              <m.div
                variants={child}
                className="hero-support-links mt-4 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
              >
                <div className="response-reassurance">
                  <p className="text-color-text-secondary flex items-center gap-2 font-mono text-[10px] tracking-wider">
                    <span
                      className="bg-color-success inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    I respond within 24 hours — usually faster.
                  </p>
                </div>

                <div className="cv-ghost-wrapper">
                  <a
                    href={CV_ASSET_PATH}
                    download
                    className="cta-ghost tactile-press"
                    aria-label="Download Oscar's resume as PDF"
                  >
                    {HERO.cta.cv.label} <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </m.div>

              <m.div variants={child} className="mt-1 text-left">
                <Link
                  href={anchorUrl('section-writing')}
                  onClick={(event) => handleAnchorJump(event, 'section-writing', 'writing')}
                  className="group text-color-text-secondary hover:text-color-text-primary font-mono text-[12px] transition-colors"
                  aria-label="Read how the 2am constraint became the design system"
                >
                  Or read how the 2am constraint became the design system{' '}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </m.div>
            </div>

            {/* ── Right Column: Desktop Visuals ── */}
            <m.div
              variants={child}
              data-cinematic="media"
              className="hidden transform-gpu lg:flex lg:w-full lg:min-w-0 lg:flex-col lg:items-end lg:gap-5"
              // eslint-disable-next-line no-restricted-syntax
              style={heroRightRailStyle}
            >
              <div className="hero-portrait-dock flex w-full justify-center xl:justify-end">
                <HeroPortrait
                  className="mx-auto xl:mx-0"
                  priority={isDesktopViewport}
                  reducedMotion={Boolean(reducedMotion)}
                  variant="desktop"
                />
              </div>
              <div className="hero-visual-dock min-h-80 w-full max-w-[34rem]">
                {showHeroVisual ? (
                  <HeroVisual />
                ) : (
                  <div
                    className="glass-elevated min-h-80 w-full rounded-[var(--radius-xl)] opacity-30"
                    aria-hidden="true"
                  />
                )}
              </div>
            </m.div>
          </div>

          <div className="hero-support-grid grid gap-4 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:gap-6">
            <m.div variants={child} className="hero-support-cluster flex flex-col gap-4">
              <div className="hero-support-panel overflow-hidden">
                <LiveActivityBar />
              </div>

              <div className="hero-proof-callout hero-support-panel hidden overflow-hidden lg:block">
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
                  <span className="text-color-film-teal mt-1 block">{HERO.trustStrip}</span>
                </p>
              </div>
            </m.div>

            <m.div variants={child} className="hero-support-panel hero-carousel-shell p-4 sm:p-5">
              <ProofCarousel reducedMotion={Boolean(reducedMotion)} />
            </m.div>
          </div>

          <m.div variants={child} className="hidden justify-start sm:flex">
            <button
              type="button"
              onClick={() => globalThis.dispatchEvent(new Event('command-palette:open'))}
              className="border-color-border text-color-text-secondary hover:text-color-text-primary inline-flex cursor-pointer items-center gap-1.5 rounded border bg-white/[0.02] px-2.5 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors hover:border-white/20"
              aria-label="Open command palette (keyboard shortcut Cmd K)"
            >
              <kbd>⌘K</kbd>
              <span>Navigate</span>
            </button>
          </m.div>
        </m.div>
      </div>
    </m.section>
  );
}
