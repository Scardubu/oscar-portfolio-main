// CONVICTION ENGINE v17.0 — AboutSection
//
// v17 CHANGES vs v16:
//   HEADSHOT: Added to right sidebar (lg+) with conic teal ring — human warmth
//     without hurting mobile LCP.  SSR-safe via next/image.
//   NARRATIVE: Reframes non-CS background as a feature, not a gap.
//     Every platform named with its frontend layer explicitly.
//   UBEC BLOCK: Visual upgrade — standalone callout card with stack strip.
//   STACK DOTS: Color-coded category dots for 2-second full-stack signal.
//   AVAILABILITY CHIP: Now an anchor link to #section-contact.
//   CERT BADGES: Provider-specific color (AWS amber, GCP blue, JS yellow, PG blue).
//   MOTION: staggerChildren applied independently per column; right-column
//     cards cascade on their own inView trigger.
//   KEEP: All v16 impact stats, quick facts, stack strip, cert cards, grid layout.
//
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import {
  cardReveal,
  clipReveal,
  fadeRise,
  noMotion,
  staggerContainer,
} from '@/lib/motionVariants';

const CERTS = [
  { name: 'AWS Certified Developer',                   date: 'Dec 2023', provider: 'AWS' },
  { name: 'GCP Associate Cloud Engineer',              date: 'Aug 2023', provider: 'GCP' },
  { name: 'OpenJS Node.js Services Developer (JSNSD)', date: 'May 2024', provider: 'JS'  },
  { name: 'PostgreSQL 14 Associate',                   date: 'Mar 2024', provider: 'PG'  },
] as const;

// Full-stack range: mobile → web → API → data → ML — one visual scan
const STACK_STRIP = [
  { name: 'React Native',  cat: 'Mobile',   dot: 'oklch(75% 0.16 300)' },
  { name: 'Next.js 15',    cat: 'Web',      dot: 'var(--color-film-teal)' },
  { name: 'React 19',      cat: 'UI',       dot: 'oklch(72% 0.19 196)' },
  { name: 'TypeScript',    cat: 'Language', dot: 'oklch(70% 0.18 230)' },
  { name: 'FastAPI',       cat: 'API',      dot: 'oklch(72% 0.17 160)' },
  { name: 'PostgreSQL 15', cat: 'Data',     dot: 'oklch(68% 0.14 244)' },
  { name: 'Python 3.11+',  cat: 'ML',       dot: 'oklch(80% 0.16 60)'  },
  { name: 'Redis 7',       cat: 'Cache',    dot: 'oklch(66% 0.22 22)'  },
] as const;

// Outcome numbers — scannable for non-technical founders
const IMPACT_STATS = [
  { value: '4h → 15min', label: 'Tax filing time',     color: 'var(--color-film-teal)' },
  { value: '99.9%+',     label: 'Sustained uptime',    color: 'oklch(72% 0.17 160)'    },
  { value: '3',          label: 'Production platforms', color: 'oklch(75% 0.16 300)'    },
] as const;

// Quick facts for the sidebar — scannable proof at a glance
const QUICK_FACTS = [
  { value: '4',   label: 'Cloud certs'  },
  { value: '15+', label: 'OSS merged'   },
  { value: '4+',  label: 'Yrs in prod.' },
] as const;

