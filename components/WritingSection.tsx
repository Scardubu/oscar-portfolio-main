import Link from 'next/link';

import type { WritingPost } from '@/lib/content';

export function WritingSection({ posts }: { posts: WritingPost[] }) {
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

        <div data-reveal="" data-reveal-delay="3">
          {posts.map((post) => (
            <div key={post.slug} className="writing-row">
              <time
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  minWidth: '5rem',
                  flexShrink: 0,
                }}
              >
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: '2-digit',
                })}
              </time>
              <Link href={`/writing/${post.slug}`} className="writing-title" style={{ flex: 1 }}>
                {post.title}
              </Link>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                {post.readingTime} min
              </span>
            </div>
          ))}
        </div>

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