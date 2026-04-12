'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { LiveActivityBar } from '@/components/Liveactivitybar';
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
    body: 'Feature engineering through FastAPI inference to the Next.js frontend. One engineer, full stack — no handoff latency, no translation loss, no waiting.',
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
      <div className="relative z-10 container">
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

          <motion.p variants={label} className="label mb-6 origin-left">
            Staff Full-Stack ML Engineer · AI/Fintech Systems
          </motion.p>

          <div className="mb-4 overflow-hidden">
            <motion.h1
              variants={headline}
              id="hero-heading"
              className="text-gradient max-w-[16ch] text-balance"
            >
              <span className="block">When AI behavior, platform reliability,</span>
              <span className="block">and product clarity must hold simultaneously —</span>
              <span className="block">you need someone who has built all three.</span>
            </motion.h1>
          </div>

          <motion.p
            variants={child}
            className="mt-3 max-w-[48ch] text-[length:var(--text-xl)] leading-relaxed text-[color:var(--color-live)] italic"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The system has to work at 2am.
          </motion.p>

          <motion.div
            variants={child}
            className="mt-8 mb-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <motion.a
              href="#projects"
              data-cta="primary"
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: 1.02,
                      boxShadow: '0 0 0 3px var(--color-accent-glow)',
                      transition: { type: 'spring', stiffness: 400, damping: 30 },
                    }
              }
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-3.5 font-mono text-xs font-semibold tracking-wider text-white uppercase shadow-[0_0_20px_var(--color-accent-glow)] transition"
            >
              View Projects
            </motion.a>
            <Link
              href="#contact"
              data-cta="secondary"
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-5 py-3.5 font-mono text-xs font-medium text-[color:var(--color-text-secondary)] uppercase transition"
            >
              Get in Touch
            </Link>
            <Link
              href="/oscar-ndugbu-resume.pdf"
              download
              data-cta="ghost"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-4 py-3.5 font-mono text-xs font-medium text-[color:var(--color-text-muted)] uppercase transition"
            >
              Resume
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M5 1v8M1 6l4 3 4-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>

          <motion.div variants={child} className="mb-20">
            <LiveActivityBar />
          </motion.div>

          <motion.div variants={child} className="pillar-grid">
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
                  className="mb-3 text-base leading-snug font-semibold text-[color:var(--color-text-primary)] sm:text-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {pillar.headline}
                </p>
                <p
                  className="text-sm leading-7 text-[color:var(--color-text-secondary)] sm:text-[0.95rem]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {pillar.body}
                </p>
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
