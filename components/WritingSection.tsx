import Link from 'next/link';

import type { WritingPost } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export function WritingSection({ posts }: Readonly<{ posts: WritingPost[] }>) {
  const featuredPost = posts.find((p) => p.featured) ?? posts[0];
  const otherPosts = posts.filter((p) => p !== featuredPost);

  return (
    <section id="writing" aria-labelledby="writing-heading" className="py-20 sm:py-24">
      <div className="container">
        <div className="mb-[var(--space-10)]">
          <div className="flex flex-wrap items-center gap-3" data-reveal="">
            <span className="label">Writing</span>
            <span className="pill">{posts.length} articles</span>
          </div>
          <h2
            id="writing-heading"
            data-reveal=""
            data-reveal-delay="1"
            className="gradient-text mt-[var(--space-2)]"
          >
            Notes on building
          </h2>
          <p
            data-reveal=""
            data-reveal-delay="2"
            className="mt-[var(--space-4)] text-[length:var(--text-lg)]"
          >
            ML systems, fintech architecture, and the decisions that don&apos;t show up in the
            commit history.
          </p>
        </div>

        {featuredPost ? (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <article
              className="glass glass-medium rounded-[var(--radius-xl)] p-6 sm:p-8"
              data-reveal=""
              data-reveal-delay="3"
            >
              <span className="pill pill-cyan">Featured article</span>
              <h3 className="mt-5 text-white">{featuredPost.title}</h3>
              <p className="mt-4 text-base leading-7 text-white/65">{featuredPost.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {featuredPost.tags.slice(0, 3).map((tag) => (
                  <span key={`${featuredPost.slug}-${tag}`} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/55">
                <time dateTime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
                <span aria-hidden="true">•</span>
                <span>{featuredPost.readingTime} min read</span>
              </div>
              <Link
                href={`/writing/${featuredPost.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300/50 hover:text-white"
              >
                Read article →
              </Link>
            </article>

            <div data-reveal="" data-reveal-delay="4">
              {otherPosts.map((post) => (
                <div key={post.slug} className="writing-row">
                  <time
                    dateTime={post.date}
                    className="min-w-28 shrink-0 font-mono text-xs text-[color:var(--color-text-muted)]"
                  >
                    {formatDate(post.date)}
                  </time>
                  <div className="flex-1">
                    <Link href={`/writing/${post.slug}`} className="writing-title block">
                      {post.title}
                    </Link>
                    <p className="mt-[var(--space-2)] text-sm">{post.summary}</p>
                  </div>
                  <span className="text-xs whitespace-nowrap text-[color:var(--color-text-muted)]">
                    {post.readingTime} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-[var(--space-8)]" data-reveal="" data-reveal-delay="4">
          <Link
            href="/writing"
            className="pill pill-cyan inline-flex items-center gap-2 transition hover:-translate-y-px"
          >
            All writing →
          </Link>
        </div>
      </div>
    </section>
  );
}
