import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { ReadingProgress } from '@/components/ReadingProgress';
import { projects, type Project, type ProjectStatus } from '@/data/projects';
import { getWorkCase, getWorkCases } from '@/lib/content';

type WorkPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

function getProjectStatusLabel(status?: ProjectStatus) {
  switch (status) {
    case 'live':
      return 'Live deployment';
    case 'wip':
      return 'Active build';
    case 'archived':
      return 'Archived';
    default:
      return 'Case study';
  }
}

function getCompactProjectStatusLabel(status: ProjectStatus) {
  switch (status) {
    case 'live':
      return 'Live';
    case 'wip':
      return 'WIP';
    case 'archived':
      return 'Archived';
    default:
      return 'Case study';
  }
}

function RelatedCaseStudies({ entries }: Readonly<{ entries: Project[] }>) {
  if (!entries.length) {
    return null;
  }

  return (
    <aside
      aria-labelledby="related-case-studies-heading"
      className="glass-no-hover mb-[var(--space-20)] rounded-[var(--radius-xl)] border border-white/10 p-6"
    >
      <span className="label">More work</span>
      <h2 id="related-case-studies-heading" className="mt-[var(--space-2)]">
        Other case studies
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-[var(--radius-lg)] border border-white/10 p-5">
            <div className="flex flex-wrap gap-2">
              <span className="pill">{getCompactProjectStatusLabel(entry.status)}</span>
              {entry.tags.slice(0, 2).map((tag) => (
                <span key={`${entry.id}-${tag}`} className="pill">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="mt-4 text-white">{entry.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/65">{entry.description}</p>
            <Link
              href={`/work/${entry.id}`}
              className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-200 transition hover:text-white"
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
  repoUrl,
}: Readonly<{
  demoUrl?: string;
  repoUrl?: string;
}>) {
  if (!demoUrl && !repoUrl) {
    return null;
  }

  return (
    <div className="glass-no-hover rounded-[var(--radius-xl)] border border-white/10 p-5">
      <span className="label">Links</span>
      <div className="mt-4 flex flex-col gap-3">
        {demoUrl ? (
          <Link
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-cyan inline-flex justify-center"
          >
            View live demo
          </Link>
        ) : null}
        {repoUrl ? (
          <Link
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill inline-flex justify-center"
          >
            GitHub
          </Link>
        ) : null}
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
  const projectMeta = projects.find((entry) => entry.id === slug);

  if (!project) {
    return { title: 'Work' };
  }

  return {
    title: projectMeta?.title ?? project.frontmatter.title,
    description: projectMeta?.tagline ?? project.frontmatter.summary,
    alternates: { canonical: `https://www.scardubu.dev/work/${slug}` },
    openGraph: {
      title: `${projectMeta?.title ?? project.frontmatter.title} · Oscar Scardubu`,
      description: projectMeta?.tagline ?? project.frontmatter.summary,
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
      name: 'Oscar Scardubu',
      url: 'https://www.scardubu.dev',
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = await getWorkCase(slug);

  if (!project) {
    notFound();
  }

  const projectMeta = projects.find((entry) => entry.id === slug);
  const relatedProjects = projects.filter((entry) => entry.id !== slug).slice(0, 2);
  const title = projectMeta?.title ?? project.frontmatter.title;
  const description = projectMeta?.tagline ?? project.frontmatter.summary;
  const tags = projectMeta?.tags ?? project.frontmatter.tags ?? [];
  const statusLabel = getProjectStatusLabel(projectMeta?.status);

  return (
    <>
      <NavBar />
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
            <Link href="/#projects" className="pill pill-cyan">
              Back to projects
            </Link>
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
              <div className="min-w-0">
                <header className="mt-[var(--space-8)] mb-[var(--space-10)] max-w-[60ch]">
                  <span className="label">Case Study</span>
                  <h1 className="mt-[var(--space-2)]">{title}</h1>
                  <p className="mt-[var(--space-4)] text-[length:var(--text-lg)]">{description}</p>
                  {projectMeta ? (
                    <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
                      <span className="pill pill-cyan">{statusLabel}</span>
                      {projectMeta.featured ? <span className="pill">Featured system</span> : null}
                    </div>
                  ) : null}
                </header>

                <article className="prose max-w-none pb-[var(--space-20)]">
                  {project.content}
                </article>

                <RelatedCaseStudies entries={relatedProjects} />
              </div>

              <aside className="space-y-4 xl:sticky xl:top-[calc(var(--nav-height)+var(--space-8))]">
                <div className="glass-no-hover rounded-[var(--radius-xl)] border border-white/10 p-5">
                  <span className="label">Snapshot</span>
                  <div className="mt-4 space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs tracking-[0.14em] text-white/35 uppercase">Status</p>
                      <p className="text-sm text-white/80">{statusLabel}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs tracking-[0.14em] text-white/35 uppercase">Surface</p>
                      <p className="text-sm text-white/80">Case study and architecture review</p>
                    </div>
                  </div>
                </div>

                {tags.length ? (
                  <div className="glass-no-hover rounded-[var(--radius-xl)] border border-white/10 p-5">
                    <span className="label">Stack</span>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <ProjectLinksCard demoUrl={projectMeta?.demoUrl} repoUrl={projectMeta?.repoUrl} />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
