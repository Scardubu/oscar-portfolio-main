import Link from 'next/link';
 
import { ArchDecision } from '@/components/ArchDecision';
import { PROJECTS, type Project } from '@/lib/projects';

function StatusBadge({ status }: Readonly<{ status: Project['status'] }>) {
  if (status === 'archived') {
    return <span className="pill">ARCHIVED</span>;
  }

  return (
    <span className={status === 'live' ? 'badge-live' : 'badge-wip'}>
      <span className={status === 'live' ? 'dot-live' : 'dot-wip'} aria-hidden="true" />
      {status.toUpperCase()}
    </span>
  );
}

export function ProjectsSection() {
  const featured = PROJECTS[0];
  const grid = PROJECTS.slice(1);

  if (!featured) {
    return null;
  }

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-20 sm:py-24">
      <div className="container">
        <div className="mb-12 max-w-3xl">
          <span className="label" data-reveal="" data-reveal-delay="1">
            Selected work
          </span>
          <h2
            id="projects-heading"
            className="gradient-text mt-[var(--space-2)]"
            data-reveal=""
            data-reveal-delay="1"
          >
            Work that shipped
          </h2>
          <p
            className="mt-4 text-[length:var(--text-lg)] text-white/65"
            data-reveal=""
            data-reveal-delay="1"
          >
            End-to-end AI/fintech systems. Each ships with architecture decisions and a monitored
            production deployment.
          </p>
        </div>

        <article
          className="glass glass-full glass-chromatic card-depth mb-6 overflow-hidden rounded-[var(--radius-xl)] p-8 sm:p-10"
          data-project-id={featured.slug}
          data-reveal=""
          data-reveal-delay="2"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="label">{featured.type}</span>
            <StatusBadge status={featured.status} />
          </div>

          <h3 className="mt-5 text-[length:var(--text-3xl)] text-white">{featured.title}</h3>
          <p className="mt-3 max-w-[64ch] text-[length:var(--text-lg)] text-white/75">
            {featured.tagline}
          </p>
          <p className="mt-5 max-w-[72ch] text-sm leading-7 text-white/65">{featured.description}</p>

          <ArchDecision
            chosen={featured.chosen}
            over={featured.over}
            because={featured.because}
            compact={false}
          />

          <p className="mt-5 max-w-[72ch] text-xs italic text-[color:var(--color-text-muted)]">
            Constraint: {featured.constraint}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${featured.title} technology stack`}>
            {featured.stack.map((tag) => (
              <li key={`${featured.slug}-${tag}`} className="tag">
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-6 border-t border-[color:var(--color-border)] pt-6 text-xs uppercase tracking-[0.16em]">
            {featured.demoUrl ? (
              <a
                href={featured.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-reveal font-mono text-[color:var(--color-text-secondary)]"
              >
                Live demo →
              </a>
            ) : null}
            {featured.githubUrl ? (
              <a
                href={featured.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-reveal font-mono text-[color:var(--color-text-secondary)]"
              >
                GitHub →
              </a>
            ) : null}
            {featured.caseStudy ? (
              <Link
                href={featured.caseStudy}
                className="link-reveal font-mono text-[color:var(--color-accent)]"
              >
                Case study →
              </Link>
            ) : null}
          </div>
        </article>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {grid.map((project, index) => (
            <article
              key={project.slug}
              className="glass glass-medium card-depth flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] p-8"
              data-project-id={project.slug}
              data-reveal=""
              data-reveal-delay={String(index + 3)}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="label">{project.type}</span>
                <StatusBadge status={project.status} />
              </div>

              <h3 className="mt-5 text-white">{project.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-white/75">{project.tagline}</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">
                {project.description}
              </p>

              <ArchDecision
                chosen={project.chosen}
                over={project.over}
                because={project.because}
                compact={true}
              />

              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.title} technology stack`}>
                {project.stack.map((tag) => (
                  <li key={`${project.slug}-${tag}`} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-4 border-t border-[color:var(--color-border)] pt-6 text-xs uppercase tracking-[0.16em]">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-reveal font-mono text-[color:var(--color-text-secondary)]"
                  >
                    Live demo →
                  </a>
                ) : null}
                {project.caseStudy ? (
                  <Link
                    href={project.caseStudy}
                    className="link-reveal font-mono text-[color:var(--color-text-muted)]"
                  >
                    Case study →
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
