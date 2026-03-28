import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { getWritingPost, getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

interface WritingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getWritingPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingPost(slug);

  if (!post) {
    return { title: 'Writing' };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    alternates: { canonical: `https://www.scardubu.dev/writing/${slug}` },
    openGraph: {
      title: `${post.frontmatter.title} · Oscar Scardubu`,
      description: post.frontmatter.summary,
      url: `https://www.scardubu.dev/writing/${slug}`,
      images: ['/og'],
    },
  };
}

export default async function WritingPostPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const post = await getWritingPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <NavBar />
      <main id="main-content" tabIndex={-1}>
        <section style={{ paddingTop: 'calc(var(--nav-height) + var(--space-12))' }}>
          <div className="container">
            <Link href="/writing" className="pill pill-cyan">
              Back to writing
            </Link>
            <header style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
              <span className="label">Writing</span>
              <h1 style={{ marginTop: 'var(--space-2)' }}>{post.frontmatter.title}</h1>
              <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>
                {post.frontmatter.summary}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
                <span>{formatDate(post.frontmatter.date)}</span>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </div>
            </header>
            <article className="prose" style={{ paddingBottom: 'var(--space-20)' }}>
              {post.content}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}