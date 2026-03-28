import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { projects } from '@/data/projects';
import { getWorkCase, getWorkCases } from '@/lib/content';

interface WorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const cases = await getWorkCases();
  return cases.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getWorkCase(slug);

  if (!project) {
    return { title: 'Work' };
  }

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.summary,
    alternates: { canonical: `https://www.scardubu.dev/work/${slug}` },
    openGraph: {
      title: `${project.frontmatter.title} · Oscar Scardubu`,
      description: project.frontmatter.summary,
      url: `https://www.scardubu.dev/work/${slug}`,
      images: ['/og'],
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

  return (
    <>
      <NavBar />
      <main id="main-content" tabIndex={-1}>
        <section className="relative overflow-hidden pt-[calc(var(--nav-height)+var(--space-12))]">
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(34,211,238,0.08) 0%, transparent 70%)',
            }}
          />
          <div className="container" style={{ position: 'relative' }}>
            <Link href="/#projects" className="pill pill-cyan">
              Back to projects
            </Link>
            <header style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
              <span className="label">Case Study</span>
              <h1 style={{ marginTop: 'var(--space-2)' }}>{project.frontmatter.title}</h1>
              <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>
                {project.frontmatter.summary}
              </p>
              {projectMeta ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                  <span className="pill pill-cyan">{projectMeta.status === 'live' ? 'Live deployment' : projectMeta.status === 'wip' ? 'Active build' : 'Archived'}</span>
                  {projectMeta.featured ? <span className="pill">Featured system</span> : null}
                </div>
              ) : null}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)',
                  marginTop: 'var(--space-6)',
                }}
              >
                {(project.frontmatter.tags ?? []).map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
              {projectMeta?.demoUrl || projectMeta?.repoUrl ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                  {projectMeta.demoUrl ? (
                    <Link
                      href={projectMeta.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill pill-cyan"
                    >
                      View live demo
                    </Link>
                  ) : null}
                  {projectMeta.repoUrl ? (
                    <Link
                      href={projectMeta.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill"
                    >
                      View source
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </header>
            <article className="prose" style={{ paddingBottom: 'var(--space-20)' }}>
              {project.content}
            </article>

            {relatedProjects.length ? (
              <aside
                aria-labelledby="related-case-studies-heading"
                className="glass-no-hover rounded-[var(--radius-xl)] border border-white/10 p-6"
                style={{ marginBottom: 'var(--space-20)' }}
              >
                <span className="label">More work</span>
                <h2 id="related-case-studies-heading" style={{ marginTop: 'var(--space-2)' }}>
                  Other case studies
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {relatedProjects.map((entry) => (
                    <article key={entry.id} className="rounded-[var(--radius-lg)] border border-white/10 p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="pill">{entry.status === 'live' ? 'Live' : entry.status === 'wip' ? 'WIP' : 'Archived'}</span>
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
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
