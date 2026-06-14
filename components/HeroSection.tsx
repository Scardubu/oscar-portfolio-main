'use client';

import type { JSX } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BrandWordmark } from './BrandWordmark';
import IdentityCard from './IdentityCard';
import SquircleDefs from './SquircleDefs';
import { anchorUrl, CONTACT_EMAIL } from '@/lib/config';

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
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.7 }}
          className="max-w-3xl"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <BrandWordmark size="hero" />
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-white/48">
              Principal Full-Stack Engineer
            </p>
          </motion.div>

          <p className="mb-5 font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--brand-accent)]/80">
            Staff+ • Next.js 15 · Node · Java · ML Infra • Lagos · UTC+1
          </p>

          <h1
            id="hero-title"
            className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
          >
            Production engineering with cinematic product conviction.
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/62">
            I help teams ship resilient web platforms, financial systems, and
            applied AI infrastructure with senior execution, measurable trust,
            and high-signal product polish.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Staff+ engineering conversation')}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.025] hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Start a Staff+ conversation
            </a>

            <a
              href={anchorUrl('section-projects')}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-6 py-3 text-sm font-semibold text-white/86 transition hover:scale-[1.025] hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Review proof of work
            </a>
          </div>
        </motion.div>

        <IdentityCard reducedMotion={shouldReduceMotion} />
      </div>
    </section>
  );
}

export default HeroSection;