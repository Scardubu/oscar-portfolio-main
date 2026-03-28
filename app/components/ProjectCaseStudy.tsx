import { ArrowUpRight, Github } from 'lucide-react';

import type { WorkProject } from '@/app/lib/homepage';

interface ProjectCaseStudyProps {
  project: WorkProject;
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-8 pt-10 pb-16 md:gap-10 md:pt-16 md:pb-24">
      <header className="glass-surface glass-surface-heavy rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.24em] text-[var(--accent-primary)] uppercase">
              {project.category}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-[var(--text-primary)] md:text-6xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-pretty text-[var(--text-secondary)] md:text-lg">
              {project.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring-branded inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent-primary)] px-5 text-sm font-semibold text-black"
            >
              Live surface
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring-branded inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-[var(--text-primary)]"
            >
              GitHub
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <section className="grid gap-[var(--bento-gap)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-surface glass-surface-light rounded-[1.5rem] p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <p className="text-xs tracking-[0.22em] text-[var(--accent-primary)] uppercase">
                Context
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                {project.context}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.22em] text-[var(--accent-primary)] uppercase">
                Problem
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                {project.problem}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.22em] text-[var(--accent-primary)] uppercase">
                Approach
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                {project.approach}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-surface glass-surface-light rounded-[1.5rem] p-6 md:p-8">
          <p className="text-xs tracking-[0.22em] text-[var(--accent-primary)] uppercase">
            Outcome
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            {project.outcome}
          </p>

          <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs tracking-[0.22em] text-[var(--text-muted)] uppercase">Evidence</p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {project.evidenceSummary}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={`${project.slug}-${item}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--text-secondary)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-surface glass-surface-light rounded-[1.5rem] p-6 md:p-8">
        <p className="text-xs tracking-[0.22em] text-[var(--accent-primary)] uppercase">
          Key decisions
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {project.decisions.map((decision) => (
            <div
              key={`${project.slug}-${decision.label}`}
              className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
            >
              <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                {decision.label}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                {decision.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
