import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { LiveActivityBar } from '@/app/components/LiveActivityBar';
import { CursorGlow } from '@/components/CursorGlow';
import { KineticName } from '@/components/KineticName';
import { MetricCard } from '@/components/MetricCard';

const metrics: Array<{ label: string; body: string; breath?: boolean }> = [
  {
    label: 'REAL-WORLD REACH',
    body: 'Production systems serving live concurrent sessions across high-traffic events',
  },
  {
    label: 'PRECISION AI',
    body: 'Embedding-based retrieval and ensemble meta-learning over rule-based heuristics',
  },
  {
    label: 'ALWAYS ON',
    body: 'Health checks, graceful fallback, environment-scoped boundaries — 24/7',
  },
  {
    label: 'END-TO-END',
    body: 'Full ownership from feature engineering to production inference',
    breath: true,
  },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:min-h-screen lg:pt-36"
    >
      {/* CSS-only mesh gradient background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 70%),' +
            'radial-gradient(ellipse 60% 80% at 80% 60%, rgba(34,211,238,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <CursorGlow />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <p
          role="status"
          className="glass-no-hover glass-light inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm text-white/80"
        >
          <span className="live-dot" aria-hidden="true" />
          Available — Staff+ · Co-founder · Consulting
        </p>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="label" style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
              Staff Full-Stack ML Engineer · AI/Fintech Systems
            </span>
            <KineticName
              id="hero-heading"
              name="Oscar Scardubu"
              className="mt-5 flex flex-wrap text-5xl text-white sm:text-6xl lg:text-7xl"
            />
            <p
              style={{
                marginTop: 'var(--space-6)',
                marginBottom: 'var(--space-8)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: '52ch',
                lineHeight: 'var(--leading-snug)',
              }}
            >
              The engineer you bring in when AI behavior, platform reliability, and product clarity
              must hold simultaneously — and the system has to work at 2am during a live match.
            </p>

            <div className="flex flex-wrap gap-3" style={{ marginBottom: 'var(--space-8)' }}>
              <Link
                href="#projects"
                className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
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

            <Suspense fallback={<div className="skeleton" style={{ height: 16, width: 280 }} />}>
              <LiveActivityBar />
            </Suspense>
          </div>

          <div className="relative mx-auto w-full max-w-[320px]">
            <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_68%)] blur-2xl" />
            <div className="glass-no-hover glass-full glass-chromatic relative overflow-hidden rounded-full p-4">
              <Image
                src="/headshot.webp"
                alt="Oscar Scardubu"
                width={320}
                height={320}
                priority
                className="h-auto w-full rounded-full object-cover"
              />
            </div>
          </div>
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
