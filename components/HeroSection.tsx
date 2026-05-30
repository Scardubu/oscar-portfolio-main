// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// SURGICAL PATCH v2026.13 — Mobile Viewport + Animation Threshold Fixes
//
// CHANGES IN THIS FILE (search "PATCH v2026.13" to locate every edit):
//
//   [1] ProofCarousel card whileInView viewport — line ~350
//       Was:  viewport={{ once: true, amount: 0.25, margin: '-20px 0px' }}
//       Now:  viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
//       Why:  Negative top margin ('-20px 0px' = shrinks the detection zone
//             from the top) combined with 0.25 threshold caused cards to
//             require deep scroll before triggering on iOS Safari — the
//             dynamic toolbar collapse changes visual viewport mid-scroll and
//             the negative-margin zone sometimes fell entirely outside the
//             initial visible rect. Removing the negative margin + lowering
//             threshold to 0.15 ensures cards reveal naturally at first swipe.
//             The '-40px' on the bottom means the trigger fires 40px before
//             the element reaches the bottom of the viewport (never fires late).
//
//   [2] ConvictionStat viewport — line ~471
//       Was:  viewport={{ once: true, amount: 0.3, margin: '-20px 0px' }}
//       Now:  viewport={{ once: true, amount: 0.2, margin: '0px 0px -30px 0px' }}
//       Why:  Same issue as [1]. The stats grid is above the fold on tablet
//             portrait — the negative margin was preventing the count-up
//             animation from firing on first load, leaving static "0" values
//             visible until a secondary scroll. The 0.2 threshold triggers
//             when 20% of the card is visible; '-30px 0px' bottom offset
//             ensures it fires before the card exits the bottom of screen.
//
//   [3] useInView for statsRef — line ~504
//       Was:  threshold: 0.3, rootMargin: '-20px 0px'
//       Now:  threshold: 0.15, rootMargin: '0px 0px -30px 0px'
//       Why:  This controls the shouldAnimate flag that triggers count-up.
//             On iOS with dynamic toolbar, the -20px rootMargin prevented
//             the observer from firing on devices where toolbar height == 20px.
//             Matching the threshold and margin to the whileInView values
//             above ensures the count-up and the animation trigger together.
//
// All other logic, structure, comments, and imports are IDENTICAL.
// ════════════════════════════════════════════════════════════════════════════

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

import { useInView } from '@/hooks/useInView';

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

