import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/ProjectCard';

const layoutClasses = ['bento-featured', 'bento-side', 'bento-full'] as const;

export function ProjectsSection() {
  const liveCount = projects.filter((project) => project.status === 'live').length;
  const wipCount = projects.filter((project) => project.status === 'wip').length;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-20 sm:py-24">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <span className="label" data-reveal="">
            Production Systems
          </span>
          <h2
            id="projects-heading"
            className="text-4xl text-white sm:text-5xl"
            data-reveal=""
            data-reveal-delay="1"
          >
            Systems where model logic, infrastructure choices, and product tradeoffs stay visible.
          </h2>
          <p className="mt-4 text-lg text-white/65" data-reveal="" data-reveal-delay="2">
            Live product work, active build tracks, and delivery patterns shaped by production
            constraints rather than lab conditions.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/70" data-reveal="" data-reveal-delay="3">
            <span className="pill pill-cyan">{projects.length} documented systems</span>
            <span className="pill">{liveCount} live deployments</span>
            {wipCount > 0 ? <span className="pill">{wipCount} active build track</span> : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={`${project.id}${project.status}`}
              className={layoutClasses[index] ?? 'bento-full'}
              data-reveal=""
              data-reveal-delay={String(index + 1)}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-white/55" data-reveal="" data-reveal-delay="4">
          Each system includes architecture decisions, production context, and a direct path into its case study.
        </p>
      </div>
    </section>
  );
}
