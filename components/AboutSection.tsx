// CONVICTION ENGINE v15.0 — AboutSection
//
// v15 CHANGES vs v14.1:
//
//   FULL-STACK SIGNAL UPGRADE:
//     - Headline body copy now explicitly names React Native, Next.js 15,
//       and Tailwind v4 alongside FastAPI and PostgreSQL.
//       Objection defanged: "Is he really full-stack or just backend + some React?"
//       Answer: React Native (TaxBridge), Next.js 15 dashboards (SabiScore, SwarmXQ,
//       portfolio), Framer Motion, Tailwind v4 — all production, all public.
//
//   STACK STRIP: Added horizontal icon strip showing the full-stack range —
//     React · Next.js · React Native · FastAPI · Python · PostgreSQL · Redis.
//     Renders at the bottom of the narrative column, above the UBEC callout.
//     Quick scan without requiring reading.
//
//   NARRATIVE: Third paragraph updated to name "React Native mobile app"
//     and "Next.js 15 dashboard" explicitly for TaxBridge and SwarmXQ.
//
//   KEEP: All v14.1 cert cards, UBEC callout, grid layout, motion config.
//
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import {
  fadeRise,
  noMotion,
  staggerContainer,
} from '@/lib/motionVariants';

const CERTS = [
  {
    name: 'AWS Certified Developer',
    date: 'Dec 2023',
    provider: 'AWS',
  },
  {
    name: 'GCP Associate Cloud Engineer',
    date: 'Aug 2023',
    provider: 'GCP',
  },
  {
    name: 'OpenJS Node.js Services Developer (JSNSD)',
    date: 'May 2024',
    provider: 'JS',
  },
  {
    name: 'PostgreSQL 14 Associate',
    date: 'Mar 2024',
    provider: 'PG',
  },
] as const;

