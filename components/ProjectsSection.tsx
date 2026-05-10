// CONVICTION ENGINE v21.1 — ProjectsSection
// FIXED (v21.1): Four missing <a opening tags — broken JSX causing build failure.
//   - featured.demoUrl anchor: restored <a ... >
//   - featured.githubUrl anchor: restored <a ... >
//   - project.githubUrl anchor (ProjectCard): restored <a ... >
// Mobile-native: 320–430px is the source of truth. Lagos, Nigeria → Global.
'use client';

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
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
} from '@/lib/motionVariants';
import { PROJECTS, type Project } from '@/lib/projects';

const FEATURED_VARIANT = cardReveal(28);
const GRID_VARIANT_A   = cardReveal(24);
const GRID_VARIANT_B   = cardReveal(-20);

function StatusBadge({ status }: Readonly<{ status: Project['status'] }>) {
  if (status === 'case-study') {
    return <span className="badge-muted">CASE STUDY</span>;
  }
  return (
    <span className={status === 'live' ? 'badge-live' : 'badge-wip'}>
      <span
        className={status === 'live' ? 'dot-live' : 'dot-wip'}
        aria-hidden="true"
      />
      {status === 'live' ? 'LIVE' : 'WIP'}
    </span>
  );
}

function TechStrip({
  stack,
  slug,
  limit = 6,
}: Readonly<{ stack: readonly string[]; slug: string; limit?: number }>) {
  const visible = stack.slice(0, limit);
  const rest    = stack.length - visible.length;
  return (
    <div
      className="mt-3 flex flex-wrap gap-1"
      aria-label={`${slug} technology stack`}
    >
      {visible.map((tech) => (
        <span
          key={tech}
          className="glass-light rounded-md px-2 py-0.5 font-mono text-[10px] tracking-wide"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {tech}
        </span>
      ))}
      {rest > 0 && (
        <span
          className="rounded-md px-2 py-0.5 font-mono text-[10px]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          +{rest} more
        </span>
      )}
    </div>
  );
}

