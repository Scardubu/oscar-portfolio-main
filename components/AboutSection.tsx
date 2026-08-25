// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
'use client';

import { m, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { ChapterFrame } from '@/components/cinematic/ChapterFrame';
import { LiveBuildFeed } from '@/components/LiveBuildFeed';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { getChapterBySectionId } from '@/lib/cinematic/chapters';
import { anchorUrl } from '@/lib/config';
import { cardReveal, clipReveal, fadeRise, noMotion } from '@/lib/motionVariants';

const CERTS = [
  { name: 'AWS Certified Developer', date: 'Dec 2023', provider: 'AWS' },
  { name: 'GCP Associate Cloud Engineer', date: 'Aug 2023', provider: 'GCP' },
  { name: 'OpenJS Node.js Services Developer (JSNSD)', date: 'May 2024', provider: 'JS' },
  { name: 'PostgreSQL 14 Associate', date: 'Mar 2024', provider: 'PG' },
] as const;

// Full-stack range: mobile → web → API → data → ML — one visual scan
const STACK_STRIP = [
  { name: 'React Native', cat: 'Mobile', dot: 'oklch(75% 0.16 300)' },
  { name: 'Next.js 15', cat: 'Web', dot: 'var(--color-film-teal)' },
  { name: 'React 19', cat: 'UI', dot: 'oklch(72% 0.19 196)' },
  { name: 'TypeScript', cat: 'Language', dot: 'oklch(70% 0.18 230)' },
  { name: 'FastAPI', cat: 'API', dot: 'oklch(72% 0.17 160)' },
  { name: 'PostgreSQL 15', cat: 'Data', dot: 'oklch(68% 0.14 244)' },
  { name: 'Python 3.11+', cat: 'ML', dot: 'oklch(80% 0.16 60)' },
  { name: 'Redis 7', cat: 'Cache', dot: 'oklch(66% 0.22 22)' },
] as const;

// Quick facts for the sidebar — scannable proof at a glance
const QUICK_FACTS = [
  { value: 'Resume', label: 'Listed certs' },
  { value: 'Public', label: 'GitHub record' },
  { value: '10+ yrs', label: 'Federal data' },
] as const;

// Provider-specific accent colours
const PROVIDER_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  AWS: {
    bg: 'oklch(75% 0.17 65 / 0.12)',
    color: 'oklch(78% 0.17 65)',
    border: 'oklch(75% 0.17 65 / 0.3)',
  },
  GCP: {
    bg: 'oklch(68% 0.18 220 / 0.12)',
    color: 'oklch(72% 0.18 220)',
    border: 'oklch(68% 0.18 220 / 0.3)',
  },
  JS: {
    bg: 'oklch(80% 0.16 90 / 0.12)',
    color: 'oklch(80% 0.16 90)',
    border: 'oklch(80% 0.16 90 / 0.3)',
  },
  PG: {
    bg: 'oklch(68% 0.14 244 / 0.12)',
    color: 'oklch(72% 0.14 244)',
    border: 'oklch(68% 0.14 244 / 0.3)',
  },
};

