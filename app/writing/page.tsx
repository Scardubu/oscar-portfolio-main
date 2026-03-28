import type { Metadata } from 'next';
import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Technical writing on production ML systems, fintech architecture, and platform delivery.',
  alternates: { canonical: 'https://www.scardubu.dev/writing' },
};

export default async function WritingIndexPage() {
  const posts = await getWritingPosts();
  const groups = posts.reduce<Record<string, typeof posts>>((accumulator, post) => {
    const year = new Date(post.date).getFullYear().toString();
    accumulator[year] ??= [];
    accumulator[year].push(post);
    return accumulator;
  }, {});

  return (
    <>
      <NavBar />
      <main id="main-content" tabIndex={-1}>
        <section style={{ paddingTop: 'calc(var(--nav-height) + var(--space-12))' }}>
          <div className="container">
            <span className="label">Writing</span>
            <h1 style={{ marginTop: 'var(--space-2)' }}>Technical Perspective</h1>
            <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>
              Articles on production ML systems, fintech architecture, and the delivery choices that hold up under real load.
            </p>

            <div style={{ marginTop: 'var(--space-12)', display: 'grid', gap: 'var(--space-12)', paddingBottom: 'var(--space-20)' }}>
              {Object.entries(groups)
                .sort(([left], [right]) => Number(right) - Number(left))
                .map(([year, yearPosts]) => (
                  <section key={year} aria-labelledby={`writing-year-${year}`}>
                    <h2 id={`writing-year-${year}`} style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
                      {year}
                    </h2>
                    <div>
                      {yearPosts.map((post) => (
                        <article key={post.slug} className="writing-row">
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
                            <Link href={`/writing/${post.slug}`} className="writing-title" style={{ display: 'block', fontSize: 'var(--text-lg)' }}>
                              {post.title}
                            </Link>
                            <p style={{ marginTop: 'var(--space-2)', maxWidth: '64ch' }}>{post.summary}</p>
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                            {post.readingTime} min
                          </span>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}