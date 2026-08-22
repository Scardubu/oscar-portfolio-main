'use client';

import type { JSX } from 'react';
import { HERO } from '@/lib/portfolio-data';
import { formatMonthYear } from '@/lib/utils';
import { m, useReducedMotion } from 'framer-motion';
import { BrandWordmark } from './BrandWordmark';
import IdentityCard from './IdentityCard';
import { LiveActivityBar } from './Liveactivitybar';
import SquircleDefs from './SquircleDefs';

const HERO_ARIA_LABEL = `${HERO.h1} ${HERO.subHeadline}`;

export function HeroSection(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReducedMotion);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate min-h-screen overflow-hidden bg-[color:var(--brand-bg)] px-5 pt-24 pb-16 text-white sm:px-8 sm:py-24 lg:px-12"
    >
      <SquircleDefs />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_84%_20%,rgba(251,146,60,0.14),transparent_30%),linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,0.94))]"
      />

      <div className="hero-grid-shell mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl items-center gap-10 sm:gap-12 lg:min-h-[calc(100vh-12rem)] lg:grid-cols-[1.04fr_0.96fr]">
        <m.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.7 }}
          className="hero-grid-child max-w-3xl"
        >
          <m.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 sm:mb-8"
          >
            <BrandWordmark
              size="hero"
              className="[--wordmark-size:clamp(2rem,9.6vw,3.35rem)] sm:[--wordmark-size:clamp(2.35rem,8vw,7rem)]"
            />
            <p className="hero-kicker mt-4 font-mono text-[10px] leading-5 tracking-[0.2em] text-white/52 uppercase sm:text-[11px] sm:tracking-[0.24em]">
              {HERO.kicker}
            </p>
          </m.div>

          <a
            href={HERO.cta.primary.href}
            data-testid="hero-availability-pill"
            aria-label="Currently available — open to work. Contact Oscar."
            className="hero-availability-pill mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2 transition hover:border-white/20 focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none sm:mb-6"
          >
            <span className="dot-live" aria-hidden="true" />
            <span className="hero-availability-label font-mono text-[10px] leading-tight tracking-[0.16em] text-white/72 uppercase sm:text-[11px] sm:tracking-widest">
              {HERO.availability}
              <span className="hero-availability-updated ml-2 text-[9px] tracking-normal normal-case opacity-50">
                · Updated {formatMonthYear(HERO.availabilityLastUpdated)}
              </span>
            </span>
          </a>

          <h1
            id="hero-title"
            aria-label={HERO_ARIA_LABEL}
            className="text-[clamp(2.75rem,12.2vw,3.55rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-white sm:text-6xl lg:text-[4.5rem]"
          >
            {HERO.h1}
            <span className="mt-3 block text-xl leading-[1.12] font-medium tracking-[-0.02em] text-white/70 sm:text-3xl">
              {HERO.subHeadline}
            </span>
          </h1>

          <p className="hero-body-text mt-5 max-w-2xl text-base leading-7 text-pretty text-white/72 sm:mt-6 sm:text-lg sm:leading-8">
            {HERO.body}
          </p>

          <div className="cta-hero-group mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <a
              href={HERO.cta.primary.href}
              className="cta-primary inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_-22px_rgba(255,255,255,0.72)] transition duration-300 hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none active:scale-[0.985] motion-safe:hover:scale-[1.025]"
            >
              {HERO.cta.primary.label}
            </a>

            <a
              href={HERO.cta.secondary.href}
              className="cta-secondary inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-6 py-3 text-sm font-semibold text-white/86 transition duration-300 hover:border-white/20 hover:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none active:scale-[0.985] motion-safe:hover:scale-[1.025]"
            >
              {HERO.cta.secondary.label}
            </a>
          </div>

          <div className="live-bar-wrapper-hero max-w-full">
            <LiveActivityBar />
          </div>
        </m.div>

        <IdentityCard className="hero-grid-child" reducedMotion={shouldReduceMotion} />
      </div>
    </section>
  );
}

export default HeroSection;
