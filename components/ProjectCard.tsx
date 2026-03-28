'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useId, useState } from 'react';
import type { Project, ProjectStatus } from '@/data/projects';
import { GlassCard } from '@/components/GlassCard';

const statusStyles: Record<ProjectStatus, { dot: string; label: string }> = {
  live: { dot: 'bg-cyan-400', label: 'Live' },
  wip: { dot: 'bg-amber-400', label: 'WIP' },
  archived: { dot: 'bg-zinc-400', label: 'Archived' },
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusStyles[project.status];
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const detailsId = useId();

  return (
    <div data-project-id={project.id} className="h-full">
      <GlassCard
        as="article"
        className="card-depth flex h-full flex-col gap-4 p-6"
        chromatic={project.featured}
        level={project.featured ? 'full' : project.status === 'live' ? 'light' : 'medium'}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/50">
              {project.featured ? 'Featured system' : 'Production track'}
            </p>
            <h3 className="mt-3 text-2xl text-white">{project.title}</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
            <span
              className={`h-2.5 w-2.5 rounded-full ${status.dot} ${project.status === 'live' ? 'live-dot' : ''}`}
              aria-hidden="true"
            />
            {status.label}
          </span>
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
              className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-white/75"
            >
              {tag}
            </li>
          ))}
        </ul>

        {project.decisions?.length ? (
          <div className="space-y-3">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={detailsId}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-300/45 hover:text-white"
              onClick={() => setExpanded((current) => !current)}
            >
              Architecture decisions
            </button>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  id={detailsId}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 border-l border-cyan-400/40 pl-4">
                    {project.decisions.map((decision) => (
                      <div key={`${project.id}-${decision.rejected}`} className="space-y-1">
                        <p className="text-sm leading-7 text-white/75">
                          <span className="font-semibold text-cyan-100">Key Decision:</span>{' '}
                          {decision.chosen}
                        </p>
                        <p className="text-sm leading-7 text-white/62">{decision.reason}</p>
                        <p className="text-sm leading-7 text-white/55">
                          <span className="font-semibold text-white/72">Rejected:</span>{' '}
                          {decision.rejected}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 text-sm text-white/80">
          {project.demoUrl ? (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 transition hover:border-white/30 hover:text-white"
            >
              Live demo
            </Link>
          ) : null}
          {project.repoUrl ? (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 transition hover:border-white/30 hover:text-white"
            >
              Source
            </Link>
          ) : null}
          <Link
            href={`/work/${project.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 px-4 py-2 text-cyan-200 transition hover:border-cyan-300/50 hover:text-white"
          >
            Case study \u2192
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
