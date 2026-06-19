'use client';

import type { JSX } from 'react';
// PATCH v2026.20 [LazyMotion]: `motion` → `m` to honour the LazyMotion strict
// boundary in MotionProvider. `motion.div` imports the full Framer Motion feature
// bundle (~30KB), bypassing the LazyMotion domAnimation code-split. `m.div` reads
// only the domAnimation subset that LazyMotion pre-loaded, keeping the hero paint
// at the intended bundle weight. With strict:true, using `motion.*` inside a
// LazyMotion boundary emits a console error in development.
import { m, useReducedMotion } from 'framer-motion';
import { BrandWordmark } from './BrandWordmark';
import IdentityCard from './IdentityCard';
import SquircleDefs from './SquircleDefs';
import { HERO } from '@/lib/portfolio-data';
import { formatMonthYear } from '@/lib/utils';

// PATCH v2026.22 [conviction re-sync]: HeroSection now consumes the canonical
// HERO mirror (lib/portfolio-data.ts) directly instead of hardcoding copy. The
// hero had drifted to a bespoke headline via out-of-band edits, which broke the
// conviction-ci.yml grep gate ("The system has to work at 2am"), the h1
// aria-label assertions in every smoke suite, and the availability-pill tests —
// all while the mirror that exists to prevent exactly this drift sat unused.
// Reading from HERO makes the component the mirror's only consumer, so copy can
// no longer diverge from the single source of truth.
const HERO_ARIA_LABEL = `${HERO.h1} ${HERO.subHeadline}`;

export function HeroSection(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReducedMotion);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate min-h-screen overflow-hidden bg-[color:var(--brand-bg)] px-5 py-24 text-white sm:px-8 lg:px-12"
    >
      <SquircleDefs />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_84%_20%,rgba(251,146,60,0.14),transparent_30%),linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,0.94))]"
      />

      <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
        <m.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.7 }}
          className="max-w-3xl"
        >
          <m.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <BrandWordmark size="hero" />
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-white/48">
              Principal Full-Stack Engineer
            </p>
          </m.div>

          {/* Availability pill — canonical conviction signal. data-testid +
              .hero-availability-pill class are contract surfaces consumed by the
              smoke suites and the chapter-accent border CSS in globals.css. */}
          <a
            href={HERO.cta.primary.href}
            data-testid="hero-availability-pill"
            aria-label="Currently available — open to work. Contact Oscar."
            className="hero-availability-pill mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2 transition hover:border-white/20 focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
          >
            <span className="dot-live" aria-hidden="true" />
            <span className="hero-availability-label font-mono text-[11px] leading-tight tracking-widest text-white/72 uppercase">
              {HERO.availability}
              <span className="hero-availability-updated ml-2 text-[9px] tracking-normal normal-case opacity-50">
                · Updated {formatMonthYear(HERO.availabilityLastUpdated)}
              </span>
            </span>
          </a>

          <h1
            id="hero-title"
            aria-label={HERO_ARIA_LABEL}
            className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.5rem]"
          >
            {HERO.h1}
            <span className="mt-3 block text-2xl font-medium leading-tight tracking-[-0.02em] text-white/55 sm:text-3xl">
              {HERO.subHeadline}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/62">
            {HERO.body}
          </p>

          <div className="cta-hero-group mt-8 flex flex-col gap-3 sm:flex-row">
            {/* PATCH v2026.21 [a11y + motion]: focus: -> focus-visible: (ring no longer
                fires on mouse click, only keyboard nav — matches every other interactive
                element in the codebase). hover:scale -> motion-safe:hover:scale so the
                lift is suppressed under prefers-reduced-motion (matches Footer pattern).
                Added active:scale for tactile press feedback on touch.
                PATCH v2026.22: labels/hrefs now sourced from HERO.cta — primary routes
                to the contact section (not a raw mailto) so the engagement menu can
                qualify the lead, matching the canonical conviction funnel. */}
            <a
              href={HERO.cta.primary.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none active:scale-[0.985] motion-safe:hover:scale-[1.025]"
            >
              {HERO.cta.primary.label}
            </a>

            <a
              href={HERO.cta.secondary.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-6 py-3 text-sm font-semibold text-white/86 transition duration-300 hover:border-white/20 hover:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none active:scale-[0.985] motion-safe:hover:scale-[1.025]"
            >
              {HERO.cta.secondary.label}
            </a>
          </div>
        </m.div>

        <IdentityCard reducedMotion={shouldReduceMotion} />
      </div>
    </section>
  );
}

export default HeroSection;