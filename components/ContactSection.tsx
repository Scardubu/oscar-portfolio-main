// CONVICTION ENGINE v8.0 — FULL REPLACEMENT
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useRef } from 'react';

import { CopyEmail } from '@/components/CopyEmail';
import { cardReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

const CONTACT_CARDS = [
  {
    title: 'STAFF+ / PRINCIPAL',
    headline: 'Product delivery · APIs · data infrastructure',
    body: 'Available for Staff+ and Principal Backend roles at fintech and AI-native product companies. Four years of independent platform work — user-facing product surfaces, multi-tenant PostgreSQL RLS, idempotent BullMQ queues, and zero-downtime deployments as a baseline constraint.',
    border: 'border-l-emerald-400',
  },
  {
    title: 'TECHNICAL CO-FOUNDER',
    headline: 'Pre-seed to Series A · Africa / emerging markets',
    body: 'Four years shipping production platforms from zero. Backend infrastructure, compliance architecture (NDPC, NRS/DigiTax), and observability through early funding rounds. The system should outlast the seed deck.',
    border: 'border-l-blue-500',
  },
  {
    title: 'INFRASTRUCTURE CONSULTING',
    headline: 'Production reliability · compliance systems · ML backends',
    body: 'Scoped engagements: production incident remediation, architecture review, Nigerian tax compliance integration (NTA 2025 / NRS 2026), and ML inference pipeline optimisation. Deliverable-led, not hourly.',
    border: 'border-l-violet-500',
  },
] as const;

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
    <section id="contact" ref={ref} className="border-t border-(--color-border) py-28 sm:py-32">
      <div className="container">
        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <m.div
            variants={child}
            className="pill pill-cyan inline-flex items-center gap-3"
            role="status"
          >
            <span className="dot-live" aria-hidden="true" />
            <span>Open — responding within 48hrs</span>
          </m.div>

          <div className="mt-8 max-w-3xl">
            <m.h2
              variants={child}
              id="section-contact"
              className="font-display text-4xl font-bold text-white sm:text-5xl"
            >
              Start a conversation.
            </m.h2>
            <m.p
              variants={child}
              className="mt-5 max-w-[62ch] text-base leading-8 text-white/72 sm:text-lg"
            >
              Available for both sides: technical co-founders and hiring managers.
            </m.p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {CONTACT_CARDS.map((mode) => (
              <m.article
                key={mode.title}
                variants={card}
                data-accent={mode.title.toLowerCase()}
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -3,
                        boxShadow: 'var(--glass-shadow-hover)',
                        transition: { type: 'spring', stiffness: 400, damping: 30 },
                      }
                }
                className={`glass-surface rounded-(--radius-lg) border border-l-2 border-(--glass-border) p-6 sm:p-8 ${mode.border}`}
              >
                <p className="font-mono text-[11px] tracking-widest text-white/65 uppercase">
                  {mode.title}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">{mode.headline}</h3>
                <p className="mt-4 text-sm leading-7 text-white/75">{mode.body}</p>
              </m.article>
            ))}
          </div>

          <m.div
            variants={child}
            className="mt-12 flex flex-wrap items-center gap-3 border-t border-(--color-border) pt-8 sm:gap-4"
          >
            <CopyEmail
              email="scardubu@gmail.com"
              className="min-h-11 rounded-(--radius-md) bg-(--color-accent) px-6 py-3.5 text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_var(--color-accent-glow)] hover:bg-(--color-accent-hover) hover:text-white"
            />

            <Link
              href="https://linkedin.com/in/oscar-ndugbu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Oscar Ndugbu on LinkedIn"
              data-cta="secondary"
              className="border-border text-text-secondary inline-flex min-h-11 items-center gap-2 rounded-(--radius-md) border px-5 py-3.5 font-mono text-xs font-medium uppercase transition"
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
              className="border-border text-text-secondary inline-flex min-h-11 items-center gap-2 rounded-(--radius-md) border px-5 py-3.5 font-mono text-xs font-medium uppercase transition"
            >
              <GitHubIcon />
              GitHub
            </Link>
            <a
              href="tel:+2348033885065"
              className="text-text-muted hover:text-text-primary font-body text-sm transition-colors sm:ml-1"
            >
              +234 803 388 5065
            </a>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
