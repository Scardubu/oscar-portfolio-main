// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// FIXED: Was incorrectly populated with WritingPostPage (slug page) content.
//   /writing route was calling notFound() on every request since params.slug
//   is undefined at the non-dynamic segment. This is the correct list page.
// Mobile-native: single-column list → 2-col on sm+.
// Lagos, Nigeria → Global.

import type { Metadata } from 'next';
import Link from 'next/link';

import { Footer } from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Writing · Oscar Ndugbu',
  description:
    'Architecture decisions, ML trade-offs, and what actually held in production — technical writing by Oscar Ndugbu from Lagos.',
  alternates: { canonical: 'https://www.scardubu.dev/writing' },
  openGraph: {
    title: 'Writing · Oscar Ndugbu',
    description: 'Architecture decisions, ML trade-offs, and what held in production.',
    url: 'https://www.scardubu.dev/writing',
    type: 'website',
  },
};

export default async function WritingPage() {
  const posts = await getWritingPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest     = posts.filter((p) => p !== featured);

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section
          className="pt-[calc(var(--nav-height)+var(--space-12))] pb-[var(--section-py)]"
        >
          <div className="container">

            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="mb-10 sm:mb-14">
              <div className="section-kicker-row mb-[var(--space-2)]">
                <span className="section-number" aria-hidden="true">05</span>
                <span className="section-label">Writing</span>
              </div>

              <h1
                className="mt-[var(--space-2)] max-w-[22ch]"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Writing that ships decisions.
              </h1>

              <p
                className="mt-4 max-w-[56ch] text-base leading-8"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Architecture calls, ML trade-offs, and what actually held in production —
                from Lagos to the world.
              </p>

              <p
                className="mt-2 font-mono text-xs tracking-widest uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {posts.length} articles
              </p>
            </div>

            {/* ── Featured post ────────────────────────────────────────────── */}
            {featured && (
              <article
                className="glass-full rounded-[var(--radius-xl)] p-5 sm:p-8 lg:p-10 mb-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="pill pill-cyan">Featured</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {featured.readingTime} min read
                  </span>
                </div>

                <h2
                  className="mt-5 max-w-[28ch] text-xl sm:text-2xl font-bold leading-snug tracking-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {featured.title}
                </h2>

                <p
                  className="mt-4 max-w-[64ch] text-base leading-8"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {featured.summary}
                </p>

                <div
                  className="mt-4 flex flex-wrap items-center gap-3 text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <time dateTime={featured.date} className="font-mono uppercase">
                    {formatDate(featured.date)}
                  </time>
                  {featured.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="pill">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/writing/${featured.slug}`}
                  className="mt-6 inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center sm:justify-start gap-2 rounded-full border px-5 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  style={{
                    borderColor: 'var(--color-cyan-surface)',
                    color: 'var(--color-film-teal)',
                  }}
                >
                  Read article →
                </Link>
              </article>
            )}

            {/* ── Article list ─────────────────────────────────────────────── */}
            {rest.length > 0 && (
              <div
                className="grid gap-px overflow-hidden rounded-[var(--radius-lg)]"
                style={{ background: 'var(--color-border)' }}
              >
                {rest.map((post) => (
                  <div
                    key={post.slug}
                    style={{ background: 'var(--color-bg)' }}
                  >
                    <Link href={`/writing/${post.slug}`} className="block">
                      <article className="writing-row min-h-[60px] py-3.5 px-4 sm:px-0 flex items-center gap-4">
                        {/* Date: hidden on mobile — shown inline */}
                        <time
                          dateTime={post.date}
                          className="hidden sm:block min-w-28 shrink-0 font-mono text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {formatDate(post.date)}
                        </time>

                        <div className="flex-1 min-w-0">
                          <span
                            className="writing-title block truncate text-sm font-medium"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {post.title}
                          </span>
                          <time
                            dateTime={post.date}
                            className="sm:hidden block font-mono text-[10px] mt-0.5"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {formatDate(post.date)}
                          </time>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          {post.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="hidden sm:inline pill"
                            >
                              {tag}
                            </span>
                          ))}
                          <span
                            className="text-xs whitespace-nowrap"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {post.readingTime} min
                          </span>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {posts.length === 0 && (
              <p
                className="mt-10 text-base"
                style={{ color: 'var(--color-text-muted)' }}
              >
                No articles published yet. Check back soon.
              </p>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}