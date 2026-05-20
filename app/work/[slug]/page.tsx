// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Mobile-native case study. Sidebar rendered below content on mobile (<xl).
// Lagos, Nigeria → Global.
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchDecision } from '@/components/ArchDecision';
import { ReadingProgress } from '@/components/ReadingProgress';
import { anchorUrl } from '@/lib/config';
import { getWorkCase, getWorkCases } from '@/lib/content';
import { getProject, PROJECTS, type Project } from '@/lib/projects';

type WorkPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

function getProjectStatusLabel(status?: Project['status']) {
  switch (status) {
    case 'live':
      return 'Live deployment';
    case 'wip':
      return 'Active build';
    case 'case-study':
      return 'Case study';
    default:
      return 'Case study';
  }
}

function getCompactProjectStatusLabel(status: Project['status']) {
  switch (status) {
    case 'live':
      return 'Live';
    case 'wip':
      return 'WIP';
    case 'case-study':
      return 'Case study';
    default:
      return 'Case study';
  }
}

function RelatedCaseStudies({ entries }: Readonly<{ entries: Project[] }>) {
  if (!entries.length) return null;

  return (
    <aside
      aria-labelledby="related-case-studies-heading"
      className="mb-[var(--space-20)] rounded-[var(--radius-xl)] border border-white/10 p-5 sm:p-6"
    >
      <span className="label">More work</span>
      <h2 id="related-case-studies-heading" className="mt-[var(--space-2)]">
        Other case studies
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <article
            key={entry.slug}
            className="rounded-[var(--radius-lg)] border border-white/10 p-4 sm:p-5"
          >
            <div className="flex flex-wrap gap-2">
              <span className="pill">{getCompactProjectStatusLabel(entry.status)}</span>
              {entry.stack.slice(0, 2).map((tag) => (
                <span key={`${entry.slug}-${tag}`} className="pill">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="mt-4 text-white">{entry.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/65">{entry.tagline}</p>
            <Link
              href={`/work/${entry.slug}`}
              className="text-color-film-teal mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm transition hover:text-white"
            >
              Read case study →
            </Link>
          </article>
        ))}
      </div>
    </aside>
  );
}

function ProjectLinksCard({
  demoUrl,
  githubUrl,
}: Readonly<{ demoUrl?: string; githubUrl?: string }>) {
  if (!demoUrl && !githubUrl) return null;

  return (
    <div className="rounded-[var(--radius-xl)] border border-white/10 p-5">
      <span className="label">Links</span>
      <div className="mt-4 flex flex-col gap-3">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-cyan inline-flex min-h-[48px] items-center justify-center"
          >
            View live demo
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill inline-flex min-h-[48px] items-center justify-center"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}

function StackCard({ tags }: Readonly<{ tags: readonly string[] }>) {
  if (!tags.length) return null;
  return (
    <div className="rounded-[var(--radius-xl)] border border-white/10 p-5">
      <span className="label">Stack</span>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="pill">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SnapshotCard({ statusLabel }: Readonly<{ statusLabel: string }>) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-white/10 p-5">
      <span className="label">Snapshot</span>
      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          <p className="text-color-text-muted text-xs tracking-[0.14em] uppercase">Status</p>
          <p className="text-color-text-secondary text-sm">{statusLabel}</p>
        </div>
        <div className="space-y-1">
          <p className="text-color-text-muted text-xs tracking-[0.14em] uppercase">Surface</p>
          <p className="text-color-text-secondary text-sm">Case study and architecture review</p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const cases = await getWorkCases();
  return cases.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getWorkCase(slug);
  const meta = getProject(slug);

  if (!project) return { title: 'Work' };

  return {
    title: meta?.title ?? project.frontmatter.title,
    description: meta?.tagline ?? project.frontmatter.summary,
    alternates: { canonical: `https://www.scardubu.dev/work/${slug}` },
    openGraph: {
      title: `${meta?.title ?? project.frontmatter.title} · Oscar Ndugbu`,
      description: meta?.tagline ?? project.frontmatter.summary,
      url: `https://www.scardubu.dev/work/${slug}`,
      images: [`/work/${slug}/og`],
    },
  };
}

function caseStudyJsonLd(title: string, description: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: title,
    description,
    url: `https://www.scardubu.dev/work/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Oscar Ndugbu',
      url: 'https://www.scardubu.dev',
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = await getWorkCase(slug);

  if (!project) notFound();

  const projectMeta = getProject(slug);
  const relatedProjects = PROJECTS.filter((e) => e.slug !== slug).slice(0, 2);
  const title = projectMeta?.title ?? project.frontmatter.title;
  const description = projectMeta?.tagline ?? project.frontmatter.summary;
  const tags = projectMeta?.stack ?? project.frontmatter.tags ?? [];
  const statusLabel = getProjectStatusLabel(projectMeta?.status);

  return (
    <>
      <ReadingProgress />
      <main id="main-content" tabIndex={-1}>
        <section className="relative overflow-hidden pt-[calc(var(--nav-height)+var(--space-12))]">
          <div aria-hidden="true" className="work-surface-glow" />

          <div className="relative container">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(caseStudyJsonLd(title, description, slug)),
              }}
            />

            {/* Back link — top thumb zone */}
            <Link
              href={anchorUrl('section-projects')}
              className="pill pill-cyan inline-flex min-h-[44px] items-center"
            >
              ← Projects
            </Link>

            {/*
              Grid:
              - Mobile: single column (content first, sidebar below)
              - xl+: two columns with sticky sidebar
            */}
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-10">
              {/* Main content column */}
              <div className="min-w-0">
                <header className="mt-[var(--space-8)] mb-[var(--space-10)] max-w-[60ch]">
                  <span className="label">Case Study</span>
                  <h1 className="mt-[var(--space-2)]">{title}</h1>
                  <p className="text-color-text-secondary mt-[var(--space-4)] text-base leading-8 sm:text-lg">
                    {description}
                  </p>
                  {projectMeta && (
                    <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
                      <span className="pill pill-cyan">{statusLabel}</span>
                      {projectMeta.status === 'live' && (
                        <span className="pill">Featured system</span>
                      )}
                    </div>
                  )}
                </header>

                {/* Architecture decision — elevated above prose */}
                {projectMeta && (
                  <div className="mb-8">
                    <ArchDecision
                      chosen={projectMeta.chosen}
                      over={projectMeta.over}
                      because={projectMeta.because}
                    />
                  </div>
                )}

                {/* MDX prose */}
                <article className="prose max-w-none pb-[var(--space-20)]">
                  {project.content}
                </article>

                <RelatedCaseStudies entries={relatedProjects} />
              </div>

              {/* Sidebar: sticky on xl+, inline on mobile */}
              <aside className="space-y-4 xl:sticky xl:top-[calc(var(--nav-height)+var(--space-8))]">
                <SnapshotCard statusLabel={statusLabel} />
                <StackCard tags={tags} />
                <ProjectLinksCard
                  demoUrl={projectMeta?.demoUrl}
                  githubUrl={projectMeta?.githubUrl}
                />

                {/* Back CTA: always visible on mobile, at natural thumb zone */}
                <Link
                  href={anchorUrl('section-projects')}
                  className="pill pill-cyan inline-flex min-h-[48px] w-full items-center justify-center"
                >
                  ← Back to projects
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
