'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';

import type { WorkProject } from '@/app/lib/homepage';

interface BentoActiveGridProps {
  projects: WorkProject[];
}

export function BentoActiveGrid({ projects }: BentoActiveGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="bento-dense grid gap-[var(--bento-gap)] lg:grid-cols-12">
      {projects.map((project, index) => (
        <motion.article
          key={project.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: index * 0.08 }}
          whileHover={reduceMotion ? undefined : { y: -6 }}
          className={`group bento-cell ${index === 0 ? 'bento-cell--wide lg:col-span-7' : 'bento-cell--span-2 lg:col-span-5'}`}
        >
          <div className="metric-card-glass glass-surface glass-surface-light flex h-full flex-col gap-5 rounded-[1.75rem] p-6 transition-[box-shadow,transform] duration-200 group-hover:[--glass-refraction-scale:1.1] md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs tracking-[0.24em] text-[var(--accent-primary)] uppercase">
                  {project.category}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-balance text-[var(--text-primary)] md:text-3xl">
                  {project.title}
                </h3>
              </div>
              <Link
                href={`/work/${project.slug}`}
                className="focus-ring-branded inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[var(--text-primary)]"
                aria-label={`Open ${project.title} case study`}
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="text-sm leading-7 text-pretty text-[var(--text-secondary)] md:text-base">
              {project.oneLiner}
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs tracking-[0.22em] text-[var(--text-muted)] uppercase">
                  Context
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {project.context}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs tracking-[0.22em] text-[var(--text-muted)] uppercase">
                  Approach
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {project.approach}
                </p>
              </div>
            </div>

            <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-[16rem] group-hover:opacity-100 motion-reduce:max-h-none motion-reduce:opacity-100">
              <div className="grid gap-3 md:grid-cols-2">
                {project.decisions.map((decision) => (
                  <div
                    key={`${project.slug}-${decision.label}`}
                    className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <p className="text-xs tracking-[0.22em] text-[var(--accent-primary)] uppercase">
                      {decision.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {decision.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={`${project.slug}-${item}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring-branded inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent-primary)] px-4 text-sm font-semibold text-black"
              >
                Live surface
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring-branded inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 text-sm font-semibold text-[var(--text-primary)]"
              >
                GitHub
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