// Per-stat visual accent — left border + subtle background tint.
// Mirrors the data-stat color tokens from globals.css so each card has
// a visually distinct identity beyond value colour alone.
const STAT_STYLES: Record<HeroMetricKey, { borderColor: string; background: string }> = {
  filing: {
    borderColor: 'var(--color-stat-filing)',
    background: 'linear-gradient(180deg, oklch(73% 0.17 65 / 0.055), oklch(73% 0.17 65 / 0.015))',
  },
  uptime: {
    borderColor: 'var(--color-stat-uptime)',
    background: 'linear-gradient(180deg, oklch(65% 0.18 155 / 0.055), oklch(65% 0.18 155 / 0.015))',
  },
  latency: {
    borderColor: 'var(--color-stat-latency)',
    background: 'linear-gradient(180deg, oklch(70% 0.21 188 / 0.055), oklch(70% 0.21 188 / 0.015))',
  },
  mttd: {
    borderColor: 'var(--color-stat-mttd)',
    background: 'linear-gradient(180deg, oklch(65% 0.23 290 / 0.055), oklch(65% 0.23 290 / 0.015))',
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
    // V1.2: Plain-English bridge added for non-technical readers.
    // 'Prometheus window' → 'production window' (Prometheus is a tool name, opaque to non-tech).
    // 'Ensemble XGBoost, LightGBM, and CatBoost inference delivered 45% MTTD improvement
    //  over reactive alerting baseline' → 'Three ML models working in ensemble catch system
    //  problems 45% faster than traditional alerting — before users notice anything is wrong'.
    // Technical detail preserved: three named models, 45%, ensemble, faster-than-baseline.
    // Non-technical consequence added: 'before users notice anything is wrong'.
    // 'Production reality, not staging theater.' kept — it's the strongest close on the page.
    body: 'SabiScore holds 99.9%+ uptime across a 90-day production window. Three ML models working in ensemble catch system problems 45% faster than traditional alerting — before users notice anything is wrong. Production reality, not staging theater.',
  },
  {
    // V1.2: Active voice. 'DECISIONS DOCUMENTED' implied archiving (passive).
    // 'EVERY DECISION WRITTEN' implies intentional authorship — mirrors
    // the 3-word telegraph style of ZERO-DOWNTIME DESIGN + FULL STACK OWNERSHIP.
    label: 'EVERY DECISION WRITTEN',
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
          className="mobile-carousel snap-x snap-proximity scroll-smooth"
          data-lenis-prevent
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
              className="mobile-carousel-item proof-card snap-start"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              // ── PATCH v2026.13 [1] ─────────────────────────────────────
              // Was: viewport={{ once: true, amount: 0.25, margin: '-20px 0px' }}
              // The negative top margin shrank the intersection root from the top,
              // preventing trigger on iOS Safari when the dynamic toolbar was
              // collapsing mid-scroll. amount reduced to 0.15 (trigger at 15%
              // visible) with a positive bottom offset so it fires slightly before
              // the card would otherwise be fully in view — never fires late.
              viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
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
  isDesktopViewport,
}: {
  value: string;
  label: string;
  stat: HeroMetricKey;
  source: string;
  detail: string;
  status: string;
  reducedMotion: boolean;
  shouldAnimate: boolean;
  isDesktopViewport: boolean;
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
      whileHover={reducedMotion || !isDesktopViewport ? undefined : hoverLift(-4)}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      // ── PATCH v2026.13 [2] ───────────────────────────────────────────────
      // Was: viewport={{ once: true, amount: 0.3, margin: '-20px 0px' }}
      // The 0.3 threshold + negative margin meant the stats grid sometimes
      // never triggered on short iOS screens (toolbar height == ~20px was
      // effectively cancelling the intersection). Reduced to 0.2 threshold
      // (trigger at 20% visible); positive bottom offset fires before the
      // card scrolls off the bottom of screen on compact devices.
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -30px 0px' }}
      // eslint-disable-next-line no-restricted-syntax
      style={{
        borderLeftColor: STAT_STYLES[stat].borderColor,
        borderLeftWidth: '2px',
        background: STAT_STYLES[stat].background,
      }}
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
  const primaryMagnetic = useMagnetic<HTMLDivElement>({ strength: 0.16, radius: 108 });
  const secondaryMagnetic = useMagnetic<HTMLDivElement>({ strength: 0.18, radius: 120 });
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [showHeroVisual, setShowHeroVisual] = useState(false);

  const heroProgress = useMotionValue(0);

  // ── PATCH v2026.13 [3] ──────────────────────────────────────────────────
  // Was: threshold: 0.3, rootMargin: '-20px 0px'
  // This useInView controls shouldAnimate (count-up trigger). On iOS Safari
  // with a 20px toolbar, '-20px 0px' rootMargin was effectively zeroing the
  // intersection zone, preventing the count-up from ever firing on initial
  // page load. Now matches the whileInView viewport params above (0.15/0.20
  // threshold, positive bottom offset) so animation and count-up trigger
  // at the same scroll position, in sync.
  const [statsRef, statsVisible] = useInView<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px',
    once: true,
  });

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
  const previousScrollYRef = useRef(0);
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
    const currentScrollY = scrollYRef.current;
    if (currentScrollY === previousScrollYRef.current) return;
    previousScrollYRef.current = currentScrollY;
    const localScroll = Math.max(0, currentScrollY - heroScrollStartRef.current);
    const progress = Math.min(1, localScroll / heroScrollRangeRef.current);
    if (Math.abs(progress - previousHeroProgressRef.current) < 0.0015) return;
    previousHeroProgressRef.current = progress;
    heroProgress.set(progress);
  });

  // FIX 4 (v2026.4): proofContainer removed — was causing double-animation with heroContainer.
  // All carousel children now animate at their stagger position within heroContainer via `child`.
  const heroContainer = staggerContainer(0.042, 0.04);
  const child = reducedMotion ? noMotion : fadeRise;
  const wordContainer = reducedMotion ? noMotion : wordRevealContainer(0.042, 0.08);
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

  // V1.0 Change 7: count-up now uses a shared in-view hook with a tighter
  // mobile-friendly threshold so metrics reveal naturally instead of waiting
  // for a deeper scroll position on iOS Safari.

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
      className="relative flex min-h-[100dvh] flex-col justify-start overflow-x-clip pt-[var(--hero-pad-top)] pb-[var(--hero-pad-bottom)] sm:justify-center lg:overflow-hidden"
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

                <p className="text-didone-sub max-w-[28ch]" aria-hidden="true">
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
                className="hero-mobile-portrait-wrap mt-2 flex w-full justify-center overflow-hidden lg:hidden"
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
                        isDesktopViewport={isDesktopViewport}
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
                  className="group text-color-text-secondary hover:text-color-text-primary font-mono text-[12px] transition-colors hover:underline hover:underline-offset-[3px]"
                  aria-label="Read how the 2am constraint became the design system"
                >
                  Or read how the 2am constraint became the design system{' '}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-1"
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