export function AboutSection() {
  const reducedMotion = useReducedMotion();
  const chapter = getChapterBySectionId('section-about');

  const itemVariants = reducedMotion ? noMotion : fadeRise;
  const headingVariant = reducedMotion ? noMotion : clipReveal;
  const cardVariant = reducedMotion ? noMotion : cardReveal(16);

  return (
    <ChapterFrame chapter={chapter} ariaLabelledBy="about-heading" className="border-color-border">
      <div>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-start">
          {/* ── LEFT COLUMN — narrative ─────────────────────────────────── */}
          <div>
            <m.div variants={itemVariants} className="mb-0">
              <SectionIntro
                eyebrowNumber="04"
                eyebrowLabel="About"
                headingId="about-heading"
                title={
                  <>
                    Long-horizon systems. <br className="hidden sm:block" />
                    Explicit decisions.
                  </>
                }
                description={
                  'More than a decade in federal data systems, including reporting pipelines across 36 state sources, followed by backend, platform, and AI infrastructure work built around failure-aware delivery.'
                }
                eyebrowVariant={itemVariants}
                titleVariant={headingVariant}
                descriptionVariant={itemVariants}
                titleClassName="text-color-text-primary mt-4"
                descriptionClassName="text-color-text-secondary mt-3 max-w-[44ch] text-lg leading-relaxed"
              />
            </m.div>

            {/* Narrative — about-narrative-block activates mobile paragraph spacing (globals.css v21);
                about-narrative-p activates tighter font-size/line-height on ≤640px (globals.css v20.1) */}
            <div className="about-narrative-block">
              <m.p
                variants={itemVariants}
                className="about-narrative-p text-color-text-primary mt-7 max-w-[var(--max-width-prose)] text-base leading-8 opacity-[0.82]"
              >
                The UBEC work centered on heterogeneous submissions, partial state data, and
                reporting that could not silently accept bad inputs. That operating context carried
                into every system after it: explicit failure modes and architecture decisions written
                so the next engineer can understand the reasoning long after deploy.
              </m.p>

              <m.p
                variants={itemVariants}
                className="about-narrative-p text-color-text-primary mt-5 max-w-[var(--max-width-prose)] text-base leading-8 opacity-75"
              >
                TaxBridge: React Native / Expo 54 mobile app, Fastify 5 API, and PostgreSQL 15 RLS
                for database-enforced tenant isolation. SabiScore: ensemble ML inference behind a
                Next.js dashboard with caching, telemetry, and a deterministic fallback path.
                SwarmXQ: checkpointed agent orchestration with explicit retry and recovery semantics.
              </m.p>

              <m.p
                variants={itemVariants}
                className="about-narrative-p text-color-text-primary mt-5 max-w-[var(--max-width-prose)] text-base leading-8 opacity-[0.65]"
              >
                The current resume records the professional history and certifications; public
                repositories provide the inspectable layer. The work is the record, and private
                evidence is labelled as private.
              </m.p>
            </div>

            {/* Stack strip */}
            <m.div
              variants={itemVariants}
              data-cinematic="panel"
              className="mt-7 flex flex-wrap gap-2"
              aria-label="Technology stack"
            >
              {STACK_STRIP.map(({ name, cat, dot }) => (
                <div
                  key={name}
                  className="border-color-border flex items-center gap-2 rounded-md border bg-[oklch(100%_0_0_/_0.025)] px-3 py-1.5"
                  title={`Category: ${cat}`}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{ background: dot }}
                    aria-hidden="true"
                  />
                  <span className="text-color-text-muted font-mono text-[9px] tracking-widest uppercase">
                    {cat}
                  </span>
                  <span className="text-color-text-secondary text-xs font-medium">{name}</span>
                </div>
              ))}
            </m.div>

            {/* Constraint Code — non-negotiable engineering standards as active declarations */}
            <m.div
              variants={cardVariant}
              data-cinematic="panel"
              className="glass-surface border-l-color-film-teal mt-8 rounded-[var(--radius-lg)] border-l-2 p-5 sm:p-6"
            >
              <p className="text-color-film-teal mb-2 font-mono text-[10px] font-semibold tracking-widest uppercase">
                Constraint Code · Non-Negotiable Standards
              </p>
              <div className="flex flex-col gap-4" role="list">
                {[
                  {
                    declaration: 'Correctness is a product feature, not a backend preference.',
                    proof:
                      'The database schema, API contracts, and UI flows all carry the burden of truth — not just the last layer to touch the request.',
                  },
                  {
                    declaration: 'Silent failures are design failures.',
                    proof:
                      'Retries, dead-letter handling, structured logs, and metrics exist before the first incident, not after the apology.',
                  },
                  {
                    declaration: 'Every critical decision deserves a written rationale.',
                    proof:
                      'The next engineer should be able to understand the choice, the tradeoff, and what was consciously rejected.',
                  },
                  {
                    declaration: 'If a system cannot be observed, it cannot be trusted.',
                    proof:
                      'Health checks, traces, and dashboards are treated as part of the product surface — not optional operations decoration.',
                  },
                ].map(({ declaration, proof }) => (
                  <div key={declaration} className="flex flex-col gap-1" role="listitem">
                    <p className="text-color-text-primary text-sm leading-snug font-semibold">
                      {declaration}
                    </p>
                    <p className="text-color-text-muted text-xs leading-6">{proof}</p>
                  </div>
                ))}
              </div>
              <p className="text-color-text-muted mt-5 font-mono text-[10px] tracking-wider opacity-60">
                Traced to architecture decisions across TaxBridge · SabiScore · SwarmXQ
              </p>
            </m.div>

            <m.p
              variants={itemVariants}
              className="text-color-text-primary font-display mt-8 text-lg font-semibold"
            >
              Based in Lagos. <span className="text-color-film-teal">Operating on UTC+1.</span>
            </m.p>
          </div>

          {/* ── RIGHT COLUMN — headshot + resume-listed certs + quick facts ── */}
          <aside aria-label="Profile, certifications and quick facts">
            {/* Headshot — desktop only; hero handles mobile */}
            <m.div
              variants={itemVariants}
              data-cinematic="media"
              className="mb-6 hidden flex-col items-center gap-3 lg:flex"
            >
              <m.div
                className="relative"
                aria-hidden="true"
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        scale: 1.04,
                        transition: { type: 'spring', stiffness: 260, damping: 22 },
                      }
                }
              >
                {/* Conic teal ring — larger radius to match 180px image */}
                <div
                  className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_180deg,oklch(70%_0.21_188_/_0.65),transparent_55%,oklch(70%_0.21_188_/_0.28)_100%)]"
                  aria-hidden="true"
                />
                <Image
                  src="/images/oscar-headshot.jpg"
                  alt="Oscar Ndugbu"
                  width={180}
                  height={180}
                  priority={false}
                  className="relative h-[180px] w-[180px] rounded-full object-cover object-top shadow-[0_16px_48px_oklch(0%_0_0_/_0.55)]"
                />
              </m.div>
              <div className="text-center">
                <p className="font-display text-color-text-primary text-sm font-bold">
                  Oscar Ndugbu
                </p>
                <p className="text-color-text-muted mt-0.5 font-mono text-[10px] tracking-widest uppercase">
                  Backend · Platform · AI infrastructure
                </p>
              </div>
            </m.div>

            {/* Certifications heading */}
            <m.h3
              variants={itemVariants}
              className="font-body text-color-text-secondary text-xs tracking-widest uppercase"
            >
              Certifications listed on the current resume
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
                    data-cinematic="card"
                    className="glass-surface border-l-color-film-teal min-h-[56px] rounded-[var(--radius-md)] border-l-2 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-color-text-primary text-sm leading-snug font-medium">
                        {cert.name}
                      </p>
                      <span
                        className="mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-widest uppercase"
                        // eslint-disable-next-line no-restricted-syntax
                        style={{ background: ps.bg, color: ps.color, borderColor: ps.border }}
                        aria-label={`Provider: ${cert.provider}`}
                      >
                        {cert.provider}
                      </span>
                    </div>
                    <p className="text-color-text-muted mt-1.5 font-mono text-[11px]">
                      {cert.date}
                    </p>
                  </m.article>
                );
              })}
            </div>

            {/* Quick facts grid */}
            <m.div
              variants={itemVariants}
              data-cinematic="proof"
              className="mt-6 grid grid-cols-3 gap-3"
              aria-label="Quick facts"
            >
              {QUICK_FACTS.map(({ value, label }) => (
                <div
                  key={label}
                  className="border-color-border rounded-[var(--radius-md)] border bg-[oklch(100%_0_0_/_0.02)] p-3 text-center"
                >
                  <p className="text-color-film-teal font-mono text-base font-semibold">{value}</p>
                  <p className="text-color-text-muted mt-0.5 font-mono text-[9px] tracking-wide uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </m.div>

            {/* Recent activity feed — the right column's closing proof. Auto-refreshing
                every 5 minutes, sourced from GitHub push events + recent writing.
                Pairs with the left column's closing line: a public record, not a
                static claim. Hidden gracefully (returns its own empty/error
                states) if both sources are unavailable. */}
            <m.div variants={itemVariants} data-cinematic="proof" className="mt-6">
              <LiveBuildFeed />
            </m.div>
          </aside>
        </div>

        {/* Flow hook — V1.0 Change 6d: §Flow Mechanics §About */}
        <m.p
          variants={itemVariants}
          data-cinematic="cta"
          className="text-color-text-muted mt-8 font-mono text-[13px] [letter-spacing:0.06em]"
        >
          <Link href={anchorUrl('section-writing')} className="transition-opacity hover:opacity-80">
            Architecture calls documented →
          </Link>
        </m.p>
      </div>
    </ChapterFrame>
  );
}
