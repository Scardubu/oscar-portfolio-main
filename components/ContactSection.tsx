'use client';

import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { cardReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';
import { CopyEmail } from '@/components/CopyEmail';

interface EngagementMode {
  type: string;
  headline: string;
  detail: string;
  accent: 'live' | 'accent' | 'wip';
}

const engagementModes: EngagementMode[] = [
  {
    type: 'Staff+ / Principal',
    headline: 'Product delivery · APIs · data infrastructure',
    detail:
      'Available for Staff+ principal backend engineering roles at fintech and product companies. Four years of independent platform work — multi-tenant PostgreSQL RLS, idempotent BullMQ queues, and zero-downtime deployments as a baseline constraint.',
    accent: 'live',
  },
  {
    type: 'Technical Co-Founder',
    headline: 'Pre-seed to Series A · Africa / emerging markets',
    detail:
      'Four years shipping production platforms from zero. Backend infrastructure, compliance architecture (NDPC, NRS/DigiTax), and observability through early funding rounds. The system should outlast the seed deck.',
    accent: 'accent',
  },
  {
    type: 'Infrastructure Consulting',
    headline: 'SRE · Reliability · Performance engineering',
    detail:
      'Incident reduction, Prometheus/Grafana observability stacks, and latency optimisation. SabiScore achieved 45% MTTD improvement and 30% inference latency reduction. Engagements scoped to specific reliability problems with measurable outcomes.',
    accent: 'wip',
  },
];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.77.6-3.35-1.18-3.35-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.93.84.09-.65.35-1.1.63-1.36-2.21-.25-4.54-1.1-4.54-4.92 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.69 1.03 1.58 1.03 2.67 0 3.83-2.33 4.66-4.56 4.91.36.31.67.92.67 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M4.98 3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM3.5 8.75h2.96V20.5H3.5V8.75Zm7.17 0h2.84v1.6h.04c.39-.75 1.37-1.85 2.82-1.85 3.02 0 3.58 1.98 3.58 4.56v7.44H17V14c0-1.5-.03-3.42-2.08-3.42-2.08 0-2.4 1.63-2.4 3.31v6.61h-2.85V8.75Z" />
    </svg>
  );
}

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();
  const container = useMemo(() => staggerContainer(0.1, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;
  const card = useMemo(() => (reducedMotion ? noMotion : cardReveal(24)), [reducedMotion]);

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="border-t border-(--color-border) py-28 sm:py-32"
    >
      <div className="container">
        <motion.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={child} className="mb-2 flex items-center gap-3">
            <span className="label">
              <span
                className="mr-3 font-mono text-[10px] tracking-widest text-(--color-text-muted) select-none"
                aria-hidden="true"
              >
                05 —
              </span>
              Contact
            </span>
          </motion.div>
          <motion.div
            variants={child}
            className="pill pill-cyan inline-flex items-center gap-3"
            role="status"
          >
            <span className="dot-live" aria-hidden="true" />
            Open — responding within 48hrs
          </motion.div>

          <div className="mt-8 max-w-3xl">
            <motion.h2
              variants={child}
              id="contact-heading"
              className="gradient-text text-4xl sm:text-5xl"
            >
              Start a conversation
            </motion.h2>
            <motion.p
              variants={child}
              className="font-display mt-5 max-w-[62ch] text-(length:--text-xl) leading-[1.8] text-white/70"
            >
              Available for Staff+ roles, technical co-founding, and scoped ML consulting where
              reliability is a requirement rather than a nice-to-have.
            </motion.p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {engagementModes.map((mode) => (
              <motion.div
                key={mode.type}
                variants={card}
                data-accent={mode.accent}
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -3,
                        boxShadow: 'var(--glass-shadow-hover)',
                        transition: { type: 'spring', stiffness: 400, damping: 30 },
                      }
                }
                className="glass glass-medium cursor-default rounded-(--radius-lg) border border-(--glass-border) p-6 sm:p-7"
              >
                <p className="label">{mode.type}</p>
                <h3 className="font-display mt-5 font-semibold text-white">{mode.headline}</h3>
                <p className="font-display mt-4 text-base leading-8 text-white/75">{mode.detail}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={child}
            className="mt-12 flex flex-wrap items-center gap-3 border-t border-(--color-border) pt-8 sm:gap-4"
          >
            <CopyEmail
              email="scardubu@gmail.com"
              className="min-h-11 rounded-(--radius-md) bg-(--color-accent) px-6 py-3.5 text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_var(--color-accent-glow)] hover:bg-(--color-accent-hover) hover:text-white"
            />

            <Link
              href="https://linkedin.com/in/oscardubu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Oscar Ndugbu on LinkedIn"
              data-cta="secondary"
              className="inline-flex min-h-11 items-center gap-2 rounded-(--radius-md) border border-(--color-border) px-5 py-3.5 font-mono text-xs font-medium text-(--color-text-secondary) uppercase transition"
            >
              <LinkedInIcon />
              LinkedIn
            </Link>
            <Link
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Oscar Ndugbu on GitHub"
              data-cta="secondary"
              className="inline-flex min-h-11 items-center gap-2 rounded-(--radius-md) border border-(--color-border) px-5 py-3.5 font-mono text-xs font-medium text-(--color-text-secondary) uppercase transition"
            >
              <GitHubIcon />
              GitHub
            </Link>
            <a
              href="tel:+2348033885065"
              className="font-mono text-xs tracking-(--tracking-wide) text-(--color-text-muted) transition-colors hover:text-(--color-text-primary) sm:ml-1"
            >
              +234 803 388 5065
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