function FeaturedProjectCard({
  featured,
  reducedMotion,
}: Readonly<{
  featured: Project;
  reducedMotion: boolean;
}>) {
  const [archOpen, setArchOpen] = useState(false);

  return (
    <m.article
      variants={FEATURED_VARIANT}
      className="glass-full rounded-[var(--radius-xl)] overflow-hidden mb-5"
      data-project-id={featured.slug}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <span className="label-mono">{featured.type}</span>
          <StatusBadge status={featured.status} />
        </div>

        {/* Headline */}
        <h3
          className="text-[clamp(1.5rem,3.5vw+0.75rem,2.75rem)] font-bold leading-[1.1] tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {featured.title}
        </h3>

        {/* Tagline */}
        <p
          className="mt-3 max-w-[56ch] text-base leading-[1.75]"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}
        >
          {featured.tagline}
        </p>

        {/* Outcomes — flex-wrap, no scroll */}
        <ul
          className="mt-4 flex flex-wrap gap-2"
          aria-label={`${featured.title} outcomes`}
        >
          {featured.outcomes.map((outcome) => (
            <li key={`${featured.slug}-${outcome}`} className="pill-cyan shrink-0">
              {outcome}
            </li>
          ))}
        </ul>

        {/* BECAUSE — elevated above tech strip: highest evaluator signal */}
        <div
          className="mt-4 flex items-start gap-2.5 rounded-[var(--radius-sm)] border-l-2 py-2 pl-3 pr-2"
          style={{
            borderLeftColor: 'var(--color-film-teal)',
            background: 'oklch(73% 0.18 196 / 0.05)',
          }}
        >
          <span
            className="label-mono text-[10px] shrink-0 pt-0.5 w-14"
            style={{ color: 'var(--color-film-teal)' }}
          >
            WHY
          </span>
          <span
            className="text-[12px] sm:text-sm leading-5 font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {featured.because}
          </span>
        </div>

        {/* Constraint */}
        <p
          className="mt-3 border-l-2 pl-3 text-xs leading-5 italic"
          style={{
            borderLeftColor: 'oklch(73% 0.18 75 / 0.3)',
            color: 'var(--color-text-muted)',
          }}
        >
          Constraint: {featured.constraint}
        </p>

        {/* Tech strip */}
        <TechStrip stack={featured.stack} slug={featured.slug} />

        {/* Full brief: native details, zero JS */}
        <details className="mt-5 group">
          <summary
            className="list-none cursor-pointer inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-white/14 px-4 py-2 font-mono text-[11px] tracking-widest uppercase transition hover:border-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="group-open:hidden">Full brief ↓</span>
            <span className="hidden group-open:inline">Hide brief ↑</span>
          </summary>
          <div className="mt-4 pb-1">
            <p
              className="max-w-[72ch] text-base leading-8"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {featured.description}
            </p>
          </div>
        </details>
      </div>

      {/* ── Architecture Decision: collapsible on mobile ─────────────────── */}
      <div className="mt-5 px-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => setArchOpen((v) => !v)}
          className="lg:hidden w-full flex items-center justify-between min-h-[48px] py-3 border-t font-mono text-[11px] tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
          aria-expanded={archOpen}
          aria-controls={`arch-mobile-${featured.slug}`}
        >
          <span>Architecture Decision</span>
          <m.span
            animate={{ rotate: archOpen ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </m.span>
        </button>

        <AnimatePresence initial={false}>
          {archOpen && (
            <m.div
              id={`arch-mobile-${featured.slug}`}
              variants={reducedMotion ? undefined : accordionReveal}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden lg:hidden"
            >
              <div className="pb-4">
                <ArchDecision
                  chosen={featured.chosen}
                  over={featured.over}
                  because={featured.because}
                />
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <div className="hidden lg:block pb-10">
          <ArchDecision
            chosen={featured.chosen}
            over={featured.over}
            because={featured.because}
          />
        </div>
      </div>

      {/* ── CTA strip ────────────────────────────────────────────────────── */}
      <div className="px-5 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
        <div
          className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}
        >
          {featured.caseStudy && (
            <Link
              href={featured.caseStudy}
              className="cta-primary w-full justify-center sm:w-auto sm:justify-start"
            >
              Read case study
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
          {/* FIX v21.1: restored missing <a opening tag */}
          {featured.demoUrl && (
            <a
              href={featured.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary w-full justify-center sm:w-auto sm:justify-start"
            >
              Live demo
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
          {/* FIX v21.1: restored missing <a opening tag */}
          {featured.githubUrl && (
            <a
              href={featured.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-ghost text-center sm:text-left"
            >
              View source →
            </a>
          )}
        </div>
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
      className="glass-medium flex flex-col rounded-[var(--radius-xl)] p-5 sm:p-7 overflow-hidden"
      data-project-id={project.slug}
      whileHover={
        reducedMotion
          ? undefined
          : { y: -4, transition: { type: 'spring', stiffness: 360, damping: 28 } }
      }
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

      {/* Outcomes: 3 max always — no overflow */}
      <ul
        className="mt-4 flex flex-wrap gap-2"
        aria-label={`${project.title} outcomes`}
      >
        {project.outcomes.slice(0, 3).map((outcome) => (
          <li key={`${project.slug}-${outcome}`} className="pill-cyan shrink-0">
            {outcome}
          </li>
        ))}
      </ul>

      {/* Arch signals: BECAUSE dominant */}
      <div
        className="mt-5 pt-4 border-t space-y-2.5"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div className="flex items-start gap-2">
          <span
            className="label-mono w-14 shrink-0 mt-0.5 text-[10px]"
            style={{ color: 'var(--color-film-teal)' }}
          >
            BECAUSE
          </span>
          <span
            className="text-[11px] leading-5 font-medium line-clamp-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {project.because}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span
            className="label-mono w-14 shrink-0 mt-0.5 text-[10px]"
            style={{ color: 'var(--color-success)' }}
          >
            CHOSEN
          </span>
          <span
            className="text-[11px] leading-5 line-clamp-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {project.chosen}
          </span>
        </div>
      </div>

      {/* Tech strip — condensed */}
      <div className="mt-3 flex flex-wrap gap-1">
        {project.stack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="font-mono text-[9px] tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {tech}
          </span>
        ))}
        {project.stack.length > 4 && (
          <span
            className="font-mono text-[9px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            +{project.stack.length - 4}
          </span>
        )}
      </div>

      {/* CTAs: full-width on mobile */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {project.caseStudy && (
          <Link
            href={project.caseStudy}
            className="cta-ghost text-xs min-h-[48px] flex items-center justify-center sm:justify-start"
          >
            Case study →
          </Link>
        )}
        {/* FIX v21.1: restored missing <a opening tag */}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-ghost text-xs min-h-[48px] flex items-center justify-center sm:justify-start"
          >
            Source →
          </a>
        )}
      </div>
    </m.article>
  );
}

export function ProjectsSection() {
  const ref           = useRef<HTMLElement>(null);
  const inView        = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();

  const container    = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child        = reducedMotion ? noMotion : fadeRise;
  const featured     = PROJECTS[0];
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
          {/* Section kicker */}
          <m.div variants={child} className="section-kicker-row mb-8 sm:mb-12">
            <span className="section-number" aria-hidden="true">01</span>
            <span className="section-label">Projects</span>
          </m.div>

          {/* Heading */}
          <m.h2
            variants={reducedMotion ? child : clipReveal}
            id="projects-heading"
            className="mb-4"
          >
            Systems built to last.
          </m.h2>

          <m.p
            variants={child}
            className="mb-10 sm:mb-14 max-w-[56ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Four years of independent product work — production-grade fintech infrastructure,
            compliance automation, and ML backends. Built in Lagos. Maintained in production.
          </m.p>

          {/* Featured project */}
          <FeaturedProjectCard
            featured={featured}
            reducedMotion={reducedMotion ?? false}
          />

          {/* Grid projects */}
          <div className="grid gap-4 sm:grid-cols-2">
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