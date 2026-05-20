// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
'use client';

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import { ArchDecision } from '@/components/ArchDecision';
import { anchorUrl } from '@/lib/config';
import {
    accordionReveal,
    cardReveal,
    clipReveal,
    fadeRise,
    hoverLift,
    hoverNudgeX,
    noMotion,
    staggerContainer,
} from '@/lib/motionVariants';
import { PROJECTS, type Project } from '@/lib/projects';

const FEATURED_PRIMARY_VARIANT = cardReveal(28);
const FEATURED_SECONDARY_VARIANT = cardReveal(20);
const GRID_VARIANT_A = cardReveal(24);
const GRID_VARIANT_B = cardReveal(-20);

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

function TechStrip({
  stack,
  slug,
  limit = 5,
}: Readonly<{ stack: readonly string[]; slug: string; limit?: number }>) {
  const visible = stack.slice(0, limit);
  const rest = stack.length - visible.length;
  return (
    <div className="mt-4 flex flex-wrap gap-1.5" aria-label={`${slug} technology stack`}>
      {visible.map((tech) => (
        <span
          key={tech}
          className="glass-light text-color-text-muted min-w-0 rounded-md px-2 py-1 font-mono text-[10px] tracking-wide break-words"
        >
          {tech}
        </span>
      ))}
      {rest > 0 && (
        <span className="text-color-text-muted rounded-md px-2 py-1 font-mono text-[10px]">
          +{rest} more
        </span>
      )}
    </div>
  );
}

