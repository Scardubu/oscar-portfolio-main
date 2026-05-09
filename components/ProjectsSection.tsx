// CONVICTION ENGINE v11.0 — ProjectsSection
//
// Design principles:
//   • A24 Didone authority: section heading clips in from left (wipe reveal),
//     not a simple fade. Creates geometric intersection — "unknown→revealed".
//   • Stripe trust architecture: "Read full brief" accordion uses spring
//     physics — never linear. Outcomes strip uses concrete metrics (no adjectives).
//   • Linear high-density: ArchDecision table is always visible on featured card.
//     Engineers shouldn't need to expand to see architectural reasoning.
//   • Dual-audience layout: tagline (DM) → outcomes pills (both) → arch (engineer).
//   • Scroll-triggered: useInView + staggerContainer for sequential reveals.
//
'use client';

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import { ArchDecision } from '@/components/ArchDecision';
import {
  accordionReveal,
  cardReveal,
  clipReveal,
  fadeRise,
  noMotion,
  staggerContainer,
  wordReveal,
  wordRevealContainer,
} from '@/lib/motionVariants';
import { PROJECTS, type Project } from '@/lib/projects';

const FEATURED_VARIANT = cardReveal(28);
const GRID_VARIANT_A = cardReveal(28);
const GRID_VARIANT_B = cardReveal(-24);

function StatusBadge({ status }: Readonly<{ status: Project['status'] }>) {
  if (status === 'case-study') {
    return <span className="badge-muted">CASE STUDY</span>;
  }
  return (
    <span className={status === 'live' ? 'badge-live' : 'badge-wip'}>
      <span className={status === 'live' ? 'dot-live' : 'dot-wip'} aria-hidden="true" />
      {status === 'live' ? 'LIVE' : 'WIP'}
    </span>
  );
}

