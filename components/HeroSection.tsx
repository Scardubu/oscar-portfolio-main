// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// CHANGELOG v2026.4 (cumulative — all prior fixes included):
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

'use client';

import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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
import { CV_ASSET_PATH, anchorUrl } from '@/lib/config';
import {
  cardReveal,
  fadeRise,
  hoverLift,
  noMotion,
  staggerContainer,
  wordReveal,
  wordRevealContainer,
} from '@/lib/motionVariants';
import { HERO } from '@/lib/portfolio-data';
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

const HEADLINE_WORDS = ['The', 'system', 'has', 'to', 'work', 'at', '2am.'];

type HeroPortraitVariant = 'mobile' | 'desktop';

function HeroPortrait({
  reducedMotion,
  variant,
}: Readonly<{
  reducedMotion: boolean;
  variant: HeroPortraitVariant;
}>) {
  const isDesktop = variant === 'desktop';

  return (
    <m.div
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        isDesktop && !reducedMotion
          ? { scale: 1.02, transition: { type: 'spring', stiffness: 240, damping: 22 } }
          : undefined
      }
      className={[
        // FIX 2 (v2026.3): Ghost classes `hero-headshot-container` and `hero-headshot-rail`
        // removed — zero CSS rules, inert noise. Layout is fully governed by
        // `hero-headshot-frame` (desktop) and `mobile-headshot-wrap` (mobile).
        'relative isolate transform-gpu overflow-visible will-change-transform',
        isDesktop
          ? 'hero-headshot-frame self-center'
          : 'mobile-headshot-wrap flex w-full justify-center lg:hidden',
      ].join(' ')}
    >
      <div
        className={[
          'hero-headshot-ring hero-headshot-shell relative isolate overflow-hidden',
          isDesktop ? 'hero-headshot-shell--desktop' : 'hero-headshot-shell--mobile',
        ].join(' ')}
      >
        <div aria-hidden="true" className="hero-headshot-overlay absolute inset-0 z-0" />
        <Image
          src="/headshot.webp"
          alt="Oscar Ndugbu — Staff+ Full-Stack Engineer, Lagos"
          fill
          sizes={
            isDesktop
              ? '(min-width: 1536px) 260px, (min-width: 1280px) 228px, (min-width: 1024px) 200px, 188px'
              : '(max-width: 389px) 42vw, (max-width: 767px) 36vw, 190px'
          }
          quality={88}
          draggable={false}
          className={
            isDesktop
              ? 'hero-headshot-image--desktop object-cover'
              : 'hero-headshot-image--mobile object-cover'
          }
          priority
        />
        <span
          className={[
            'hero-headshot-badge absolute right-2 bottom-2 z-10 rounded-full border border-white/12 bg-black/50 px-2.5 py-1',
            'font-mono text-[9px] tracking-[0.18em] text-white/75 uppercase backdrop-blur-md',
          ].join(' ')}
        >
          {isDesktop ? 'Lagos · Staff+' : 'Staff+'}
        </span>
      </div>
    </m.div>
  );
}

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

      if (e.key === 'Home') { scrollToIndex(0); return; }
      if (e.key === 'End') { scrollToIndex(PROOF_COLUMNS.length - 1); return; }

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
        Production proof pillars. On mobile, swipe horizontally or use arrow keys, Home, and End.
        On larger screens, displayed as a two-column grid.
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
              ref={(node) => { cardRefs.current[index] = node; }}
              role="tabpanel"
              aria-labelledby={`hero-proof-tab-${index}`}
              aria-hidden={!isDesktop && index !== activeIndex}
              variants={cardVariants}
              className="mobile-carousel-item proof-card snap-center"
              whileHover={reducedMotion ? undefined : hoverLift(-3)}
              aria-label={`${index + 1} of ${PROOF_COLUMNS.length}: ${col.label}`}
            >
              <p className="label-mono text-color-film-teal">{col.label}</p>
              <p className="mt-3 text-sm leading-7 text-[oklch(94%_0.007_80_/_0.62)]">
                {col.body}
              </p>
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
    <div className="conviction-stat" data-stat={stat} role="listitem">
      <span className="conviction-stat-value">{displayed}</span>
      <span className="conviction-stat-label">{label}</span>
    </div>
  );
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const { scrollToSection, setActiveChapter, scrollProgressRef } = useScrollCinema();

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

  useEffect(() => {
    if (reducedMotion) {
      previousHeroProgressRef.current = 0;
      heroProgress.set(0);
    }
  }, [heroProgress, reducedMotion]);

  useAnimationFrame(() => {
    if (reducedMotion) return;
    // Emphasize first-fold progress while keeping motion subtle and stable.
    const progress = Math.min(1, Math.max(0, scrollProgressRef.current * 8));
    if (Math.abs(progress - previousHeroProgressRef.current) < 0.0015) return;
    previousHeroProgressRef.current = progress;
    heroProgress.set(progress);
  });

  // FIX 4 (v2026.4): proofContainer removed — was causing double-animation with heroContainer.
  // All carousel children now animate at their stagger position within heroContainer via `child`.
  const heroContainer = staggerContainer(0.055, 0.05);
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
      className="relative flex min-h-[100dvh] min-h-[100svh] flex-col justify-start overflow-hidden pt-[var(--hero-pad-top)] pb-[var(--hero-pad-bottom)] sm:justify-center"
    >
      <div className="work-surface-glow" aria-hidden="true" />

      <div className="relative z-10 container">
        <div className="hero-grid-shell grid items-center gap-[var(--hero-col-gap)] lg:grid-cols-[minmax(0,var(--hero-left-width))_minmax(0,var(--hero-right-width))]">

          {/* ── Left Column: Conviction Content ── */}
          <m.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="hero-grid-child flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Availability Pill
                Dark-pattern ban: no fake slot counts or artificial deadlines.
                Border color tracks --chapter-accent via CSS (v2026.4 enhancement). */}
            <m.div variants={child} data-cinematic="panel">
              <div
                className="hero-availability-pill inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2"
                aria-label="Currently available for Staff+ roles"
              >
                <span className="dot-live" aria-hidden="true" />
                <span className="hero-availability-label font-mono text-[11px] leading-tight tracking-widest text-white/70 uppercase">
                  AVAILABLE · STAFF+ ROLES
                  <span className="hero-availability-updated mt-1 block text-center text-[9px] tracking-normal text-white/50 normal-case sm:mt-0 sm:ml-2 sm:inline sm:text-left">
                    · Updated {formatMonthYear(HERO.availabilityLastUpdated)}
                  </span>
                </span>
              </div>
            </m.div>

            {/* Mobile Headshot
                Static on mobile so the first fold stays centered and the portrait
                does not drift against the text stack while the desktop rail keeps
                the subtle scroll parallax. Padding is managed entirely by CSS. */}
            <m.div variants={child} className="mobile-headshot-stage">
              <HeroPortrait reducedMotion={Boolean(reducedMotion)} variant="mobile" />
            </m.div>

            {/* Kicker */}
            <m.p
              variants={child}
              data-cinematic="eyebrow"
              className="hero-kicker text-color-film-teal mx-auto max-w-[36ch] font-mono text-[11px] leading-relaxed tracking-[0.12em] uppercase lg:mx-0"
            >
              <span className="inline sm:hidden">
                <span className="whitespace-nowrap">Full-Stack</span>
                {' · '}
                <span className="whitespace-nowrap">Java</span>
                {' · '}
                <span className="whitespace-nowrap">Next.js 15</span>
                <br />
                <span className="whitespace-nowrap">React Native</span>
                {' · '}
                <span className="whitespace-nowrap">AI Systems · Fintech</span>
              </span>
              <span className="hidden sm:inline">
                Full-Stack · Java · React Native · Next.js 15 · AI Systems · Fintech
              </span>
            </m.p>

            {/* Headline */}
            <h1
              id="hero-heading"
              data-cinematic="title"
              className="w-full max-w-[var(--hero-headline-max)] text-balance lg:mx-0"
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
                      marginRight:
                        i < HEADLINE_WORDS.length - 1 ? 'var(--hero-word-gap,0.28em)' : '0',
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
              data-cinematic="lede"
              className="hero-body-text mx-auto w-full max-w-[var(--hero-body-max)] text-base leading-[1.8] text-[oklch(94%_0.007_80_/_0.70)] lg:mx-0"
            >
              Production systems that stay alive when it matters most — compliant, fast, and
              relentlessly reliable. Built under Lagos constraints. Deployed to global standards.
            </m.p>

            {/* Stats Strip — count-up on viewport intersection */}
            <m.div
              variants={child}
              data-cinematic="proof"
              aria-label="Performance metrics"
              ref={statsRef}
            >
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

            {/* Proof Callout — each system on its own line for sm+ readability */}
            <m.div
              variants={child}
              data-cinematic="panel"
              className="hero-proof-callout hidden overflow-hidden sm:block"
            >
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

            <m.div variants={child} data-cinematic="panel" className="live-bar-wrapper-hero">
              <LiveActivityBar />
            </m.div>

            {/* CTAs */}
            <m.div variants={child} data-cinematic="cta" className="cta-hero-group mx-auto lg:mx-0">
              <Link
                href={anchorUrl('section-contact')}
                onClick={(event) => handleAnchorJump(event, 'section-contact', 'contact')}
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
                onClick={(event) => handleAnchorJump(event, 'section-projects', 'projects')}
                className="cta-secondary tactile-press"
                aria-label="See the work"
              >
                See the work <span aria-hidden="true">↓</span>
              </Link>
            </m.div>

            <m.div variants={child} className="response-reassurance mx-auto lg:mx-0">
              {/* flex + items-center: reliable iOS Safari alignment (inline-block + align-middle
                  collapses the gap at 10px mono on retina, merging dot into capital "I"). */}
              <p className="text-color-text-secondary flex items-center gap-2 font-mono text-[10px] tracking-wider">
                <span
                  className="bg-color-success inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  aria-hidden="true"
                />
                I respond within 24 hours — usually faster.
              </p>
            </m.div>

            <m.div variants={child} className="cv-ghost-wrapper mx-auto lg:mx-0">
              <a
                href={CV_ASSET_PATH}
                download
                className="cta-ghost tactile-press"
                aria-label="Download Oscar's resume as PDF"
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>
            </m.div>

            {/* Warmup micro-CTA — for the evaluating visitor who reads before committing.
                mono 12px, secondary color, not a button. */}
            <m.div variants={child} className="mt-2 text-center lg:text-left">
              <Link
                href={anchorUrl('section-writing')}
                onClick={(event) => handleAnchorJump(event, 'section-writing', 'writing')}
                className="text-color-text-secondary hover:text-color-text-primary font-mono text-[12px] transition-colors"
                aria-label="Read how the 2am constraint became the design system"
              >
                Or read how the 2am constraint became the design system →
              </Link>
            </m.div>

            {/* Proof Carousel
                FIX 3 (v2026.4): Replaced `m.div variants={proofContainer} initial="hidden"
                animate="visible"` (double-animation driver) with `variants={child}` — inherits
                heroContainer orchestration, animates at correct stagger position, no drift. */}
            <m.div variants={child}>
              <ProofCarousel reducedMotion={Boolean(reducedMotion)} />
            </m.div>

            {/* ⌘K hint — surfaces the command palette for power users */}
            <m.div
              variants={child}
              className="mt-4 flex transform-gpu justify-center lg:justify-end"
            >
              <button
                type="button"
                onClick={() => globalThis.dispatchEvent(new Event('command-palette:open'))}
                className="border-color-border text-color-text-secondary hover:text-color-text-primary inline-flex cursor-pointer items-center gap-1.5 rounded border bg-white/[0.02] px-2.5 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors hover:border-white/20"
                aria-label="Open command palette"
              >
                <kbd>⌘K</kbd>
                <span>Navigate</span>
              </button>
            </m.div>
          </m.div>

          {/* ── Right Column: Desktop Visuals ── */}
          <m.div
            data-cinematic="media"
            className="hero-visual-rail hidden transform-gpu lg:flex lg:min-w-0 lg:flex-col lg:items-end lg:gap-5"
            // eslint-disable-next-line no-restricted-syntax
            style={reducedMotion ? undefined : { y: rightRailY, opacity: rightRailOpacity }}
          >
            <HeroPortrait reducedMotion={Boolean(reducedMotion)} variant="desktop" />
            <HeroVisual />
          </m.div>

        </div>
      </div>
    </m.section>
  );
}