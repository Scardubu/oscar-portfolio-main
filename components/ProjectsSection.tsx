// CONVICTION ENGINE v10.0 — FULL REPLACEMENT
'use client';

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import { ArchDecision } from '@/components/ArchDecision';
import { cardReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';
import { PROJECTS, type Project } from '@/lib/projects';

// Module-scope constants — never call cardReveal() inside .map() or JSX [v15 FIX-HOOK]
const FEATURED_VARIANT = cardReveal(24);
const GRID_VARIANTS = [cardReveal(24), cardReveal(-24)] as const;

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
  variant,
}: Readonly<{
  featured: Project;
  reducedMotion: boolean;
  variant: typeof FEATURED_VARIANT;
}>) {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <m.article
      variants={variant}
      className="glass glass-full glass-chromatic card-depth mb-8 overflow-hidden rounded-(--radius-xl) p-8 sm:p-10 lg:p-12"
      data-project-id={featured.slug}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="label">{featured.type}</span>
        <StatusBadge status={featured.status} />
      </div>

      <h3 className="mt-6 text-[clamp(2rem,2vw+1rem,2.8rem)] font-semibold text-white">
        {featured.title}
      </h3>
      <p className="font-display text-text-secondary mt-4 max-w-[58ch] text-(length:--text-xl) leading-[1.7]">
        {featured.tagline}
      </p>

      <ul className="outcomes-strip mt-6 flex flex-wrap gap-3" aria-label={`${featured.title} outcomes`}>
        {featured.outcomes.map((outcome) => (
          <li
            key={`${featured.slug}-${outcome}`}
            className="pill-cyan font-mono text-[11px] tracking-widest uppercase"
          >
            {outcome}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setBriefOpen((v) => !v)}
        className="mt-5 inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] tracking-widest text-white/70 uppercase transition hover:border-white/30 hover:text-white"
      >
        {briefOpen ? 'Hide full brief ↑' : 'Read full brief ↓'}
      </button>

      <AnimatePresence initial={false}>
        {briefOpen ? (
          <m.div
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={
              reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 24 }
            }
            className="overflow-hidden"
          >
            <p className="font-display text-text-secondary mt-5 max-w-[72ch] text-base leading-8">
              {featured.description}
            </p>
            <p className="font-display text-text-secondary mt-4 max-w-[72ch] border-l-2 border-[rgba(245,158,11,0.35)] pl-3 text-sm italic">
              Constraint: {featured.constraint}
            </p>
          </m.div>
        ) : null}
      </AnimatePresence>

      <ArchDecision
        chosen={featured.chosen}
        over={featured.over}
        because={featured.because}
        compact={false}
      />

      <ul className="mt-6 flex flex-wrap gap-3" aria-label={`${featured.title} technology stack`}>
        {featured.stack.map((tag) => (
          <li key={`${featured.slug}-${tag}`} className="tag">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-6 border-t border-(--color-border) pt-7 text-xs tracking-[0.16em] uppercase">
        {featured.demoUrl ? (
          <a
            href={featured.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-reveal text-text-secondary inline-flex items-center gap-1 font-mono"
          >
            <span>Live demo</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        {featured.githubUrl ? (
          <a
            href={featured.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-reveal text-text-secondary inline-flex items-center gap-1 font-mono"
          >
            <span>GitHub</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        {featured.caseStudy ? (
          <Link
            href={featured.caseStudy}
            className="link-reveal inline-flex items-center gap-1 font-mono text-(--color-accent)"
          >
            <span>Case study</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </m.article>
  );
}

function ProjectGridCard({
  project,
  reducedMotion,
  variant,
}: Readonly<{
  project: Project;
  reducedMotion: boolean;
  variant: (typeof GRID_VARIANTS)[number];
}>) {
  return (
    <m.article
      variants={reducedMotion ? noMotion : variant}
      className="glass glass-medium card-depth flex h-full flex-col overflow-hidden rounded-(--radius-xl) p-8 sm:p-10"
      data-project-id={project.slug}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="label">{project.type}</span>
        <StatusBadge status={project.status} />
      </div>

      <h3 className="mt-6 font-semibold text-white">{project.title}</h3>
      <p className="font-display text-text-secondary mt-3 flex-1 text-base leading-8">
        {project.tagline}
      </p>
      <p className="font-display mt-4 text-base leading-8 text-(--color-text-muted)">
        {project.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-3" aria-label={`${project.title} outcomes`}>
        {project.outcomes.slice(0, 3).map((outcome) => (
          <li
            key={`${project.slug}-${outcome}`}
            className="pill-cyan font-mono text-[11px] tracking-widest uppercase"
          >
            {outcome}
          </li>
        ))}
      </ul>

      <ArchDecision
        chosen={project.chosen}
        over={project.over}
        because={project.because}
        compact={true}
      />

      <ul className="mt-6 flex flex-wrap gap-3" aria-label={`${project.title} technology stack`}>
        {project.stack.map((tag) => (
          <li key={`${project.slug}-${tag}`} className="tag">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap gap-4 border-t border-(--color-border) pt-6 text-xs tracking-[0.16em] uppercase">
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-reveal text-text-secondary inline-flex items-center gap-1 font-mono"
          >
            <span>Live demo</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-reveal inline-flex items-center gap-1 font-mono text-(--color-text-muted)"
          >
            <span>GitHub</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        {project.caseStudy ? (
          <Link
            href={project.caseStudy}
            className="link-reveal inline-flex items-center gap-1 font-mono text-(--color-accent)"
          >
            <span>Case study</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </m.article>
  );
}

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reducedMotion = useReducedMotion();
  const featured = PROJECTS[0];
  const grid = PROJECTS.slice(1);

  const featuredReveal = reducedMotion ? noMotion : FEATURED_VARIANT;
  const header = reducedMotion ? noMotion : fadeRise;
  const container = useMemo(() => staggerContainer(0.12, 0.05), []);
  const headingContainer = useMemo(() => staggerContainer(0.08), []);

  if (!featured) {
    return null;
  }

  return (
    <section
      id="section-projects"
      ref={ref}
      aria-labelledby="projects-heading"
      className="py-28 sm:py-32"
    >
      <div className="container">
        <m.div
          variants={headingContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-16 max-w-4xl"
        >
          <m.div variants={header} className="section-kicker-row">
            <span className="section-number" aria-hidden="true">
              01
            </span>
            <span className="section-label">SELECTED WORK</span>
          </m.div>
          <m.h2 variants={header} id="projects-heading" className="gradient-text mt-(--space-2)">
            Fullstack systems that shipped
          </m.h2>
          <m.p
            variants={header}
            className="font-display text-text-secondary mt-5 max-w-[62ch] text-(length:--text-xl) leading-[1.8]"
          >
            Product interfaces, backend platforms, and production operations delivered as one
            system. Each case study includes decision rationale, constraints, and measurable
            outcomes.
          </m.p>
        </m.div>

        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <FeaturedProjectCard
            featured={featured}
            reducedMotion={Boolean(reducedMotion)}
            variant={featuredReveal}
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {grid.map((project, index) => (
              <ProjectGridCard
                key={project.slug}
                project={project}
                reducedMotion={Boolean(reducedMotion)}
                variant={GRID_VARIANTS[index % 2]}
              />
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
