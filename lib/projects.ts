import { projects, type Project as SourceProject, type ProjectStatus } from '@/data/projects';

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly status: Exclude<ProjectStatus, 'archived'> | 'archived';
  readonly type: string;
  readonly description: string;
  readonly constraint: string;
  readonly stack: readonly string[];
  readonly pipeline: readonly string[];
  readonly chosen: string;
  readonly over: string;
  readonly because: string;
  readonly demoUrl?: string;
  readonly githubUrl?: string;
  readonly caseStudy?: string;
  readonly ogImage?: string;
}

function inferType(project: SourceProject): string {
  if (project.featured) {
    return 'FEATURED SYSTEM';
  }

  if (project.status === 'live') {
    return 'PRODUCTION SYSTEM';
  }

  if (project.status === 'archived') {
    return 'ARCHIVED SYSTEM';
  }

  return 'ACTIVE BUILD';
}

function inferConstraint(project: SourceProject): string {
  return project.context ?? project.description;
}

function inferPipeline(project: SourceProject): readonly string[] {
  const pipelineMap: Record<string, readonly string[]> = {
    sabiscore: ['Feature Engineering', 'Ensemble Scoring', 'FastAPI', 'Redis Cache', 'Next.js UI'],
    hashablanca: ['On-chain Events', 'Kafka Stream', 'dbt Models', 'Analytics API', 'React UI'],
    'ml-consulting': ['Discovery', 'Architecture Review', 'Delivery Plan', 'Implementation', 'Handover'],
  };

  return pipelineMap[project.id] ?? project.tags;
}

function inferDecision(project: SourceProject) {
  const firstDecision = project.decisions?.[0];

  return {
    chosen: firstDecision?.chosen ?? 'Pragmatic production architecture',
    over: firstDecision?.rejected ?? 'Overbuilt implementation complexity',
    because: firstDecision?.reason ?? 'Delivery quality and operational clarity had to hold simultaneously.',
  };
}

export const PROJECTS: readonly Project[] = projects.map((project) => {
  const decision = inferDecision(project);

  return {
    slug: project.id,
    title: project.title,
    tagline: project.tagline,
    status: project.status,
    type: inferType(project),
    description: project.description,
    constraint: inferConstraint(project),
    stack: project.tags,
    pipeline: inferPipeline(project),
    chosen: decision.chosen,
    over: decision.over,
    because: decision.because,
    demoUrl: project.demoUrl,
    githubUrl: project.repoUrl,
    caseStudy: `/work/${project.id}`,
    ogImage: `/work/${project.id}/og`,
  };
});

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}