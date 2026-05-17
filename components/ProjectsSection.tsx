// CONVICTION ENGINE v25.0 — ProjectsSection
//
// v25 vs v24:
//   [CHANGE]: Section intro — editorial 2-col at lg+.
//     Previous: kicker + h2 + description stacked single-column on all viewports.
//     Problem: At desktop, a full-width heading over a full-width paragraph
//       wastes the wider canvas and creates a "blown-up phone screen" reading
//       pattern — excessively short line measure on the heading, unnecessarily
//       wide measure on the paragraph.
//     Fix: Wrap kicker+heading and description paragraph in `section-intro-editorial`
//       div (layout.css). At lg+ this becomes a 2-col grid (heading left,
//       description right) with editorial alignment. Mobile unchanged.
//     (layout.css `.section-intro-editorial` — desktop expansion, not mobile change)
//   KEEP: All v24 card structure, motion, arch decision accordion, tech strips,
//     grid layout, all CTA text, StatusBadge, TechStrip, FeaturedProjectCard,
//     SecondaryFeaturedCard, ProjectCard, spring physics, reduced-motion fallbacks.
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

const FEATURED_PRIMARY_VARIANT   = cardReveal(28);
const FEATURED_SECONDARY_VARIANT = cardReveal(20);
const GRID_VARIANT_A             = cardReveal(24);
const GRID_VARIANT_B             = cardReveal(-20);

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

