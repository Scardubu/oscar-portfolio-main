import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/ProjectCard';

const layoutClasses = ['bento-featured', 'bento-side', 'bento-full'] as const;

export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-20 sm:py-24">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <span className="label" data-reveal="" data-reveal-delay="1">
            Selected work
          </span>
          <h2
            id="projects-heading"
            className="mt-[var(--space-2)] text-white"
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={`${project.id}${project.status}`}
              className={layoutClasses[index] ?? 'bento-full'}
            >
              <ProjectCard project={project} revealDelay={String(index + 2)} />
            </div>
          ))}
        </div>

        <p
          className="mt-[var(--space-8)] text-sm text-[color:var(--color-text-muted)]"
          data-reveal=""
          data-reveal-delay="4"
        >
          Each system ships with architecture decisions, a live demo, and a monitored production
          deployment.
        </p>
      </div>
    </section>
  );
}
