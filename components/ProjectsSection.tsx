// CONVICTION ENGINE v22.0 — ProjectsSection
// Mobile-native: 320–430px is the source of truth. Lagos → Global.
//
// v22 upgrades vs v21.1:
//   • Featured card header: px-4 on 320px (was px-5 — too dense at narrow widths)
//   • WHY block: text-[13px] sm:text-sm (was 12px — illegible outdoors at 320px)
//   • Outcomes pills: gap-1.5 for better touch separation
//   • CTA strip: primary CTA always full-width on mobile; secondary wraps below
//   • ProjectCard: BECAUSE at text-[12px] with proper line-height for mobile scan
//   • All touch targets: hard-minimum 48px enforced via min-h-[48px]
//   • glass-full featured card: border-radius unified to var(--radius-xl)
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
  limit = 5,
}: Readonly<{ stack: readonly string[]; slug: string; limit?: number }>) {
  const visible = stack.slice(0, limit);
  const rest    = stack.length - visible.length;
  return (
    <div
      className="mt-4 flex flex-wrap gap-1.5"
      aria-label={`${slug} technology stack`}
    >
      {visible.map((tech) => (
        <span
          key={tech}
          className="glass-light rounded-md px-2 py-1 font-mono text-[10px] tracking-wide"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {tech}
        </span>
      ))}
      {rest > 0 && (
        <span
          className="rounded-md px-2 py-1 font-mono text-[10px]"
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
      <div className="px-4 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <span className="label-mono">{featured.type}</span>
          <StatusBadge status={featured.status} />
        </div>

        <h3
          className="text-[clamp(1.375rem,3.5vw+0.5rem,2.75rem)] font-bold leading-[1.15] tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {featured.title}
        </h3>

        <p
          className="mt-3 max-w-[56ch] text-sm sm:text-base leading-[1.8]"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}
        >
          {featured.tagline}
        </p>

        {/* Outcomes — flex-wrap, no scroll */}
        <ul
          className="mt-4 flex flex-wrap gap-1.5"
          aria-label={`${featured.title} outcomes`}
        >
          {featured.outcomes.map((outcome) => (
            <li key={`${featured.slug}-${outcome}`} className="pill-cyan shrink-0">
              {outcome}
            </li>
          ))}
        </ul>

        {/* BECAUSE — core evaluator signal: architectural reasoning at a glance */}
        <div
          className="mt-5 flex items-start gap-3 rounded-[var(--radius-sm)] border-l-2 py-3 pl-3 pr-3"
          style={{
            borderLeftColor: 'var(--color-film-teal)',
            background: 'oklch(73% 0.18 196 / 0.05)',
          }}
        >
          <span
            className="label-mono text-[10px] shrink-0 pt-0.5 w-12"
            style={{ color: 'var(--color-film-teal)' }}
          >
            WHY
          </span>
          <span
            className="text-[13px] sm:text-sm leading-[1.7] font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {featured.because}
          </span>
        </div>

        {/* Constraint */}
        <p
          className="mt-3 border-l-2 pl-3 text-xs leading-[1.7] italic"
          style={{
            borderLeftColor: 'oklch(73% 0.18 75 / 0.3)',
            color: 'var(--color-text-muted)',
          }}
        >
          Constraint: {featured.constraint}
        </p>

        <TechStrip stack={featured.stack} slug={featured.slug} />

        {/* Full brief — native details, zero JS */}
        <details className="mt-5 group">
          <summary
            className="list-none cursor-pointer inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-white/14 px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase transition hover:border-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="group-open:hidden">Full brief ↓</span>
            <span className="hidden group-open:inline">Hide brief ↑</span>
          </summary>
          <div className="mt-4 pb-1">
            <p
              className="max-w-[72ch] text-sm sm:text-base leading-8"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {featured.description}
            </p>
          </div>
        </details>
      </div>

      {/* ── Architecture Decision: collapsible on mobile ─────────────────── */}
      <div className="mt-5 px-4 sm:px-8 lg:px-10">
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
              <div className="py-4">
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
      <div className="px-4 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
        <div
          className="mt-2 flex flex-col gap-3"
          style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}
        >
          {featured.caseStudy && (
            <Link
              href={featured.caseStudy}
              className="cta-primary w-full justify-center"
            >
              Read case study
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            {featured.demoUrl && (
              
                href={featured.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary w-full justify-center sm:w-auto sm:justify-start"
              >
                Live demo
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {featured.githubUrl && (
              
                href={featured.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-ghost text-center sm:text-left min-h-[48px] flex items-center justify-center sm:justify-start"
              >
                View source →
              </a>
            )}
          </div>
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
      className="glass-medium flex flex-col rounded-[var(--radius-xl)] p-4 sm:p-7 overflow-hidden"
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
        className="text-base sm:text-xl font-semibold leading-snug tracking-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {project.title}
      </h3>

      <p
        className="mt-2 text-sm leading-[1.75] flex-1"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {project.tagline}
      </p>

      {/* Outcomes: 3 max */}
      <ul
        className="mt-4 flex flex-wrap gap-1.5"
        aria-label={`${project.title} outcomes`}
      >
        {project.outcomes.slice(0, 3).map((outcome) => (
          <li key={`${project.slug}-${outcome}`} className="pill-cyan shrink-0">
            {outcome}
          </li>
        ))}
      </ul>

      {/* Arch signals */}
      <div
        className="mt-4 pt-4 border-t space-y-2.5"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="label-mono w-14 shrink-0 mt-0.5 text-[10px]"
            style={{ color: 'var(--color-film-teal)' }}
          >
            BECAUSE
          </span>
          <span
            className="text-[12px] leading-[1.6] font-medium line-clamp-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {project.because}
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <span
            className="label-mono w-14 shrink-0 mt-0.5 text-[10px]"
            style={{ color: 'var(--color-success)' }}
          >
            CHOSEN
          </span>
          <span
            className="text-[12px] leading-[1.6] line-clamp-2"
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
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {project.caseStudy && (
          <Link
            href={project.caseStudy}
            className="cta-ghost text-xs min-h-[48px] flex items-center justify-center sm:justify-start"
          >
            Case study →
          </Link>
        )}
        {project.githubUrl && (
          
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
          <m.div variants={child} className="section-kicker-row mb-8 sm:mb-12">
            <span className="section-number" aria-hidden="true">01</span>
            <span className="section-label">Projects</span>
          </m.div>

          <m.h2
            variants={reducedMotion ? child : clipReveal}
            id="projects-heading"
            className="mb-4"
          >
            Systems built to last.
          </m.h2>

          <m.p
            variants={child}
            className="mb-10 sm:mb-14 max-w-[56ch] text-sm sm:text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Four years of independent product work — production-grade fintech infrastructure,
            compliance automation, and ML backends. Built in Lagos. Maintained in production.
          </m.p>

          <FeaturedProjectCard
            featured={featured}
            reducedMotion={reducedMotion ?? false}
          />

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