import Link from 'next/link';

import type { WritingPost } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export function WritingSection({ posts }: { posts: WritingPost[] }) {
  const [featuredPost, ...otherPosts] = posts;

  return (
    <section id="writing" aria-labelledby="writing-heading">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <span className="label" data-reveal="">
            Writing
          </span>
          <h2 id="writing-heading" data-reveal="" data-reveal-delay="1" style={{ marginTop: 'var(--space-2)' }}>
            Technical Perspective
          </h2>
          <p data-reveal="" data-reveal-delay="2" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>
            ML systems, fintech architecture, and production engineering.
          </p>
        </div>

        {featuredPost ? (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <article
              className="glass-no-hover rounded-[var(--radius-xl)] border border-white/10 p-6 sm:p-8"
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
                <time>{formatDate(featuredPost.date)}</time>
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
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      minWidth: '7rem',
                      flexShrink: 0,
                    }}
                  >
                    {formatDate(post.date)}
                  </time>
                  <div style={{ flex: 1 }}>
                    <Link href={`/writing/${post.slug}`} className="writing-title" style={{ display: 'block' }}>
                      {post.title}
                    </Link>
                    <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>{post.summary}</p>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {post.readingTime} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 'var(--space-8)' }} data-reveal="" data-reveal-delay="4">
          <Link
            href="/writing"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-cyan)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            All writing →
          </Link>
        </div>
      </div>
    </section>
  );
}