function FeaturedProjectCard({
  featured,
  reducedMotion,
}: Readonly<{
  featured: Project;
  reducedMotion: boolean;
}>) {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <m.article
      variants={FEATURED_VARIANT}
      className="glass-full rounded-[var(--radius-xl)] p-8 sm:p-10 lg:p-12 overflow-hidden mb-6"
      data-project-id={featured.slug}
      // Engineer micro-interaction: hover lifts
      whileHover={reducedMotion ? undefined : { y: -3, transition: { type: 'spring', stiffness: 360, damping: 28 } }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="label-mono">{featured.type}</span>
        </div>
        <StatusBadge status={featured.status} />
      </div>

      {/* ── Headline: Didone display type ───────────────────────────── */}
      <h3
        className="text-[clamp(1.875rem,2.5vw+1rem,2.75rem)] font-bold leading-[1.1] tracking-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {featured.title}
      </h3>

      {/* ── Tagline: DM-readable, no jargon ─────────────────────────── */}
      <p
        className="mt-4 max-w-[58ch] text-lg leading-[1.7]"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {featured.tagline}
      </p>

      {/* ── Outcomes strip: concrete metrics — both audiences ────────── */}
      <ul
        className="mt-6 flex flex-wrap gap-2"
        aria-label={`${featured.title} outcomes`}
      >
        {featured.outcomes.map((outcome) => (
          <li
            key={`${featured.slug}-${outcome}`}
            className="pill-cyan"
          >
            {outcome}
          </li>
        ))}
      </ul>

      {/* ── Stack ────────────────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {featured.stack.map((tech) => (
          <span
            key={tech}
            className="glass-light rounded-md px-2.5 py-1 font-mono text-[10px] tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* ── Brief accordion: spring physics ─────────────────────────── */}
      <button
        type="button"
        onClick={() => setBriefOpen((v) => !v)}
        className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/14 px-4 py-2 font-mono text-[11px] tracking-widest uppercase text-white/55 transition hover:border-white/28 hover:text-white/80"
        aria-expanded={briefOpen}
        aria-controls={`brief-${featured.slug}`}
      >
        {briefOpen ? 'Hide brief ↑' : 'Read full brief ↓'}
      </button>

      <AnimatePresence initial={false}>
        {briefOpen && (
          <m.div
            id={`brief-${featured.slug}`}
            variants={reducedMotion ? undefined : accordionReveal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <p
              className="mt-5 max-w-[72ch] text-base leading-8"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {featured.description}
            </p>
            <p
              className="mt-4 max-w-[72ch] border-l-2 pl-3 text-sm italic"
              style={{
                borderLeftColor: 'oklch(73% 0.18 75 / 0.35)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Constraint: {featured.constraint}
            </p>
          </m.div>
        )}
      </AnimatePresence>

      {/* ── ArchDecision: always visible on featured card ────────────── */}
      {/* Rationale: engineer audience pattern-recognizes in <400ms.      */}
      {/* Hiding inside an accordion costs cognitive latency they won't pay. */}
      <div className="mt-8">
        <ArchDecision
          chosen={featured.chosen}
          over={featured.over}
          because={featured.because}
        />
      </div>

      {/* ── CTA strip ───────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {featured.caseStudy && (
          <Link href={featured.caseStudy} className="cta-primary">
            Read case study
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
        {featured.demoUrl && (
          <a
            href={featured.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-secondary"
          >
            Live demo
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        {featured.githubUrl && (
          <a
            href={featured.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-ghost"
          >
            View source →
          </a>
        )}
      </div>
    </m.article>
  );
}

function ProjectCard({
  project,
  variant,
  reducedMotion,
}: Readonly<{
  project: Project;
  variant: ReturnType<typeof cardReveal>;
  reducedMotion: boolean;
}>) {
  return (
    <m.article
      variants={variant}
      className="glass-medium flex flex-col rounded-[var(--radius-xl)] p-6 sm:p-8 overflow-hidden"
      data-project-id={project.slug}
      whileHover={reducedMotion ? undefined : {
        y: -4,
        transition: { type: 'spring', stiffness: 360, damping: 28 },
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="label-mono">{project.type}</span>
        <StatusBadge status={project.status} />
      </div>

      <h3
        className="text-xl font-semibold leading-snug tracking-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {project.title}
      </h3>
      <p
        className="mt-3 text-sm leading-7 flex-1"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {project.tagline}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${project.title} outcomes`}>
        {project.outcomes.slice(0, 3).map((outcome) => (
          <li key={`${project.slug}-${outcome}`} className="pill-cyan">
            {outcome}
          </li>
        ))}
      </ul>

      {/* Stack — condensed for grid card */}
      <div className="mt-4 flex flex-wrap gap-1">
        {project.stack.slice(0, 6).map((tech) => (
          <span
            key={tech}
            className="font-mono text-[9px] tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {tech}
          </span>
        ))}
        {project.stack.length > 6 && (
          <span className="font-mono text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
            +{project.stack.length - 6}
          </span>
        )}
      </div>

      {/* ArchDecision: compact 3-liner for grid cards */}
      <div
        className="mt-5 border-t pt-4"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span className="label-mono w-14 flex-shrink-0" style={{ color: 'var(--color-success)' }}>
              CHOSEN
            </span>
            <span className="text-[11px] leading-5" style={{ color: 'var(--color-text-secondary)' }}>
              {project.chosen}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="label-mono w-14 flex-shrink-0">OVER</span>
            <span className="text-[11px] leading-5" style={{ color: 'var(--color-text-muted)' }}>
              {project.over}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="label-mono w-14 flex-shrink-0" style={{ color: 'var(--color-accent)' }}>
              BECAUSE
            </span>
            <span
              className="text-[11px] leading-5 font-medium"
              style={{ color: 'var(--color-text-primary)' }}
              data-label="BECAUSE"
            >
              {project.because}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5 flex gap-3">
        {project.caseStudy && (
          <Link href={project.caseStudy} className="cta-ghost text-xs">
            Case study →
          </Link>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="cta-ghost text-xs">
            Source →
          </a>
        )}
      </div>
    </m.article>
  );
}

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();

  const container = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;

  const featured = PROJECTS[0];
  const gridProjects = PROJECTS.slice(1);

  return (
    <section
      id="section-projects"
      ref={ref}
      aria-labelledby="projects-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* ── Section kicker ───────────────────────────────────────── */}
          <m.div variants={child} className="section-kicker-row mb-14 max-w-4xl">
            <span className="section-number" aria-hidden="true">01</span>
            <span className="section-label">Projects</span>
          </m.div>

          {/* ── Section heading: A24 clip wipe ───────────────────────── */}
          {/* Clipped left-to-right — "unknown → revealed" geometry */}
          <m.h2
            variants={reducedMotion ? child : clipReveal}
            id="projects-heading"
            className="mb-5"
          >
            Systems built to last.
          </m.h2>

          <m.p
            variants={child}
            className="mb-14 max-w-[60ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Four years of independent product work — production-grade infrastructure,
            compliance architecture, and ML backends built from zero and maintained in production.
          </m.p>

          {/* ── Featured project card ────────────────────────────────── */}
          <FeaturedProjectCard featured={featured} reducedMotion={reducedMotion ?? false} />

          {/* ── Grid projects ────────────────────────────────────────── */}
          <div className="grid gap-5 sm:grid-cols-2">
            {gridProjects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                variant={i % 2 === 0 ? GRID_VARIANT_A : GRID_VARIANT_B}
                reducedMotion={reducedMotion ?? false}
              />
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
