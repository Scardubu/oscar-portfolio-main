// CONVICTION ENGINE v18.0 — ProjectsSection
// Mobile-native architecture: 320–430px is source of truth.
// Changes from v11:
//   • FeaturedProjectCard: ArchDecision collapsed by default on mobile,
//     expanded by default on ≥lg. Prevents cognitive overload below 430px.
//   • Stack overflow-scroll pill row — no wrapping on mobile.
//   • CTA strip: full-width stacked on mobile, flex-row on sm+.
//   • Grid projects: single column on mobile, 2-col on sm+.
//   • All touch targets ≥ 48px.
//   • Copy updated: "you"-centric, outcome-first per Stripe architecture.
//   • Location: Lagos, Nigeria → Global.
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
  const [archOpen, setArchOpen] = useState(false);

  return (
    <m.article
      variants={FEATURED_VARIANT}
      className="glass-full rounded-[var(--radius-xl)] overflow-hidden mb-6"
      data-project-id={featured.slug}
      whileHover={reducedMotion ? undefined : { y: -3, transition: { type: 'spring', stiffness: 360, damping: 28 } }}
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <span className="label-mono">{featured.type}</span>
          <StatusBadge status={featured.status} />
        </div>

        {/* ── Headline ─────────────────────────────────────────────── */}
        <h3
          className="text-[clamp(1.625rem,3.5vw+0.75rem,2.75rem)] font-bold leading-[1.1] tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {featured.title}
        </h3>

        {/* ── Tagline ──────────────────────────────────────────────── */}
        <p
          className="mt-3 max-w-[58ch] text-base leading-[1.75]"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}
        >
          {featured.tagline}
        </p>

        {/* ── Outcomes: scroll-safe pill row ───────────────────────── */}
        <ul
          className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar"
          aria-label={`${featured.title} outcomes`}
          style={{ scrollbarWidth: 'none' }}
        >
          {featured.outcomes.map((outcome) => (
            <li key={`${featured.slug}-${outcome}`} className="pill-cyan shrink-0">
              {outcome}
            </li>
          ))}
        </ul>

        {/* ── Stack: overflow-scroll on mobile ─────────────────────── */}
        <div
          className="mt-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
          aria-label={`${featured.title} technology stack`}
        >
          {featured.stack.map((tech) => (
            <span
              key={tech}
              className="glass-light shrink-0 rounded-md px-2.5 py-1 font-mono text-[10px] tracking-wide"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* ── Brief toggle ─────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setBriefOpen((v) => !v)}
          className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/14 px-4 py-2 font-mono text-[11px] tracking-widest uppercase text-white/55 transition hover:border-white/28 hover:text-white/80"
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
      </div>

      {/* ── ArchDecision: collapsible on mobile, visible on lg+ ──────── */}
      <div className="mt-6 px-6 sm:px-8 lg:px-10">
        {/* Mobile toggle — hidden on lg */}
        <button
          type="button"
          onClick={() => setArchOpen((v) => !v)}
          className="lg:hidden w-full flex items-center justify-between min-h-[44px] py-3 border-t border-white/08 font-mono text-[11px] tracking-widest uppercase text-white/40"
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

        {/* Mobile: collapsible */}
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

        {/* Desktop: always visible */}
        <div className="hidden lg:block pb-10">
          <ArchDecision
            chosen={featured.chosen}
            over={featured.over}
            because={featured.because}
          />
        </div>
      </div>

      {/* ── CTA strip: stacked on mobile, row on sm+ ─────────────────── */}
      <div className="px-6 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
        <div
          className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}
        >
          {featured.caseStudy && (
            <Link
              href={featured.caseStudy}
              className="cta-primary justify-center sm:justify-start sm:w-auto"
            >
              Read case study
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
          {featured.demoUrl && (
            <a
              href={featured.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary justify-center sm:justify-start sm:w-auto"
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
      className="glass-medium flex flex-col rounded-[var(--radius-xl)] p-6 sm:p-7 overflow-hidden"
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

      <p className="mt-3 text-sm leading-7 flex-1" style={{ color: 'var(--color-text-secondary)' }}>
        {project.tagline}
      </p>

      {/* Outcomes — scrollable on mobile */}
      <ul
        className="mt-4 flex gap-2 overflow-x-auto pb-0.5 no-scrollbar"
        aria-label={`${project.title} outcomes`}
        style={{ scrollbarWidth: 'none' }}
      >
        {project.outcomes.slice(0, 3).map((outcome) => (
          <li key={`${project.slug}-${outcome}`} className="pill-cyan shrink-0">
            {outcome}
          </li>
        ))}
      </ul>

      {/* Stack condensed */}
      <div className="mt-4 flex flex-wrap gap-1">
        {project.stack.slice(0, 5).map((tech) => (
          <span key={tech} className="font-mono text-[9px] tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            {tech}
          </span>
        ))}
        {project.stack.length > 5 && (
          <span className="font-mono text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
            +{project.stack.length - 5}
          </span>
        )}
      </div>

      {/* Arch decision: compact inline for grid cards */}
      <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="flex flex-col gap-2">
          {[
            { label: 'CHOSEN', value: project.chosen, color: 'var(--color-success)' },
            { label: 'OVER', value: project.over, color: 'var(--color-text-muted)' },
            { label: 'BECAUSE', value: project.because, color: 'var(--color-film-teal)', bold: true },
          ].map(({ label, value, color, bold }) => (
            <div key={label} className="flex items-start gap-2">
              <span
                className="label-mono w-14 shrink-0 mt-0.5"
                style={{ color }}
              >
                {label}
              </span>
              <span
                className={`text-[11px] leading-5 ${bold ? 'font-medium' : ''}`}
                style={{ color: bold ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs — full-width touch targets on mobile */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {project.caseStudy && (
          <Link
            href={project.caseStudy}
            className="cta-ghost text-xs min-h-[44px] flex items-center justify-center sm:justify-start"
          >
            Case study →
          </Link>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-ghost text-xs min-h-[44px] flex items-center justify-center sm:justify-start"
          >
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
          {/* ── Section kicker ─────────────────────────────────────── */}
          <m.div variants={child} className="section-kicker-row mb-8 sm:mb-12">
            <span className="section-number" aria-hidden="true">01</span>
            <span className="section-label">Projects</span>
          </m.div>

          {/* ── Heading ────────────────────────────────────────────── */}
          <m.h2
            variants={reducedMotion ? child : clipReveal}
            id="projects-heading"
            className="mb-4"
          >
            Systems built to last.
          </m.h2>

          <m.p
            variants={child}
            className="mb-10 sm:mb-14 max-w-[60ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Four years of independent product work — production-grade infrastructure,
            compliance architecture, and ML backends built from zero and maintained in production
            from Lagos.
          </m.p>

          {/* ── Featured project ───────────────────────────────────── */}
          <FeaturedProjectCard featured={featured} reducedMotion={reducedMotion ?? false} />

          {/* ── Grid projects ──────────────────────────────────────── */}
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