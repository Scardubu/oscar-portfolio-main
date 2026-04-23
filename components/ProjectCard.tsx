'use client';

import Link from 'next/link';

import type { Project, ProjectStatus } from '@/data/projects';
import { ArchDecision } from '@/components/ArchDecision';
import { GlassCard } from '@/components/GlassCard';
import { useSpotlight } from '@/hooks/useSpotlight';

const statusStyles: Record<
  ProjectStatus,
  { className: string; dotClassName: string; label: string }
> = {
  live: {
    className: 'badge-live',
    dotClassName: 'dot-live',
    label: 'LIVE',
  },
  wip: {
    className: 'badge-wip',
    dotClassName: 'dot-wip',
    label: 'WIP',
  },
  archived: {
    className:
      'inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 font-mono text-[10px] font-medium tracking-[0.18em] text-zinc-500 uppercase',
    dotClassName: 'bg-zinc-500',
    label: 'ARCHIVED',
  },
};

interface ProjectCardProps {
  project: Project;
  revealDelay?: string;
}

function getProjectTypeLabel(project: Project) {
  if (project.featured) {
    return 'FEATURED SYSTEM';
  }

  return project.status === 'live' ? 'PRODUCTION SYSTEM' : 'ACTIVE BUILD';
}

function ProjectStatusBadge({ status }: Readonly<{ status: ProjectStatus }>) {
  const badge = statusStyles[status];

  return (
    <span className={badge.className}>
      <span
        className={`inline-block h-2 w-2 rounded-full ${badge.dotClassName}`}
        aria-hidden="true"
      />
      {badge.label}
    </span>
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
          className="link-reveal inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase"
        >
          Live demo
        </Link>
      ) : null}
      {repoUrl ? (
        <Link
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-reveal inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase"
        >
          GitHub
        </Link>
      ) : null}
      <Link
        href={`/work/${projectId}`}
        className="link-reveal inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-(--color-accent) uppercase"
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
  const level = getCardLevel(project);
  const primaryDecision = project.decisions?.[0];
  const typeLabel = getProjectTypeLabel(project);
  const { ref, onMouseMove, onMouseLeave, spotlightStyle } = useSpotlight();

  return (
    <div className="h-full" ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <GlassCard
        as="article"
        className={`card-depth flex h-full flex-col gap-4 ${project.featured ? 'p-8' : 'p-6'}`}
        chromatic={project.featured}
        level={level}
        data-project-id={project.id}
        data-reveal=""
        data-reveal-delay={revealDelay}
        style={spotlightStyle}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label text-white/45">{typeLabel}</p>
            <h3 className="mt-3 text-2xl text-white">{project.title}</h3>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        <p className="text-base text-white/80">{project.tagline}</p>
        <p className="flex-1 text-sm leading-7 text-white/65">{project.description}</p>
        {project.context ? (
          <p className="text-sm leading-7 text-white/55 italic">
            <span className="text-white/40">Constraint:</span> {project.context}
          </p>
        ) : null}

        {primaryDecision ? (
          <ArchDecision
            chosen={primaryDecision.chosen}
            over={primaryDecision.rejected}
            because={primaryDecision.reason}
            compact={!project.featured}
          />
        ) : null}

        <ul className="flex flex-wrap gap-2" aria-label={`${project.title} technology stack`}>
          {project.tags.map((tag) => (
            <li key={`${project.id}-${tag}`} className="tag">
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-white/10 pt-5">
          <ProjectLinks
            demoUrl={project.demoUrl}
            repoUrl={project.repoUrl}
            projectId={project.id}
          />
        </div>
      </GlassCard>
    </div>
  );
}
