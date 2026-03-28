import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { getWritingPost, getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  posts: Awaited<ReturnType<typeof getWritingPosts>>
) {
  return posts
    .filter((entry) => entry.slug !== currentSlug)
    .map((entry) => ({
      ...entry,
      sharedTags: entry.tags.filter((tag) => currentTags.includes(tag)).length,
    }))
    .sort((left, right) => {
      if (right.sharedTags !== left.sharedTags) {
        return right.sharedTags - left.sharedTags;
      }

      return new Date(right.date).getTime() - new Date(left.date).getTime();
    })
    .slice(0, 2);
}

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
  const allPosts = await getWritingPosts();

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.frontmatter.tags ?? [], allPosts);

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
              {(post.frontmatter.tags ?? []).length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                  {(post.frontmatter.tags ?? []).map((tag) => (
                    <span key={tag} className="pill">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>
            <article className="prose" style={{ paddingBottom: 'var(--space-20)' }}>
              {post.content}
            </article>

            {relatedPosts.length ? (
              <aside
                aria-labelledby="related-writing-heading"
                className="glass-no-hover rounded-[var(--radius-xl)] border border-white/10 p-6"
                style={{ marginBottom: 'var(--space-20)' }}
              >
                <span className="label">Continue reading</span>
                <h2 id="related-writing-heading" style={{ marginTop: 'var(--space-2)' }}>
                  Related articles
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {relatedPosts.map((entry) => (
                    <article key={entry.slug} className="rounded-[var(--radius-lg)] border border-white/10 p-5">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                        <span>{formatDate(entry.date)}</span>
                        <span aria-hidden="true">•</span>
                        <span>{entry.readingTime} min read</span>
                      </div>
                      <h3 className="mt-3 text-white">{entry.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/65">{entry.summary}</p>
                      <Link
                        href={`/writing/${entry.slug}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-200 transition hover:text-white"
                      >
                        Read article →
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