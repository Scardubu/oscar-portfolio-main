'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { ArchDecision } from '@/components/ArchDecision';
import { PROJECTS, type Project } from '@/lib/projects';
import { cardReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

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

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reducedMotion = useReducedMotion();
  const featured = PROJECTS[0];
  const grid = PROJECTS.slice(1);

  const featuredReveal = useMemo(() => (reducedMotion ? noMotion : cardReveal(24)), [reducedMotion]);
  const header = reducedMotion ? noMotion : fadeRise;
  const container = useMemo(() => staggerContainer(0.12, 0.05), []);
  const headingContainer = useMemo(() => staggerContainer(0.08), []);

  if (!featured) {
    return null;
  }

  return (
    <section id="projects" ref={ref} aria-labelledby="projects-heading" className="py-24 sm:py-28">
      <div className="container">
        <motion.div
          variants={headingContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-16 max-w-4xl"
        >
          <motion.span variants={header} className="label">
            Selected Work
          </motion.span>
          <motion.h2
            variants={header}
            id="projects-heading"
            className="gradient-text mt-[var(--space-2)]"
          >
            Work that shipped
          </motion.h2>
          <motion.p
            variants={header}
            className="mt-5 max-w-[62ch] text-[length:var(--text-xl)] leading-[1.8] text-white/65"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            End-to-end AI and fintech systems. Each ships with documented architecture decisions and
            a monitored production deployment.
          </motion.p>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        <motion.article
          variants={featuredReveal}
          className="glass glass-full glass-chromatic card-depth mb-8 overflow-hidden rounded-[var(--radius-xl)] p-8 sm:p-10 lg:p-12"
          data-project-id={featured.slug}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="label">{featured.type}</span>
            <StatusBadge status={featured.status} />
          </div>

          <h3 className="mt-6 text-[clamp(2rem,2vw+1rem,2.8rem)] text-white">{featured.title}</h3>
          <p className="mt-4 max-w-[58ch] text-[length:var(--text-xl)] leading-[1.7] text-white/75" style={{ fontFamily: 'var(--font-display)' }}>
            {featured.tagline}
          </p>
          <p className="mt-6 max-w-[72ch] text-base leading-8 text-white/65" style={{ fontFamily: 'var(--font-display)' }}>
            {featured.description}
          </p>

          <ArchDecision
            chosen={featured.chosen}
            over={featured.over}
            because={featured.because}
            compact={false}
          />

          <p className="mt-6 max-w-[72ch] text-sm italic text-[color:var(--color-text-muted)]" style={{ fontFamily: 'var(--font-display)' }}>
            Constraint: {featured.constraint}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2.5" aria-label={`${featured.title} technology stack`}>
            {featured.stack.map((tag) => (
              <li key={`${featured.slug}-${tag}`} className="tag">
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-[color:var(--color-border)] pt-7 text-xs uppercase tracking-[0.16em]">
            {featured.demoUrl ? (
              <a
                href={featured.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-reveal inline-flex items-center gap-1 font-mono text-[color:var(--color-text-secondary)]"
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
                className="link-reveal inline-flex items-center gap-1 font-mono text-[color:var(--color-text-secondary)]"
              >
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
            {featured.caseStudy ? (
              <Link
                href={featured.caseStudy}
                className="link-reveal inline-flex items-center gap-1 font-mono text-[color:var(--color-accent)]"
              >
                <span>Case study</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </motion.article>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {grid.map((project, index) => (
            <motion.article
              key={project.slug}
              variants={reducedMotion ? noMotion : cardReveal(index % 2 === 0 ? 24 : -24)}
              className="glass glass-medium card-depth flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] p-8 sm:p-9"
              data-project-id={project.slug}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="label">{project.type}</span>
                <StatusBadge status={project.status} />
              </div>

              <h3 className="mt-6 text-white">{project.title}</h3>
              <p className="mt-3 flex-1 text-base leading-8 text-white/75" style={{ fontFamily: 'var(--font-display)' }}>{project.tagline}</p>
              <p className="mt-4 text-base leading-8 text-[color:var(--color-text-muted)]" style={{ fontFamily: 'var(--font-display)' }}>
                {project.description}
              </p>

              <ArchDecision
                chosen={project.chosen}
                over={project.over}
                because={project.because}
                compact={true}
              />

              <ul className="mt-6 flex flex-wrap gap-2.5" aria-label={`${project.title} technology stack`}>
                {project.stack.map((tag) => (
                  <li key={`${project.slug}-${tag}`} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-4 border-t border-[color:var(--color-border)] pt-6 text-xs uppercase tracking-[0.16em]">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-reveal inline-flex items-center gap-1 font-mono text-[color:var(--color-text-secondary)]"
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
                    className="link-reveal inline-flex items-center gap-1 font-mono text-[color:var(--color-text-muted)]"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : null}
                {project.caseStudy ? (
                  <Link
                    href={project.caseStudy}
                    className="link-reveal inline-flex items-center gap-1 font-mono text-[color:var(--color-text-muted)]"
                  >
                    <span>Case study</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
        </motion.div>
      </div>
    </section>
  );
}