/* ── Primary featured card ─────────────────────────────────────────────────── */
function FeaturedProjectCard({
  featured,
  reducedMotion,
}: Readonly<{ featured: Project; reducedMotion: boolean }>) {
  const [archOpen, setArchOpen] = useState(false);

  return (
    <m.article
      variants={FEATURED_PRIMARY_VARIANT}
      className="glass-full mb-5 overflow-hidden rounded-[var(--radius-xl)]"
      data-project-id={featured.slug}
    >
      <div className="px-4 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <span className="label-mono">{featured.type}</span>
          <StatusBadge status={featured.status} />
        </div>

        <h3 className="text-color-text-primary text-[clamp(1.375rem,3.5vw+0.5rem,2.75rem)] leading-[1.15] font-bold tracking-tight">
          {featured.title}
        </h3>

        <p className="font-body text-color-text-secondary mt-3 max-w-[56ch] text-sm leading-[1.8] sm:text-base">
          {featured.tagline}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${featured.title} outcomes`}>
          {featured.outcomes.map((outcome) => (
            <li key={`${featured.slug}-${outcome}`} className="pill-cyan shrink-0">
              {outcome}
            </li>
          ))}
        </ul>

        <div className="border-l-color-film-teal mt-5 flex items-start gap-3 rounded-[var(--radius-sm)] border-l-2 bg-[oklch(73%_0.18_196_/_0.05)] py-3 pr-3 pl-3">
          <span className="label-mono text-color-film-teal w-12 shrink-0 pt-0.5 text-[10px]">
            WHY
          </span>
          <span className="text-color-text-primary min-w-0 text-[13px] leading-[1.7] font-medium break-words sm:text-sm">
            {featured.because}
          </span>
        </div>

        <p className="text-color-text-muted mt-3 border-l-2 border-l-[oklch(73%_0.18_75_/_0.3)] pl-3 text-xs leading-[1.7] break-words italic">
          Constraint: {featured.constraint}
        </p>

        <TechStrip stack={featured.stack} slug={featured.slug} />

        <details className="group mt-5">
          <summary className="text-color-text-muted inline-flex min-h-[48px] cursor-pointer list-none items-center gap-1.5 rounded-full border border-white/14 px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase transition hover:border-white/28 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none">
            <span className="group-open:hidden">Full brief ↓</span>
            <span className="hidden group-open:inline">Hide brief ↑</span>
          </summary>
          <div className="mt-4 pb-1">
            <p className="text-color-text-secondary max-w-[72ch] text-sm leading-8 sm:text-base">
              {featured.description}
            </p>
          </div>
        </details>
      </div>

      <div className="mt-5 px-4 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => setArchOpen((v) => !v)}
          className="border-color-border text-color-text-muted flex min-h-[48px] w-full items-center justify-between border-t py-3 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none lg:hidden"
          aria-expanded={archOpen}
          aria-controls={`arch-mobile-${featured.slug}`}
          aria-label={`Toggle architecture decision for ${featured.title}`}
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

        <div className="hidden pb-10 lg:block">
          <ArchDecision chosen={featured.chosen} over={featured.over} because={featured.because} />
        </div>
      </div>

      <div className="px-4 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
        <div className="border-color-border mt-2 flex flex-col gap-3 border-t pt-5">
          {featured.caseStudy && (
            <Link href={featured.caseStudy} className="cta-primary w-full justify-center">
              Read case study
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            {featured.demoUrl && (
              <a
                href={featured.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary w-full justify-center sm:w-auto sm:justify-start"
              >
                Live demo <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {featured.githubUrl && (
              <a
                href={featured.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-ghost flex min-h-[48px] items-center justify-center text-center sm:justify-start sm:text-left"
              >
                View source
              </a>
            )}
          </div>
        </div>
      </div>
    </m.article>
  );
}

/* ── Secondary featured card (2-col grid) ─────────────────────────────────── */
function SecondaryFeaturedCard({
  project,
  reducedMotion,
}: Readonly<{ project: Project; reducedMotion: boolean }>) {
  const [archOpen, setArchOpen] = useState(false);

  return (
    <m.article
      variants={FEATURED_SECONDARY_VARIANT}
      className="glass-full flex flex-col overflow-hidden rounded-[var(--radius-xl)]"
      data-project-id={project.slug}
      whileHover={
        reducedMotion
          ? undefined
          : hoverLift(-3)
      }
    >
      <div className="flex-1 px-4 pt-5 sm:px-6 sm:pt-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <span className="label-mono">{project.type}</span>
          <StatusBadge status={project.status} />
        </div>

        <h3 className="text-color-text-primary text-[clamp(1.2rem,2vw+0.5rem,1.6rem)] leading-[1.2] font-bold tracking-tight">
          {project.title}
        </h3>

        <p className="text-color-text-secondary mt-3 text-sm leading-[1.75]">{project.tagline}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${project.title} outcomes`}>
          {project.outcomes.map((outcome) => (
            <li key={`${project.slug}-${outcome}`} className="pill-cyan shrink-0 text-[11px]">
              {outcome}
            </li>
          ))}
        </ul>

        <div className="border-l-color-film-teal mt-4 flex items-start gap-3 rounded-[var(--radius-sm)] border-l-2 bg-[oklch(73%_0.18_196_/_0.05)] py-2.5 pr-3 pl-3">
          <span className="label-mono text-color-film-teal w-10 shrink-0 pt-0.5 text-[10px]">
            WHY
          </span>
          <span className="text-color-text-primary text-[12px] leading-[1.65] font-medium">
            {project.because}
          </span>
        </div>

        <TechStrip stack={project.stack} slug={project.slug} limit={4} />

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setArchOpen((v) => !v)}
            className="border-color-border text-color-text-muted flex min-h-[48px] w-full items-center justify-between border-t py-2.5 font-mono text-[10px] tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
            aria-expanded={archOpen}
            aria-controls={`arch-secondary-${project.slug}`}
            aria-label={`Toggle architecture decision for ${project.title}`}
          >
            <span>Architecture Decision</span>
            <m.span
              animate={{ rotate: archOpen ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </m.span>
          </button>

          <AnimatePresence initial={false}>
            {archOpen && (
              <m.div
                id={`arch-secondary-${project.slug}`}
                variants={reducedMotion ? undefined : accordionReveal}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="py-3">
                  <ArchDecision
                    chosen={project.chosen}
                    over={project.over}
                    because={project.because}
                  />
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-color-border mt-3 border-t px-4 pt-4 pb-5 sm:px-6 sm:pb-6">
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
          {project.caseStudy && (
            <Link
              href={project.caseStudy}
              className="cta-primary justify-center text-xs sm:justify-start"
            >
              Read the case study <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary justify-center text-xs sm:justify-start"
            >
              Live demo <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-ghost flex min-h-[44px] items-center justify-center text-xs sm:justify-start"
            >
              View source
            </a>
          )}
        </div>
      </div>
    </m.article>
  );
}

/* ── Grid card (non-featured) ─────────────────────────────────────────────── */
function ProjectCard({
  project,
  variant,
  reducedMotion,
}: Readonly<{ project: Project; variant: ReturnType<typeof cardReveal>; reducedMotion: boolean }>) {
  return (
    <m.article
      variants={variant}
      className="glass-medium flex flex-col overflow-hidden rounded-[var(--radius-xl)] p-4 sm:p-7"
      data-project-id={project.slug}
      whileHover={
        reducedMotion
          ? undefined
          : hoverLift(-4)
      }
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="label-mono">{project.type}</span>
        <StatusBadge status={project.status} />
      </div>
      <h3 className="text-color-text-primary text-base leading-snug font-semibold tracking-tight sm:text-xl">
        {project.title}
      </h3>
      <p className="text-color-text-secondary mt-2 flex-1 text-sm leading-[1.75]">
        {project.tagline}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${project.title} outcomes`}>
        {project.outcomes.slice(0, 3).map((outcome) => (
          <li key={`${project.slug}-${outcome}`} className="pill-cyan shrink-0">
            {outcome}
          </li>
        ))}
      </ul>
      <div className="border-color-border-subtle mt-4 space-y-2.5 border-t pt-4">
        <div className="flex items-start gap-2.5">
          <span className="label-mono text-color-film-teal mt-0.5 w-14 shrink-0 text-[10px]">
            BECAUSE
          </span>
          <span className="text-color-text-primary line-clamp-3 text-[12px] leading-[1.6] font-medium">
            {project.because}
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="label-mono text-color-success mt-0.5 w-14 shrink-0 text-[10px]">
            CHOSEN
          </span>
          <span className="text-color-text-secondary line-clamp-2 text-[12px] leading-[1.6]">
            {project.chosen}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {project.stack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-color-text-muted font-mono text-[9px] tracking-wide">
            {tech}
          </span>
        ))}
        {project.stack.length > 4 && (
          <span className="text-color-text-muted font-mono text-[9px]">
            +{project.stack.length - 4}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {project.caseStudy && (
          <Link
            href={project.caseStudy}
            className="cta-ghost group flex min-h-[48px] items-center justify-center gap-1 text-xs sm:justify-start"
          >
            Read case study
            <m.span
              aria-hidden="true"
              whileHover={reducedMotion ? undefined : hoverNudgeX(2)}
              className="inline-block"
            >
              →
            </m.span>
          </Link>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-ghost flex min-h-[48px] items-center justify-center text-xs sm:justify-start"
          >
            View source
          </a>
        )}
      </div>
    </m.article>
  );
}

/* ── Section export ───────────────────────────────────────────────────────── */
export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();

  const container = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;

  const primaryFeatured = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
  const secondaryFeatured = PROJECTS.filter((p) => p.featured && p.slug !== primaryFeatured.slug);
  const gridProjects = PROJECTS.filter((p) => !p.featured);

  return (
    <section
      id="section-projects"
      ref={ref}
      aria-labelledby="projects-heading"
      className="border-color-border section-deferred overflow-x-clip border-t py-[var(--section-py)]"
    >
      <div className="container">
        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          {/*
            v25 CHANGE: Editorial intro — section-intro-editorial (layout.css).
            Mobile: kicker, h2, and description stack vertically (unchanged).
            lg+: kicker+h2 anchor the left column; description sits right with
              editorial alignment — richer desktop composition, not blown-up mobile.
          */}
          <m.div variants={child} className="section-intro-editorial mb-10 sm:mb-14">
            {/* Left: kicker + heading */}
            <div>
              <div className="section-kicker-row mb-4">
                <span className="section-number" aria-hidden="true">
                  01
                </span>
                <span className="section-label">Projects</span>
              </div>
              <m.h2 variants={reducedMotion ? child : clipReveal} id="projects-heading">
                Built to survive <br className="hidden lg:block" />
                real constraints.
              </m.h2>
            </div>

            {/* Right: description — editorial counterweight at lg+ */}
            <div className="lg:flex lg:flex-col lg:justify-end">
              <p className="text-color-text-secondary max-w-[56ch] text-sm leading-8 sm:text-base">
                4-hour tax filings compressed to 15 minutes. 99.9%+ uptime under ensemble ML
                inference. AI agents that improve themselves between runs. All of it shipped from
                Lagos. All of it running in production.
              </p>
            </div>
          </m.div>

          {/* Primary featured */}
          <FeaturedProjectCard featured={primaryFeatured} reducedMotion={reducedMotion ?? false} />

          {/* Secondary featured — 2-col on md+ */}
          {secondaryFeatured.length > 0 && (
            <div className="secondary-featured-grid mb-5 grid gap-4 md:grid-cols-2">
              {secondaryFeatured.map((project) => (
                <SecondaryFeaturedCard
                  key={project.slug}
                  project={project}
                  reducedMotion={reducedMotion ?? false}
                />
              ))}
            </div>
          )}

          {/* Non-featured grid */}
          {gridProjects.length > 0 && (
            <div
              className={
                gridProjects.length === 1
                  ? 'projects-grid grid gap-4'
                  : 'projects-grid grid gap-4 sm:grid-cols-2'
              }
            >
              {gridProjects.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  variant={i % 2 === 0 ? GRID_VARIANT_A : GRID_VARIANT_B}
                  reducedMotion={reducedMotion ?? false}
                />
              ))}
            </div>
          )}

          {/* Flow hook — V1.0 Change 6a: §Flow Mechanics §Projects */}
          <m.p
            variants={child}
            className="text-color-text-muted mt-10 font-mono text-[13px] [letter-spacing:0.06em] opacity-50"
          >
            <Link
              href={anchorUrl('section-testimonials')}
              className="transition-opacity hover:opacity-80"
            >
              How these systems perform in production →
            </Link>
          </m.p>
        </m.div>
      </div>
    </section>
  );
}
