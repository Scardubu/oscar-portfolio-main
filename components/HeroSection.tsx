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
    headline: '99.9%+ uptime, monitored',
    body: 'TaxBridge and SabiScore run on Prometheus alerting with a 45% improvement in MTTD over reactive baselines. Health checks, graceful shutdowns, and environment-scoped limits are built in from day one — not bolted on after an incident.',
    accent: 'var(--color-live)',
    dataPillar: 'live',
  },
  {
    label: 'DECISIONS DOCUMENTED',
    headline: 'Architecture visible',
    body: 'Every tradeoff — Chosen, Over, Because — lives in the case study alongside the outcome. Not just what shipped, but why it was built that way. Reasoning at every level, legible without a call.',
    accent: 'var(--color-accent)',
    dataPillar: 'decisions',
  },
  {
    label: 'MULTI-TENANT BY DEFAULT',
    headline: 'PostgreSQL RLS as a baseline',
    body: 'TaxBridge enforces tenant isolation at the database engine — not the application layer. Row-Level Security means a bug in business logic cannot expose another tenant\'s data. NRS audit-ready from day one.',
    accent: 'var(--color-wip)',
    dataPillar: 'multitenant',
  },
  {
    label: 'FULL OWNERSHIP',
    headline: 'Infrastructure to user interface',
    body: 'From BullMQ idempotent queues and PostgreSQL migrations to the Next.js frontend. One engineer, complete stack — no translation loss, no handoff latency, no gap between intent and deployment.',
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
      className="relative flex min-h-dvh flex-col justify-center pt-[calc(var(--nav-height)+3.5rem)] pb-20 sm:pb-24"
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
            Principal Backend Engineer · Infrastructure & SRE Architect · AI Systems
          </motion.p>

          <div className="mb-4 overflow-hidden">
            <motion.h1
              variants={headline}
              id="hero-heading"
              className="text-gradient max-w-[var(--max-width-hero)] text-balance"
            >
              The system has to work at 2am.
            </motion.h1>
          </div>

          <motion.p
            variants={child}
            className="mt-4 max-w-[60ch] text-base leading-relaxed text-(--color-text-secondary)"
          >
            I build the backend systems that keep fintech products alive, compliant, and fast —
            idempotent job queues, PostgreSQL RLS multi-tenancy, real-time inference pipelines, and
            SRE tooling that prevents incidents before they happen.
          </motion.p>

          <motion.div
            variants={child}
            className="mt-5 flex flex-wrap items-center gap-2"
            aria-label="Key engineering metrics"
          >
            {(
              ['sub-150ms API', '99.9%+ uptime', '40% ops reduction', '95% test coverage'] as const
            ).map((metric) => (
              <span
                key={metric}
                className="pill-cyan font-mono text-[11px] tracking-widest uppercase"
              >
                {metric}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={child}
            className="mt-8 mb-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <motion.a
              href="mailto:oscar@scardubu.dev"
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
              className="inline-flex min-h-11 items-center rounded-(--radius-md) border border-(--color-accent) bg-(--color-accent) px-6 py-3.5 font-mono text-xs font-semibold tracking-wider text-white uppercase shadow-[0_0_20px_var(--color-accent-glow)] transition"
            >
              Book a Call
            </motion.a>
            <Link
              href="#projects"
              data-cta="secondary"
              className="inline-flex min-h-11 items-center rounded-(--radius-md) border border-(--color-border) px-5 py-3.5 font-mono text-xs font-medium text-(--color-text-secondary) uppercase transition"
            >
              View Projects
            </Link>
            <Link
              href="/cv/oscar-ndugbu-resume.pdf"
              download
              data-cta="ghost"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-md) border border-(--color-border) px-4 py-3.5 font-mono text-xs font-medium text-(--color-text-muted) uppercase transition"
            >
              Resume
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
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
              >
                <p className="label mb-2">{pillar.label}</p>
                <p className="font-display mb-3 text-base leading-snug font-semibold text-(--color-text-primary) sm:text-lg">
                  {pillar.headline}
                </p>
                <p className="font-display text-sm leading-7 text-(--color-text-secondary) sm:text-[0.95rem]">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center sm:bottom-4"
          // eslint-disable-next-line no-restricted-syntax
          style={{ opacity: indicatorOpacity }}
          animate={reducedMotion ? undefined : scrollIndicatorBounce}
        >
          <div className="flex flex-col items-center gap-2 text-(--color-text-muted)">
            <ChevronDown className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
