import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
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
            </header>
            <article className="prose" style={{ paddingBottom: 'var(--space-20)' }}>
              {project.content}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