/* ── Primary featured card ─────────────────────────────────────────────────── */
function FeaturedProjectCard({
  featured,
  reducedMotion,
}: Readonly<{ featured: Project; reducedMotion: boolean }>) {
  const [archOpen, setArchOpen] = useState(false);

  return (
    <m.article
      variants={FEATURED_PRIMARY_VARIANT}
      className="glass-full rounded-[var(--radius-xl)] overflow-hidden mb-5"
      data-project-id={featured.slug}
    >
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

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${featured.title} outcomes`}>
          {featured.outcomes.map((outcome) => (
            <li key={`${featured.slug}-${outcome}`} className="pill-cyan shrink-0">
              {outcome}
            </li>
          ))}
        </ul>

        <div
          className="mt-5 flex items-start gap-3 rounded-[var(--radius-sm)] border-l-2 py-3 pl-3 pr-3"
          style={{ borderLeftColor: 'var(--color-film-teal)', background: 'oklch(73% 0.18 196 / 0.05)' }}
        >
          <span className="label-mono text-[10px] shrink-0 pt-0.5 w-12" style={{ color: 'var(--color-film-teal)' }}>
            WHY
          </span>
          <span className="text-[13px] sm:text-sm leading-[1.7] font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {featured.because}
          </span>
        </div>

        <p
          className="mt-3 border-l-2 pl-3 text-xs leading-[1.7] italic"
          style={{ borderLeftColor: 'oklch(73% 0.18 75 / 0.3)', color: 'var(--color-text-muted)' }}
        >
          Constraint: {featured.constraint}
        </p>

        <TechStrip stack={featured.stack} slug={featured.slug} />

        <details className="mt-5 group">
          <summary
            className="list-none cursor-pointer inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-white/14 px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase transition hover:border-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="group-open:hidden">Full brief ↓</span>
            <span className="hidden group-open:inline">Hide brief ↑</span>
          </summary>
          <div className="mt-4 pb-1">
            <p className="max-w-[72ch] text-sm sm:text-base leading-8" style={{ color: 'var(--color-text-secondary)' }}>
              {featured.description}
            </p>
          </div>
        </details>
      </div>

      <div className="mt-5 px-4 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => setArchOpen((v) => !v)}
          className="lg:hidden w-full flex items-center justify-between min-h-[48px] py-3 border-t font-mono text-[11px] tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          aria-expanded={archOpen}
          aria-controls={`arch-mobile-${featured.slug}`}
          aria-label={`Toggle architecture decision for ${featured.title}`}
        >
          <span>Architecture Decision</span>
          <m.span animate={{ rotate: archOpen ? 180 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </m.span>
        </button>

        <AnimatePresence initial={false}>
          {archOpen && (
            <m.div
              id={`arch-mobile-${featured.slug}`}
              variants={reducedMotion ? undefined : accordionReveal}
              initial="hidden" animate="visible" exit="exit"
              className="overflow-hidden lg:hidden"
            >
              <div className="py-4">
                <ArchDecision chosen={featured.chosen} over={featured.over} because={featured.because} />
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <div className="hidden lg:block pb-10">
          <ArchDecision chosen={featured.chosen} over={featured.over} because={featured.because} />
        </div>
      </div>

      <div className="px-4 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
        <div className="mt-2 flex flex-col gap-3" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
          {featured.caseStudy && (
            <Link href={featured.caseStudy} className="cta-primary w-full justify-center">
              Read case study
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            {featured.demoUrl && (
              <a href={featured.demoUrl} target="_blank" rel="noopener noreferrer" className="cta-secondary w-full justify-center sm:w-auto sm:justify-start">
                Live demo <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {featured.githubUrl && (
              <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer" className="cta-ghost text-center sm:text-left min-h-[48px] flex items-center justify-center sm:justify-start">
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
      className="glass-full rounded-[var(--radius-xl)] overflow-hidden flex flex-col"
      data-project-id={project.slug}
      whileHover={reducedMotion ? undefined : { y: -3, transition: { type: 'spring', stiffness: 360, damping: 28 } }}
    >
      <div className="px-4 pt-5 sm:px-6 sm:pt-6 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <span className="label-mono">{project.type}</span>
          <StatusBadge status={project.status} />
        </div>

        <h3
          className="text-[clamp(1.2rem,2vw+0.5rem,1.6rem)] font-bold leading-[1.2] tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {project.title}
        </h3>

        <p className="mt-3 text-sm leading-[1.75]" style={{ color: 'var(--color-text-secondary)' }}>
          {project.tagline}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${project.title} outcomes`}>
          {project.outcomes.map((outcome) => (
            <li key={`${project.slug}-${outcome}`} className="pill-cyan shrink-0 text-[11px]">
              {outcome}
            </li>
          ))}
        </ul>

        <div
          className="mt-4 flex items-start gap-3 rounded-[var(--radius-sm)] border-l-2 py-2.5 pl-3 pr-3"
          style={{ borderLeftColor: 'var(--color-film-teal)', background: 'oklch(73% 0.18 196 / 0.05)' }}
        >
          <span className="label-mono text-[10px] shrink-0 pt-0.5 w-10" style={{ color: 'var(--color-film-teal)' }}>
            WHY
          </span>
          <span className="text-[12px] leading-[1.65] font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {project.because}
          </span>
        </div>

        <TechStrip stack={project.stack} slug={project.slug} limit={4} />

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setArchOpen((v) => !v)}
            className="w-full flex items-center justify-between min-h-[48px] py-2.5 border-t font-mono text-[10px] tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            aria-expanded={archOpen}
            aria-controls={`arch-secondary-${project.slug}`}
            aria-label={`Toggle architecture decision for ${project.title}`}
          >
            <span>Architecture Decision</span>
            <m.span animate={{ rotate: archOpen ? 180 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </m.span>
          </button>

          <AnimatePresence initial={false}>
            {archOpen && (
              <m.div
                id={`arch-secondary-${project.slug}`}
                variants={reducedMotion ? undefined : accordionReveal}
                initial="hidden" animate="visible" exit="exit"
                className="overflow-hidden"
              >
                <div className="py-3">
                  <ArchDecision chosen={project.chosen} over={project.over} because={project.because} />
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className="px-4 pb-5 sm:px-6 sm:pb-6 mt-3"
        style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2 mt-3">
          {project.caseStudy && (
            <Link href={project.caseStudy} className="cta-primary justify-center sm:justify-start text-xs">
              Read the case study <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="cta-secondary justify-center sm:justify-start text-xs">
              Live demo <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="cta-ghost text-xs min-h-[44px] flex items-center justify-center sm:justify-start">
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
      className="glass-medium flex flex-col rounded-[var(--radius-xl)] p-4 sm:p-7 overflow-hidden"
      data-project-id={project.slug}
      whileHover={reducedMotion ? undefined : { y: -4, transition: { type: 'spring', stiffness: 360, damping: 28 } }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="label-mono">{project.type}</span>
        <StatusBadge status={project.status} />
      </div>
      <h3 className="text-base sm:text-xl font-semibold leading-snug tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-[1.75] flex-1" style={{ color: 'var(--color-text-secondary)' }}>
        {project.tagline}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${project.title} outcomes`}>
        {project.outcomes.slice(0, 3).map((outcome) => (
          <li key={`${project.slug}-${outcome}`} className="pill-cyan shrink-0">{outcome}</li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t space-y-2.5" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="flex items-start gap-2.5">
          <span className="label-mono w-14 shrink-0 mt-0.5 text-[10px]" style={{ color: 'var(--color-film-teal)' }}>BECAUSE</span>
          <span className="text-[12px] leading-[1.6] font-medium line-clamp-3" style={{ color: 'var(--color-text-primary)' }}>{project.because}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="label-mono w-14 shrink-0 mt-0.5 text-[10px]" style={{ color: 'var(--color-success)' }}>CHOSEN</span>
          <span className="text-[12px] leading-[1.6] line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{project.chosen}</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {project.stack.slice(0, 4).map((tech) => (
          <span key={tech} className="font-mono text-[9px] tracking-wide" style={{ color: 'var(--color-text-muted)' }}>{tech}</span>
        ))}
        {project.stack.length > 4 && (
          <span className="font-mono text-[9px]" style={{ color: 'var(--color-text-muted)' }}>+{project.stack.length - 4}</span>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {project.caseStudy && (
          <Link href={project.caseStudy} className="cta-ghost text-xs min-h-[48px] flex items-center justify-center sm:justify-start">
            Read case study →
          </Link>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="cta-ghost text-xs min-h-[48px] flex items-center justify-center sm:justify-start">
            View source
          </a>
        )}
      </div>
    </m.article>
  );
}

/* ── Section export ───────────────────────────────────────────────────────── */
export function ProjectsSection() {
  const ref           = useRef<HTMLElement>(null);
  const inView        = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();

  const container = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child     = reducedMotion ? noMotion : fadeRise;

  const primaryFeatured   = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
  const secondaryFeatured = PROJECTS.filter((p) => p.featured && p.slug !== primaryFeatured.slug);
  const gridProjects      = PROJECTS.filter((p) => !p.featured);

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
                <span className="section-number" aria-hidden="true">01</span>
                <span className="section-label">Projects</span>
              </div>
              <m.h2
                variants={reducedMotion ? child : clipReveal}
                id="projects-heading"
              >
                Built to survive{' '}
                <br className="hidden lg:block" />
                real constraints.
              </m.h2>
            </div>

            {/* Right: description — editorial counterweight at lg+ */}
            <div className="lg:flex lg:flex-col lg:justify-end">
              <p
                className="max-w-[52ch] text-sm sm:text-base leading-8"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                4-hour tax filings compressed to 15 minutes. 99.9%+ uptime under
                ensemble ML inference. AI agents that improve themselves between
                runs. All of it shipped from Lagos. All of it running in production.
              </p>
            </div>
          </m.div>

          {/* Primary featured */}
          <FeaturedProjectCard featured={primaryFeatured} reducedMotion={reducedMotion ?? false} />

          {/* Secondary featured — 2-col on md+ */}
          {secondaryFeatured.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 mb-5">
              {secondaryFeatured.map((project) => (
                <SecondaryFeaturedCard key={project.slug} project={project} reducedMotion={reducedMotion ?? false} />
              ))}
            </div>
          )}

          {/* Non-featured grid */}
          {gridProjects.length > 0 && (
            <div className={gridProjects.length === 1 ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2'}>
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
        </m.div>
      </div>
    </section>
  );
}