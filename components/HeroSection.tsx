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

const metrics: Array<{ label: string; body: string; breath?: boolean }> = [
  {
    label: 'LIVE IN PRODUCTION',
    body: 'Ensemble models + FastAPI inference serving live concurrent sessions via Redis and Postgres.',
  },
  {
    label: 'DECISIONS DOCUMENTED',
    body: 'Architecture tradeoffs between retrieval strategies visible in case studies — not just outcomes.',
  },
  {
    label: 'ZERO-DOWNTIME DESIGN',
    body: 'Graceful fallback, health checks, and environment-scoped boundaries built in from deployment one.',
  },
  {
    label: 'FULL OWNERSHIP',
    body: 'Feature engineering to production inference to the frontend. No handoffs.',
    breath: true,
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
      className="relative overflow-hidden pt-[calc(var(--nav-height)+var(--space-10))] pb-16 sm:pb-20 lg:min-h-[calc(100svh-var(--nav-height))] lg:pt-[calc(var(--nav-height)+var(--space-16))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(34,211,238,0.08) 0%, transparent 70%)',
        }}
      />
      <CursorGlow containerRef={heroRef} />
      <div className="relative z-10 container">
        <p role="status" className="pill pill-cyan inline-flex items-center gap-3">
          <span className="live-dot" aria-hidden="true" />
          Available — Staff+ · Co-founder · Consulting
        </p>

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
            <p className="mt-[var(--space-6)] mb-[var(--space-8)] max-w-[52ch] text-[length:var(--text-lg)] leading-[var(--leading-snug)] text-[color:var(--color-text-secondary)]">
              The engineer you bring in when AI behavior, platform reliability, and product clarity
              must hold simultaneously — and the system has to work at 2am during a live match.
            </p>

            <div className="mb-[var(--space-8)] flex flex-wrap gap-[var(--space-4)]">
              <Link
                href="#projects"
                className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                View Projects
              </Link>
              <Link
                href="#contact"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/85 transition hover:border-white/30 hover:text-white"
              >
                Get in Touch
              </Link>
              <Link
                href="/oscar-scardubu-resume.pdf"
                className="rounded-full px-5 py-3 text-sm font-medium text-white/65 transition hover:text-white"
              >
                Resume ↓
              </Link>
            </div>

            <Suspense fallback={<Skeleton width={280} height={16} />}>
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
              body={metric.body}
              breath={metric.breath}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
