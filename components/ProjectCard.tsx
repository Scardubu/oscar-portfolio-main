'use client';

import { m } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import type { Project, ProjectStatus } from '@/data/projects';
import { GlassCard } from '@/components/GlassCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { springConfig } from '@/lib/motion';

const statusStyles: Record<
  ProjectStatus,
  { className: string; dotClassName: string; label: string }
> = {
  live: {
    className: 'pill pill-cyan',
    dotClassName: 'live-dot bg-cyan-400',
    label: 'LIVE',
  },
  wip: {
    className:
      'inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-400',
    dotClassName: 'bg-amber-400',
    label: 'WIP',
  },
  archived: {
    className:
      'inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500',
    dotClassName: 'bg-zinc-500',
    label: 'ARCHIVED',
  },
};

interface ProjectCardProps {
  project: Project;
  revealDelay?: string;
}

function ProjectStatusBadge({ status }: Readonly<{ status: ProjectStatus }>) {
  const badge = statusStyles[status];

  return (
    <span className={badge.className}>
      <span className={`h-2.5 w-2.5 rounded-full ${badge.dotClassName}`} aria-hidden="true" />
      {badge.label}
    </span>
  );
}

function ProjectDecisionPanel({
  projectId,
  decisions,
  expanded,
  prefersReducedMotion,
  onToggle,
}: Readonly<{
  projectId: string;
  decisions: NonNullable<Project['decisions']>;
  expanded: boolean;
  prefersReducedMotion: boolean;
  onToggle: () => void;
}>) {
  const detailsId = `project-decisions-${projectId}`;

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 px-4 py-2 text-xs font-medium tracking-[0.2em] text-cyan-100 uppercase transition hover:border-cyan-300/45 hover:text-white"
        onClick={onToggle}
      >
        Architecture decisions
      </button>

      <m.div
        id={detailsId}
        initial={false}
        animate={
          prefersReducedMotion
            ? { opacity: expanded ? 1 : 0 }
            : { opacity: expanded ? 1 : 0, height: expanded ? 'auto' : 0 }
        }
        transition={springConfig}
        className="overflow-hidden"
        aria-hidden={!expanded}
      >
        <div className="space-y-3 border-l border-cyan-400/40 pt-1 pl-4">
          {decisions.map((decision) => (
            <div key={`${projectId}-${decision.rejected}`} className="space-y-1">
              <p className="text-sm leading-7 text-white/75">
                <span className="font-semibold text-cyan-100">Chose:</span> {decision.chosen}
              </p>
              <p className="text-sm leading-7 text-white/55">
                <span className="font-semibold text-white/72">Over:</span> {decision.rejected}
              </p>
              <p className="text-sm leading-7 text-white/62">
                <span className="font-semibold text-white/72">Because:</span> {decision.reason}
              </p>
            </div>
          ))}
        </div>
      </m.div>
    </div>
  );
}

function ProjectLinks({
  demoUrl,
  repoUrl,
  projectId,
}: Readonly<{
  demoUrl?: string;
  repoUrl?: string;
  projectId: string;
}>) {
  return (
    <div className="flex flex-wrap gap-3 text-sm text-white/80">
      {demoUrl ? (
        <Link
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 transition hover:border-white/30 hover:text-white"
        >
          Live demo
        </Link>
      ) : null}
      {repoUrl ? (
        <Link
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 transition hover:border-white/30 hover:text-white"
        >
          GitHub
        </Link>
      ) : null}
      <Link
        href={`/work/${projectId}`}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 px-4 py-2 text-cyan-200 transition hover:border-cyan-300/50 hover:text-white"
      >
        Case study →
      </Link>
    </div>
  );
}

function getCardLevel(project: Project) {
  if (project.featured) {
    return 'full' as const;
  }

  return project.status === 'live' ? ('light' as const) : ('medium' as const);
}

export function ProjectCard({ project, revealDelay = '2' }: Readonly<ProjectCardProps>) {
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const level = getCardLevel(project);

  return (
    <div className="h-full">
      <GlassCard
        as="article"
        className="card-depth flex h-full flex-col gap-4 p-6"
        chromatic={project.featured}
        level={level}
        data-project-id={project.id}
        data-reveal=""
        data-reveal-delay={revealDelay}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.24em] text-white/50 uppercase">
              {project.featured ? 'Featured system' : 'Production track'}
            </p>
            <h3 className="mt-3 text-2xl text-white">{project.title}</h3>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        <p className="text-base text-white/80">{project.tagline}</p>
        <p className="flex-1 text-sm leading-7 text-white/65">{project.description}</p>
        {project.context ? (
          <p className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-7 text-white/60">
            {project.context}
          </p>
        ) : null}

        <ul className="flex flex-wrap gap-2" aria-label={`${project.title} technology stack`}>
          {project.tags.map((tag) => (
            <li
              key={`${project.id}-${tag}`}
              className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs tracking-[0.16em] text-white/75 uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>

        {project.decisions?.length ? (
          <ProjectDecisionPanel
            projectId={project.id}
            decisions={project.decisions}
            expanded={expanded}
            prefersReducedMotion={prefersReducedMotion}
            onToggle={() => setExpanded((current) => !current)}
          />
        ) : null}

        <ProjectLinks demoUrl={project.demoUrl} repoUrl={project.repoUrl} projectId={project.id} />
      </GlassCard>
    </div>
  );
}