// Stack strip — full-stack range in one visual scan
const STACK_STRIP = [
  { name: 'React Native',   cat: 'Mobile' },
  { name: 'Next.js 15',     cat: 'Web' },
  { name: 'React 19',       cat: 'UI' },
  { name: 'TypeScript',     cat: 'Language' },
  { name: 'FastAPI',        cat: 'API' },
  { name: 'PostgreSQL',     cat: 'Data' },
  { name: 'Python 3.11+',   cat: 'ML' },
  { name: 'Redis',          cat: 'Cache' },
] as const;

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);

  const inView = useInView(ref, {
    once: true,
    margin: '-80px',
  });

  const reducedMotion = useReducedMotion();

  const containerVariants = staggerContainer(0.09, 0.05);
  const itemVariants = reducedMotion ? noMotion : fadeRise;

  return (
    <section
      id="section-about"
      ref={ref}
      aria-labelledby="about-heading"
      className="border-t border-[var(--color-border)] py-[var(--section-py)]"
    >
      <div className="container">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-start"
        >
          {/* LEFT COLUMN — narrative */}
          <div>
            <m.p
              variants={itemVariants}
              className="label-mono text-[var(--color-cyan)]"
            >
              BACKGROUND
            </m.p>

            <m.h2
              variants={itemVariants}
              id="about-heading"
              className="mt-4 text-white"
            >
              A decade of infrastructure. Four years of product.
            </m.h2>

            <m.p
              variants={itemVariants}
              className="mt-3 max-w-[42ch] text-xl text-[var(--color-text-secondary)]"
            >
              Non-CS background. Federal-scale engineering. Production ML.
              Full-stack delivery.
            </m.p>

            {/* v15: Explicitly full-stack — not "some frontend, mostly backend" */}
            <m.p
              variants={itemVariants}
              className="mt-6 max-w-[var(--max-width-prose)] text-base leading-8 text-white/80"
            >
              Fullstack engineer and platform architect with four years of
              independent product and consulting work. TaxBridge ships as a
              React Native mobile app backed by a Fastify API and PostgreSQL
              RLS. SabiScore serves ensemble ML inference behind a Next.js 15
              dashboard. SwarmXQ orchestrates self-improving AI agents with a
              live ops dashboard in Next.js 15 and Tailwind v4.
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-5 max-w-[var(--max-width-prose)] text-base leading-8 text-white/72"
            >
              Before that, over a decade building and maintaining critical data
              infrastructure within Nigeria&apos;s federal public sector —
              UBEC — managing ETL pipelines, dashboards, and state-level federal
              budget allocation systems across every state and local government
              area in the country, with reach extending into West Africa and Europe.
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-5 max-w-[var(--max-width-prose)] text-base leading-8 text-white/72"
            >
              Non-CS academic background (B.Tech Environmental Technology,
              FUTO, 2006–2011). Technical credibility built through a decade of
              production-grade engineering, four active cloud certifications,
              and 15+ merged upstream contributions.
            </m.p>

            {/*
              v15: STACK STRIP — full-stack range in 8 chips.
              Appears before the UBEC callout to establish full-stack breadth
              before the "federal scale" depth signal.
            */}
            <m.div
              variants={itemVariants}
              className="mt-7 flex flex-wrap gap-2"
              aria-label="Technology stack"
            >
              {STACK_STRIP.map(({ name, cat }) => (
                <div
                  key={name}
                  className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'oklch(100% 0 0 / 0.03)',
                  }}
                  title={cat}
                >
                  <span
                    className="font-mono text-[9px] tracking-widest uppercase"
                    style={{ color: 'var(--color-film-teal)', opacity: 0.7 }}
                  >
                    {cat}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </m.div>

            {/* UBEC callout: strongest objection defang */}
            <m.div
              variants={itemVariants}
              className="glass-surface mt-8 rounded-[var(--radius-lg)] border-l-2 p-4 sm:p-6"
              style={{
                borderLeftColor: 'var(--color-cyan)',
              }}
            >
              <p className="text-sm leading-7 text-white/78">
                At Nigeria&apos;s Universal Basic Education Commission, I built
                the data systems that tracked school funding across every Nigerian
                state and territory — federal-scale infrastructure processing
                real allocations, not academic exercises.
              </p>
            </m.div>

            <m.p
              variants={itemVariants}
              className="mt-8 text-lg text-white/80"
            >
              Lagos precision. Global scale.
            </m.p>
          </div>

          {/* RIGHT COLUMN — certifications */}
          <aside aria-label="Professional certifications">
            <m.h3
              variants={itemVariants}
              className="font-body text-sm uppercase tracking-widest text-white/80"
            >
              Certifications
            </m.h3>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {CERTS.map((cert) => (
                <m.article
                  key={cert.name}
                  variants={itemVariants}
                  className="glass-surface rounded-[var(--radius-md)] border-l-2 p-4"
                  style={{
                    borderLeftColor: 'var(--color-film-teal)',
                    minHeight: '56px',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white leading-snug">
                      {cert.name}
                    </p>
                    <span
                      className="mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-widest uppercase"
                      style={{
                        borderColor: 'var(--color-film-teal-glow)',
                        color: 'var(--color-film-teal)',
                        background: 'var(--color-film-teal-surface)',
                      }}
                      aria-label={`Provider: ${cert.provider}`}
                    >
                      {cert.provider}
                    </span>
                  </div>

                  <p
                    className="mt-1.5 font-mono text-[11px]"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {cert.date}
                  </p>
                </m.article>
              ))}
            </div>

            {/* Shipped in Lagos trust signal */}
            <m.div
              variants={itemVariants}
              className="mt-8 rounded-[var(--radius-md)] border p-4"
              style={{
                borderColor: 'var(--color-border)',
                background: 'oklch(100% 0 0 / 0.02)',
              }}
            >
              <p
                className="font-mono text-[10px] tracking-widest uppercase mb-2"
                style={{ color: 'var(--color-film-teal)' }}
              >
                Trust signal
              </p>
              <p className="text-xs leading-6 text-white/60">
                Shipped in Lagos · Running globally · Battle-tested in audit season
              </p>
            </m.div>
          </aside>
        </m.div>
      </div>
    </section>
  );
}
