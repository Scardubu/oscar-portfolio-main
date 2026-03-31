'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useRef } from 'react';
import { m } from 'framer-motion';

import { LiveActivityBar } from '@/components/Liveactivitybar';
import { CursorGlow } from '@/components/CursorGlow';
import { KineticName } from '@/components/KineticName';
import { MetricCard } from '@/components/MetricCard';
import { Skeleton } from '@/components/Skeleton';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scaleIn } from '@/lib/motion';

const metrics: Array<{
  label: string;
  headline: string;
  body: string;
  breath?: boolean;
  accent?: 'live' | 'accent' | 'wip';
}> = [
  {
    label: 'LIVE IN PRODUCTION',
    headline: 'End-to-end ML systems',
    body: 'Ensemble models + FastAPI inference serving live concurrent sessions via Redis and Postgres.',
    accent: 'live',
  },
  {
    label: 'DECISIONS DOCUMENTED',
    headline: 'Architecture visible',
    body: 'Every tradeoff is rendered as chosen, over, and because in the case study surface.',
    accent: 'accent',
  },
  {
    label: 'ZERO-DOWNTIME DESIGN',
    headline: 'Graceful by default',
    body: 'Health checks, fallback states, and environment-scoped limits are built in from deployment one.',
    accent: 'wip',
  },
  {
    label: 'FULL OWNERSHIP',
    headline: 'No handoffs',
    body: 'Feature engineering to production inference to the frontend. No handoffs.',
    breath: true,
    accent: 'accent',
  },
];

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-[calc(var(--nav-height)+var(--space-10))] pb-16 sm:pb-20 lg:min-h-[calc(92svh-var(--nav-height))] lg:pt-[calc(var(--nav-height)+var(--space-14))]"
    >
      <CursorGlow containerRef={heroRef} />
      <div className="relative z-10 container">
        <div aria-label="Availability status" className="badge-live inline-flex items-center gap-3">
          <span className="dot-live" aria-hidden="true" />
          Available — Staff+ · Co-founder · Consulting
        </div>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:gap-14">
          <div>
            <span className="label mb-[var(--space-4)] block">
              Staff Full-Stack ML Engineer · AI/Fintech Systems
            </span>
            <KineticName
              id="hero-heading"
              name="Oscar Scardubu"
              className="block max-w-full text-[clamp(2.15rem,10vw,5.8rem)] leading-[0.92] whitespace-nowrap text-white"
            />
            <p className="mt-[var(--space-6)] mb-[var(--space-8)] max-w-[60ch] text-[length:var(--text-lg)] leading-[var(--leading-snug)] text-[color:var(--color-text-secondary)]">
              The engineer you bring in when AI behavior, platform reliability, and product clarity
              must hold simultaneously — and the system has to work at 2am during a live match.
            </p>

            <div className="mb-[var(--space-8)] flex flex-wrap items-center gap-[var(--space-3)]">
              <Link
                href="#projects"
                data-cta="primary"
                className="rounded-[var(--radius-sm)] border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 font-mono text-xs font-medium tracking-[0.16em] text-white uppercase transition"
              >
                View Projects
              </Link>
              <Link
                href="#contact"
                data-cta="secondary"
                className="rounded-[var(--radius-sm)] border border-[color:var(--color-border)] px-5 py-3 font-mono text-xs font-medium tracking-[0.16em] text-[color:var(--color-text-secondary)] uppercase transition"
              >
                Get in Touch
              </Link>
              <Link
                href="/oscar-scardubu-resume.pdf"
                download
                className="border-b border-[color:var(--color-border)] px-2 py-3 font-mono text-xs font-medium tracking-[0.16em] text-[color:var(--color-text-muted)] uppercase transition hover:text-[color:var(--color-text-primary)]"
              >
                Resume ↓
              </Link>
            </div>

            <Suspense fallback={<Skeleton width={320} height={16} />}>
              <LiveActivityBar />
            </Suspense>
          </div>

          <m.div
            className="relative mx-auto hidden w-full max-w-[320px] lg:sticky lg:top-[calc(var(--nav-height)+var(--space-12))] lg:block"
            initial={reducedMotion ? false : 'hidden'}
            animate={reducedMotion ? undefined : 'visible'}
            variants={scaleIn}
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_68%)] blur-2xl" />
            <div className="glass glass-full glass-chromatic relative overflow-hidden rounded-full p-4">
              <Image
                src="/headshot.webp"
                alt="Oscar Scardubu"
                width={320}
                height={320}
                priority
                className="h-auto w-full rounded-full object-cover"
              />
            </div>
          </m.div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              headline={metric.headline}
              body={metric.body}
              breath={metric.breath}
              accent={metric.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
