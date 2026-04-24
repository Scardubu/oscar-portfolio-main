// CONVICTION ENGINE v8.0 — FULL REPLACEMENT
'use client';

import { m, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { LiveActivityBar } from '@/components/Liveactivitybar';

const PROOF_COLUMNS = [
  {
    label: 'LIVE IN PRODUCTION',
    body: 'SabiScore sustains 99.9%+ uptime on a 90-day Prometheus window — ensemble XGBoost, LightGBM, and CatBoost inference with 45% MTTD improvement.',
  },
  {
    label: 'DECISIONS DOCUMENTED',
    body: 'Every tradeoff — Chosen, Over, Because — is written out, not summarised. Architecture reasoning at every level, legible without clicking a link.',
  },
  {
    label: 'ZERO-DOWNTIME DESIGN',
    body: 'Health checks, idempotent job queues, circuit breakers, and environment-scoped rate limits — in the baseline, not added after an incident.',
  },
  {
    label: 'FULL STACK OWNERSHIP',
    body: 'Feature engineering through FastAPI inference to the Next.js frontend. One engineer, complete ownership — no handoff latency, no translation loss.',
  },
] as const;

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  const reveal = reducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col justify-center pt-28 pb-20 sm:pt-32 sm:pb-24"
    >
      <div className="relative z-10 container">
        <m.div initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }} animate={reveal}>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="font-mono text-[11px] tracking-widest text-white uppercase">
              AVAILABLE · STAFF+ / PRINCIPAL · BACKEND & INFRASTRUCTURE
            </span>
          </div>

          <p className="font-body mb-4 text-xs tracking-[0.12em] text-cyan-400 uppercase sm:text-sm">
            PRINCIPAL BACKEND ENGINEER · INFRASTRUCTURE & SRE ARCHITECT · AI SYSTEMS
          </p>

          <h1 id="hero-heading" className="max-w-[20ch] text-balance text-white">
            The system has to work at 2am.
          </h1>

          <p className="font-display mt-4 max-w-[30ch] text-2xl text-white/72 sm:text-3xl">
            {"That's not a slogan. It's a design constraint."}
          </p>

          <p className="mt-5 font-mono text-xs tracking-widest text-white/70 uppercase">
            Sub-150ms API · 99.9%+ uptime · 40% ops reduction · 95% test coverage
          </p>

          <p className="mt-6 max-w-(--max-width-hero) text-base leading-relaxed text-white/78 sm:text-lg">
            I build backend systems that keep fintech products alive, compliant, and fast — whether
            it&apos;s a quiet Tuesday or a FIRS audit season.
          </p>

          <p className="mt-4 max-w-(--max-width-hero) text-sm leading-relaxed text-white/65">
            Tax filing time: 4 hours → 15 minutes. Zero data-loss record across three production
            systems.
          </p>

          <div className="mt-8 mb-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="mailto:scardubu@gmail.com"
              className="inline-flex min-h-11 items-center rounded-(--radius-md) border border-white/20 bg-white/8 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
            >
              Book a Call
            </a>
            <Link
              href="#projects"
              className="inline-flex min-h-11 items-center rounded-(--radius-md) border border-white/20 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
            >
              View Projects →
            </Link>
          </div>

          <LiveActivityBar />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROOF_COLUMNS.map((column) => (
              <article key={column.label} className="glass-surface h-full rounded-(--radius-lg)">
                <p className="font-mono text-[11px] tracking-widest text-cyan-400 uppercase">
                  {column.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/72">{column.body}</p>
              </article>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
