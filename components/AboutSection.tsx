// CONVICTION ENGINE v16.0 — AboutSection
//
// v16 CHANGES vs v15:
//   IMPACT STAT STRIP: Added 3 scannable outcome numbers above the narrative —
//     "4h → 15min", "99.9%+ uptime", "3 production platforms" — instant
//     credibility for non-technical founders who don't read body copy.
//
//   UBEC CALLOUT: Reframed from qualifier ("Before that…") to proof-of-scale —
//     "Federal infrastructure. 36 states. Real money moving." — stronger signal.
//
//   NARRATIVE: Third paragraph tightened: names all three platforms with their
//     frontend layer explicitly. Removes hedging language ("some frontend").
//
//   SIDEBAR: Replaced generic "Trust signal" box with an availability chip
//     matching the hero pill — consistent visual language across the page.
//
//   QUICK-FACTS GRID (desktop): Added 3-col stat grid in sidebar below certs —
//     "4 cloud certs", "15+ OSS contributions", "4+ years production" —
//     scannable proof at a glance.
//
//   KEEP: All v15 stack strip, cert cards, grid layout, motion config.
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
  { name: 'AWS Certified Developer',                  date: 'Dec 2023', provider: 'AWS' },
  { name: 'GCP Associate Cloud Engineer',             date: 'Aug 2023', provider: 'GCP' },
  { name: 'OpenJS Node.js Services Developer (JSNSD)',date: 'May 2024', provider: 'JS'  },
  { name: 'PostgreSQL 14 Associate',                  date: 'Mar 2024', provider: 'PG'  },
] as const;

// v15: Full-stack range in one visual scan — mobile → web → API → data → ML
const STACK_STRIP = [
  { name: 'React Native',  cat: 'Mobile'   },
  { name: 'Next.js 15',    cat: 'Web'      },
  { name: 'React 19',      cat: 'UI'       },
  { name: 'TypeScript',    cat: 'Language' },
  { name: 'FastAPI',       cat: 'API'      },
  { name: 'PostgreSQL',    cat: 'Data'     },
  { name: 'Python 3.11+',  cat: 'ML'       },
  { name: 'Redis',         cat: 'Cache'    },
] as const;

// v16: Impact stats — outcome numbers for non-technical founders
const IMPACT_STATS = [
  { value: '4h → 15min', label: 'tax filing time',       color: 'var(--color-film-teal)' },
  { value: '99.9%+',     label: 'sustained uptime',      color: 'oklch(72% 0.17 160)'    },
  { value: '3',          label: 'production platforms',  color: 'oklch(75% 0.16 300)'    },
] as const;

// v16: Quick facts for the sidebar — scannable proof at a glance
const QUICK_FACTS = [
  { value: '4',   label: 'Cloud certs' },
  { value: '15+', label: 'OSS merged'  },
  { value: '4+',  label: 'Years prod.' },
] as const;

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
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
          {/* ── LEFT COLUMN — narrative ─────────────────────────────────── */}
          <div>
            <m.p variants={itemVariants} className="label-mono" style={{ color: 'var(--color-cyan)' }}>
              BACKGROUND
            </m.p>

            <m.h2
              variants={itemVariants}
              id="about-heading"
              className="mt-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              A decade of infrastructure. Four years of product.
            </m.h2>

            <m.p
              variants={itemVariants}
              className="mt-3 max-w-[42ch] text-xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Non-CS background. Federal-scale engineering. Production ML.
              Full-stack delivery.
            </m.p>

            {/* v16: Impact stat strip — outcome numbers before the narrative */}
            <m.div
              variants={itemVariants}
              className="mt-7 flex flex-wrap gap-x-6 gap-y-4 border-t border-b py-5"
              style={{ borderColor: 'var(--color-border-subtle)' }}
              aria-label="Impact stats"
            >
              {IMPACT_STATS.map(({ value, label, color }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span
                    className="font-mono text-base font-semibold tracking-tight"
                    style={{ color }}
                  >
                    {value}
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </m.div>

            {/* Narrative paragraphs */}
            <m.p
              variants={itemVariants}
              className="mt-7 max-w-[var(--max-width-prose)] text-base leading-8"
              style={{ color: 'var(--color-text-primary)', opacity: 0.82 }}
            >
              Fullstack engineer and platform architect with four years of
              independent product work. TaxBridge ships as a React Native mobile
              app backed by a Fastify 5 API and PostgreSQL 15 RLS. SabiScore
              serves ensemble ML inference behind a Next.js 15 dashboard.
              SwarmXQ orchestrates a self-improving AI agent fleet with a live
              ops dashboard in Next.js 15 and Tailwind v4.
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-5 max-w-[var(--max-width-prose)] text-base leading-8"
              style={{ color: 'var(--color-text-primary)', opacity: 0.72 }}
            >
              Non-CS academic background (B.Tech Environmental Technology, FUTO).
              Technical credibility built through a decade of production-grade
              engineering, four active cloud certifications, and 15+ merged
              upstream open-source contributions.
            </m.p>

            {/* Stack strip */}
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

            {/* v16: UBEC callout reframed as proof-of-scale */}
            <m.div
              variants={itemVariants}
              className="glass-surface mt-8 rounded-[var(--radius-lg)] border-l-2 p-5 sm:p-6"
              style={{ borderLeftColor: 'var(--color-cyan)' }}
            >
              <p
                className="mb-2 font-mono text-[10px] tracking-widest uppercase font-semibold"
                style={{ color: 'var(--color-film-teal)' }}
              >
                Federal infrastructure · UBEC
              </p>
              <p className="text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>
                Over a decade building the data systems that tracked school
                funding across all 36 Nigerian states — ETL pipelines,
                dashboards, and budget allocation infrastructure processing
                real allocations at federal scale, with reach into West Africa
                and Europe. Not an academic exercise.
              </p>
            </m.div>

            <m.p
              variants={itemVariants}
              className="mt-8 text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Lagos precision. Global scale.
            </m.p>
          </div>

          {/* ── RIGHT COLUMN — certifications + quick facts ─────────────── */}
          <aside aria-label="Professional certifications and facts">
            {/* Availability chip — v16: matches hero pill */}
            <m.div variants={itemVariants} className="mb-6">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2"
                aria-label="Availability status"
              >
                <span className="dot-live" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
                  Available · Staff+ Roles
                </span>
              </div>
            </m.div>

            <m.h3
              variants={itemVariants}
              className="font-body text-sm uppercase tracking-widest"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Certifications
            </m.h3>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
                    <p className="text-sm font-medium leading-snug" style={{ color: 'var(--color-text-primary)' }}>
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

            {/* v16: Quick facts grid */}
            <m.div
              variants={itemVariants}
              className="mt-6 grid grid-cols-3 gap-3"
              aria-label="Quick facts"
            >
              {QUICK_FACTS.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-md)] border p-3 text-center"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'oklch(100% 0 0 / 0.02)',
                  }}
                >
                  <p
                    className="font-mono text-base font-semibold"
                    style={{ color: 'var(--color-film-teal)' }}
                  >
                    {value}
                  </p>
                  <p
                    className="mt-0.5 font-mono text-[9px] tracking-wide uppercase"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </m.div>
          </aside>
        </m.div>
      </div>
    </section>
  );
}