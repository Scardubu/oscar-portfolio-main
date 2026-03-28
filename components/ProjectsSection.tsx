import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/ProjectCard';

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 sm:py-24">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <span className="label" data-reveal="">
            Production Systems
          </span>
          <h2 className="text-4xl text-white sm:text-5xl" data-reveal="" data-reveal-delay="1">
            Systems where model logic, infrastructure choices, and product tradeoffs stay visible.
          </h2>
          <p className="mt-4 text-lg text-white/65" data-reveal="" data-reveal-delay="2">
            Live product work, active build tracks, and delivery patterns shaped by production
            constraints rather than lab conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bento-featured" data-reveal="" data-reveal-delay="1">
            <ProjectCard key={`${projects[0].id}${projects[0].status}`} project={projects[0]} />
          </div>
          <div className="bento-side" data-reveal="" data-reveal-delay="2">
            <ProjectCard key={`${projects[1].id}${projects[1].status}`} project={projects[1]} />
          </div>
          <div className="bento-full" data-reveal="" data-reveal-delay="3">
            <ProjectCard key={`${projects[2].id}${projects[2].status}`} project={projects[2]} />
          </div>
        </div>

        <p className="mt-6 text-sm text-white/55" data-reveal="" data-reveal-delay="4">
          Each system ships with architecture decisions, a live demo, and monitored production deployment.
        </p>
      </div>
    </section>
  );
}
