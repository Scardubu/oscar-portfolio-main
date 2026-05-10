// app/writing/[slug]/page.tsx — CONVICTION ENGINE v21.0
// Mobile-native article page. Sidebar renders below article on mobile.
// Lagos, Nigeria → Global.
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { ReadingProgress } from '@/components/ReadingProgress';
import { getWritingPost, getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

type WritingPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  posts: Awaited<ReturnType<typeof getWritingPosts>>
) {
  return posts
    .filter((e) => e.slug !== currentSlug)
    .map((e) => ({
      ...e,
      sharedTags: e.tags.filter((t) => currentTags.includes(t)).length,
    }))
    .sort((a, b) => {
      if (b.sharedTags !== a.sharedTags) return b.sharedTags - a.sharedTags;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 2);
}

export async function generateStaticParams() {
  const posts = await getWritingPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post     = await getWritingPost(slug);

  if (!post) return { title: 'Writing' };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    alternates: { canonical: `https://www.scardubu.dev/writing/${slug}` },
    openGraph: {
      title: `${post.frontmatter.title} · Oscar Ndugbu`,
      description: post.frontmatter.summary,
      url: `https://www.scardubu.dev/writing/${slug}`,
      type: 'article',
    },
  };
}

function articleJsonLd(title: string, summary: string, date: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: summary,
    datePublished: date,
    url: `https://www.scardubu.dev/writing/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Oscar Ndugbu',
      url: 'https://www.scardubu.dev',
    },
  };
}

export default async function WritingPostPage({ params }: WritingPageProps) {
  const { slug }   = await params;
  const post       = await getWritingPost(slug);
  const allPosts   = await getWritingPosts();

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.frontmatter.tags ?? [], allPosts);
  const articleMeta  = [
    { label: 'Published',     value: formatDate(post.frontmatter.date) },
    { label: 'Reading time',  value: `${post.readingTime} min read` },
  ];

  return (
    <>
      <NavBar />
      <ReadingProgress />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-[calc(var(--nav-height)+var(--space-12))]">
          <div className="container">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(
                  articleJsonLd(
                    post.frontmatter.title,
                    post.frontmatter.summary,
                    post.frontmatter.date,
                    slug
                  )
                ),
              }}
            />

            {/* Back link — thumb zone */}
            <Link
              href="/writing"
              className="pill pill-cyan inline-flex min-h-[44px] items-center"
            >
              ← Writing
            </Link>

            {/*
              Grid:
              - Mobile: single column
              - xl+: two-column sticky sidebar
            */}
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start xl:gap-10">
              {/* Article */}
              <div className="min-w-0">
                <header className="mt-[var(--space-8)] mb-[var(--space-10)] max-w-[60ch]">
                  <span className="label">Writing</span>
                  <h1 className="mt-[var(--space-2)]">{post.frontmatter.title}</h1>
                  <p
                    className="mt-[var(--space-4)] text-base sm:text-lg leading-8"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {post.frontmatter.summary}
                  </p>

                  {/* Meta inline — visible immediately on mobile */}
                  <div
                    className="mt-[var(--space-4)] flex flex-wrap items-center gap-3 font-mono text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <time dateTime={post.frontmatter.date}>
                      {formatDate(post.frontmatter.date)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime} min read</span>
                    {(post.frontmatter.tags ?? []).slice(0, 2).map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </header>

                <article className="prose max-w-none pb-[var(--space-20)]">
                  {post.content}
                </article>

                {/* Related posts */}
                {relatedPosts.length > 0 && (
                  <aside
                    aria-labelledby="related-writing-heading"
                    className="mb-[var(--space-20)] rounded-[var(--radius-xl)] border border-white/10 p-5 sm:p-6"
                  >
                    <span className="label">Continue reading</span>
                    <h2 id="related-writing-heading" className="mt-[var(--space-2)]">
                      Related articles
                    </h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {relatedPosts.map((entry) => (
                        <article
                          key={entry.slug}
                          className="rounded-[var(--radius-lg)] border border-white/10 p-4 sm:p-5"
                        >
                          <div
                            className="flex flex-wrap items-center gap-3 text-xs font-mono"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                            <span aria-hidden="true">·</span>
                            <span>{entry.readingTime} min read</span>
                          </div>
                          <h3 className="mt-3" style={{ color: 'var(--color-text-primary)' }}>
                            {entry.title}
                          </h3>
                          <p
                            className="mt-3 text-sm leading-7"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {entry.summary}
                          </p>
                          <Link
                            href={`/writing/${entry.slug}`}
                            className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm transition hover:text-white"
                            style={{ color: 'var(--color-film-teal)' }}
                          >
                            Read article →
                          </Link>
                        </article>
                      ))}
                    </div>
                  </aside>
                )}
              </div>

              {/* Sidebar: inline on mobile, sticky on xl+ */}
              <aside className="space-y-4 xl:sticky xl:top-[calc(var(--nav-height)+var(--space-8))]">
                {/* At a glance */}
                <div className="rounded-[var(--radius-xl)] border border-white/10 p-5">
                  <span className="label">At a glance</span>
                  <div className="mt-4 space-y-4">
                    {articleMeta.map(({ label, value }) => (
                      <div key={label} className="space-y-1">
                        <p
                          className="text-xs tracking-[0.14em] uppercase"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {label}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                {(post.frontmatter.tags ?? []).length > 0 && (
                  <div className="rounded-[var(--radius-xl)] border border-white/10 p-5">
                    <span className="label">Topics</span>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(post.frontmatter.tags ?? []).map((tag) => (
                        <span key={tag} className="pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Browse all CTA */}
                <Link
                  href="/writing"
                  className="pill pill-cyan inline-flex w-full justify-center min-h-[48px] items-center"
                >
                  Browse all writing
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}