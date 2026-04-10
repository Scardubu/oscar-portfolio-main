'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { LiveActivityBar } from '@/components/Liveactivitybar';
import { CV_ASSET_PATH } from '@/lib/config';
import {
  clipReveal,
  fadeRise,
  noMotion,
  pillarHover,
  scaleXReveal,
  scrollIndicatorBounce,
  staggerContainer,
} from '@/lib/motionVariants';

const PILLARS = [
  {
    label: 'LIVE IN PRODUCTION',
    headline: 'End-to-end ML systems',
    body: 'SabiScore sustains 99.9%+ uptime (Prometheus · 90-day window) — ensemble XGBoost, LightGBM, and CatBoost inference with 45% MTTD improvement over reactive alerting baseline.',
    accent: 'var(--color-live)',
    dataPillar: 'live',
  },
  {
    label: 'DECISIONS DOCUMENTED',
    headline: 'Architecture visible',
    body: 'Every tradeoff — Chosen, Over, Because — is in the case study. Not just outcomes. Reasoning at every level, legible without clicking.',
    accent: 'var(--color-accent)',
    dataPillar: 'decisions',
  },
  {
    label: 'ZERO-DOWNTIME DESIGN',
    headline: 'Graceful by default',
    body: 'Health checks, idempotent job queues, circuit breakers, and environment-scoped limits built in from deployment one — not bolted on after an incident.',
    accent: 'var(--color-wip)',
    dataPillar: 'downtime',
  },
  {
    label: 'FULL OWNERSHIP',
    headline: 'Feature to inference',
    body: 'Feature engineering through FastAPI inference to the Next.js frontend. One engineer. No handoffs. ~30% inference latency reduction via query optimisation and Redis caching.',
    accent: 'var(--color-accent)',
    dataPillar: 'ownership',
  },
] as const;

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const child = reducedMotion ? noMotion : fadeRise;
  const headline = reducedMotion ? noMotion : clipReveal;
  const label = reducedMotion ? noMotion : scaleXReveal;
  const container = useMemo(() => staggerContainer(0.055, 0.05), []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100dvh] flex-col justify-center pt-[calc(var(--nav-height)+3.5rem)] pb-20 sm:pb-24"
    >
      <div className="container relative z-10">
        <motion.div variants={container} initial="hidden" animate={mounted ? 'visible' : 'hidden'}>
          <motion.div variants={child} className="mb-10">
            <span
              role="status"
              aria-label="Available for Staff+ roles, co-founding, and ML consulting"
              className="badge-live inline-flex items-center gap-3 whitespace-nowrap"
            >
              <span className="dot-live" aria-hidden="true" />
              <span className="pill-full">Available · Staff+ · Co-founder · ML Consulting</span>
              <span className="pill-short" aria-hidden="true">
                Available · Staff+
              </span>
            </span>
          </motion.div>

          <motion.p variants={label} className="label mb-8 origin-left">
            Staff Full-Stack ML Engineer · AI/Fintech Systems
          </motion.p>

          <div className="mb-5 overflow-hidden">
            <motion.h1 variants={headline} id="hero-heading" className="text-gradient max-w-[13ch] text-balance">
              <span className="block">When AI behavior, platform reliability,</span>
              <span className="block">and product clarity must hold simultaneously —</span>
              <span className="block">you need someone who has built all three.</span>
            </motion.h1>
          </div>

          <div className="mb-10 overflow-hidden">
            <motion.p
              variants={child}
              className="text-[length:var(--text-xl)] italic leading-relaxed text-[color:var(--color-live)]"
              style={{ fontFamily: 'var(--font-display)' }}
              transition={reducedMotion ? undefined : { delay: 0.45 }}
            >
              The system has to work at 2am.
            </motion.p>
          </div>

          <motion.p
            variants={child}
            className="max-w-[64ch] text-[length:var(--text-xl)] leading-[1.8] text-[color:var(--color-text-secondary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Four years shipping production ML platforms, tax compliance infrastructure, and encrypted
            blockchain data systems. A decade building federal-scale data pipelines for Nigeria&apos;s
            36-state education system.
          </motion.p>

          <motion.div variants={child} className="mt-10 mb-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <motion.a
              href="#projects"
              data-cta="primary"
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: 1.02,
                      boxShadow: '0 0 0 3px var(--color-accent-glow)',
                      transition: { type: 'spring', stiffness: 400, damping: 25 },
                    }
              }
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3.5 font-mono text-xs font-medium uppercase text-white transition"
            >
              View Projects
            </motion.a>
            <Link
              href="#contact"
              data-cta="secondary"
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-5 py-3.5 font-mono text-xs font-medium uppercase text-[color:var(--color-text-secondary)] transition"
            >
              Get in Touch
            </Link>
            <Link
              href={CV_ASSET_PATH}
              download
              data-cta="ghost"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-4 py-3.5 font-mono text-xs font-medium uppercase text-[color:var(--color-text-muted)] transition"
            >
              Resume
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div variants={child} className="mb-20">
            <LiveActivityBar />
          </motion.div>

          <motion.div
            variants={child}
            className="pillar-grid"
          >
            {PILLARS.map((pillar) => (
              <motion.div
                key={pillar.label}
                data-pillar={pillar.dataPillar}
                whileHover={reducedMotion ? undefined : pillarHover}
                className="glass pillar-grid-item p-6 sm:p-7"
                style={{
                  borderTop: `2px solid ${pillar.accent}`,
                }}
              >
                <p className="label mb-2" style={{ color: pillar.accent }}>
                  {pillar.label}
                </p>
                <p
                  className="mb-3 text-base font-semibold leading-snug text-[color:var(--color-text-primary)] sm:text-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {pillar.headline}
                </p>
                <p className="text-sm leading-7 sm:text-[0.95rem]" style={{ fontFamily: 'var(--font-display)' }}>{pillar.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center sm:bottom-4"
          style={{ opacity: indicatorOpacity }}
          animate={reducedMotion ? undefined : scrollIndicatorBounce}
        >
          <div className="flex flex-col items-center gap-2 text-[color:var(--color-text-muted)]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