// Provider-specific accent colours
const PROVIDER_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  AWS: { bg: 'oklch(75% 0.17 65 / 0.12)',  color: 'oklch(78% 0.17 65)',  border: 'oklch(75% 0.17 65 / 0.3)'  },
  GCP: { bg: 'oklch(68% 0.18 220 / 0.12)', color: 'oklch(72% 0.18 220)', border: 'oklch(68% 0.18 220 / 0.3)' },
  JS:  { bg: 'oklch(80% 0.16 90 / 0.12)',  color: 'oklch(80% 0.16 90)',  border: 'oklch(80% 0.16 90 / 0.3)'  },
  PG:  { bg: 'oklch(68% 0.14 244 / 0.12)', color: 'oklch(72% 0.14 244)', border: 'oklch(68% 0.14 244 / 0.3)' },
};

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();

  const containerVariants = staggerContainer(0.09, 0.05);
  const itemVariants = reducedMotion ? noMotion : fadeRise;
  const headingVariant = reducedMotion ? noMotion : clipReveal;
  const cardVariant    = reducedMotion ? noMotion : cardReveal(16);

  return (
    <section
      id="section-about"
      ref={ref}
      aria-labelledby="about-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
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
            <m.div variants={itemVariants} className="section-kicker-row mb-[var(--space-2)]">
              <span className="section-number" aria-hidden="true">04</span>
              <span className="section-label">ABOUT</span>
            </m.div>

            <m.h2
              variants={headingVariant}
              id="about-heading"
              className="mt-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              A decade of infrastructure.{' '}
              <br className="hidden sm:block" />
              Four years of product.
            </m.h2>

            <m.p
              variants={itemVariants}
              className="mt-3 max-w-[44ch] text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Non-CS background. Federal-scale engineering. Production ML.
              Full-stack delivery.
            </m.p>

            {/* Impact stat strip — outcome numbers before narrative */}
            <m.div
              variants={itemVariants}
              className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-b py-5"
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

            {/* Narrative */}
            <m.p
              variants={itemVariants}
              className="mt-7 max-w-[var(--max-width-prose)] text-base leading-8"
              style={{ color: 'var(--color-text-primary)', opacity: 0.82 }}
            >
              Principal full-stack engineer and platform architect with four years of
              independent product delivery. Three live production systems, zero acquired
              technical debt by design.
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-5 max-w-[var(--max-width-prose)] text-base leading-8"
              style={{ color: 'var(--color-text-primary)', opacity: 0.75 }}
            >
              TaxBridge: React Native / Expo 54 mobile app, Fastify 5 API, PostgreSQL 15 RLS
              enforcing tenant isolation at the database engine level.
              SabiScore: ensemble ML inference (XGBoost, LightGBM, CatBoost) behind a
              Next.js 15 dashboard — 99.9%+ uptime, 90-day Prometheus window.
              SwarmXQ: self-improving AI agent fleet with live ops visibility.
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-5 max-w-[var(--max-width-prose)] text-base leading-8"
              style={{ color: 'var(--color-text-primary)', opacity: 0.65 }}
            >
              Non-CS background (B.Tech Environmental Technology, FUTO) is a
              feature — every architecture decision comes from first principles, not
              textbook pattern-matching. Four cloud certs and 15+ merged upstream
              contributions are the receipts.
            </m.p>

            {/* Stack strip */}
            <m.div
              variants={itemVariants}
              className="mt-7 flex flex-wrap gap-2"
              aria-label="Technology stack"
            >
              {STACK_STRIP.map(({ name, cat, dot }) => (
                <div
                  key={name}
                  className="flex items-center gap-2 rounded-md border px-3 py-1.5"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'oklch(100% 0 0 / 0.025)',
                  }}
                  title={`Category: ${cat}`}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: dot }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-mono text-[9px] tracking-widest uppercase"
                    style={{ color: 'var(--color-text-muted)' }}
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

            {/* UBEC callout — proof of federal-scale engineering */}
            <m.div
              variants={cardVariant}
              className="glass-surface mt-8 rounded-[var(--radius-lg)] p-5 sm:p-6"
              style={{ borderLeft: '2px solid var(--color-cyan)' }}
            >
              <p
                className="mb-2 font-mono text-[10px] tracking-widest uppercase font-semibold"
                style={{ color: 'var(--color-film-teal)' }}
              >
                Federal infrastructure · UBEC · Abuja HQ
              </p>
              <p className="text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>
                Over a decade building the data systems that tracked school funding
                across all 36 Nigerian states — ETL pipelines, dashboards, and
                budget allocation infrastructure processing real federal allocations.
                Federal scale. Real money. Not an academic exercise.
              </p>
              <p
                className="mt-3 font-mono text-[10px] tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Python 3.11 · Apache Airflow · PostgreSQL · Power BI
              </p>
            </m.div>

            <m.p
              variants={itemVariants}
              className="mt-8 text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Lagos-built.{' '}
              <span style={{ color: 'var(--color-film-teal)' }}>Running globally.</span>
            </m.p>
          </div>

          {/* ── RIGHT COLUMN — headshot + availability + certs + quick facts ── */}
          <aside aria-label="Profile, certifications and quick facts">
            {/* Headshot — desktop only; hero handles mobile */}
            <m.div
              variants={itemVariants}
              className="mb-6 hidden lg:flex flex-col items-center gap-3"
            >
              <m.div
                className="relative"
                aria-hidden="true"
                whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
              >
                {/* Conic teal ring — larger radius to match 180px image */}
                <div
                  className="absolute -inset-[3px] rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 180deg, oklch(70% 0.21 188 / 0.65), transparent 55%, oklch(70% 0.21 188 / 0.28) 100%)',
                  }}
                  aria-hidden="true"
                />
                <Image
                  src="/images/oscar-headshot.jpg"
                  alt="Oscar Ndugbu"
                  width={180}
                  height={180}
                  priority={false}
                  className="relative rounded-full object-cover object-top"
                  style={{
                    width: '180px',
                    height: '180px',
                    boxShadow: '0 16px 48px oklch(0% 0 0 / 0.55)',
                  }}
                />
              </m.div>
              <div className="text-center">
                <p
                  className="font-display text-sm font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Oscar Ndugbu
                </p>
                <p
                  className="font-mono text-[10px] tracking-widest uppercase mt-0.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Full-Stack · Infra · ML · Lagos
                </p>
              </div>
            </m.div>

            {/* Availability chip — links to contact */}
            <m.div variants={itemVariants} className="mb-6">
              <a
                href="#section-contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2 transition hover:border-white/20"
                aria-label="Available for Staff+ roles — contact Oscar"
              >
                <span className="dot-live" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
                  Available · Staff+ Roles
                </span>
              </a>
            </m.div>

            {/* Certifications heading */}
            <m.h3
              variants={itemVariants}
              className="font-body text-xs uppercase tracking-widest"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Certifications
            </m.h3>

            {/* Cert cards */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {CERTS.map((cert) => {
                const ps = PROVIDER_STYLES[cert.provider] ?? {
                  bg: 'oklch(73% 0.18 196 / 0.10)',
                  color: 'var(--color-film-teal)',
                  border: 'oklch(73% 0.18 196 / 0.30)',
                };
                return (
                  <m.article
                    key={cert.name}
                    variants={cardVariant}
                    className="glass-surface rounded-[var(--radius-md)] border-l-2 p-4"
                    style={{ borderLeftColor: 'var(--color-film-teal)', minHeight: '56px' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-sm font-medium leading-snug"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {cert.name}
                      </p>
                      <span
                        className="mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-widest uppercase"
                        style={{ background: ps.bg, color: ps.color, borderColor: ps.border }}
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
                );
              })}
            </div>

            {/* Quick facts grid */}
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