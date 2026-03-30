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

  // Sort newest-first then bucket by year
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featured = sorted.find((p) => p.featured) ?? sorted[0];

  const groups = sorted.reduce<Record<string, typeof posts>>((accumulator, post) => {
    const year = new Date(post.date).getFullYear().toString();
    accumulator[year] ??= [];
    accumulator[year].push(post);
    return accumulator;
  }, {});

  return (
    <>
      <NavBar />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-[calc(var(--nav-height)+var(--space-12))]">
          <div className="container">
            <span className="label">Writing</span>
            <h1 className="mt-2">Notes on building</h1>
            <p className="mt-4 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
              ML systems, fintech architecture, and the decisions that don&apos;t show up in the
              commit history.
            </p>

            {/* Featured article banner */}
            {featured && (
              <Link
                href={`/writing/${featured.slug}`}
                className="group mt-10 block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label={`Featured article: ${featured.title}`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[color:var(--color-text-primary)] uppercase">
                    Featured
                  </span>
                  {featured.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[color:var(--color-text-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl leading-snug font-semibold transition-colors group-hover:text-white/90">
                  {featured.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--color-text-muted)]">
                  {featured.summary}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-[color:var(--color-text-muted)]">
                  <time className="font-mono">{formatDate(featured.date)}</time>
                  <span>{featured.readingTime} min read</span>
                  <span className="ml-auto text-xs font-semibold text-[color:var(--color-text-primary)]">
                    Read article →
                  </span>
                </div>
              </Link>
            )}

            {/* Year-bucketed archive */}
            <div className="mt-12 grid gap-12 pb-20">
              {Object.entries(groups)
                .sort(([left], [right]) => Number(right) - Number(left))
                .map(([year, yearPosts]) => (
                  <section key={year} aria-labelledby={`writing-year-${year}`}>
                    <h2 id={`writing-year-${year}`} className="mb-4 text-xl font-semibold">
                      {year}
                    </h2>
                    <div>
                      {yearPosts.map((post) => (
                        <article key={post.slug} className="writing-row">
                          <time className="min-w-28 shrink-0 font-mono text-xs text-[color:var(--color-text-muted)]">
                            {formatDate(post.date)}
                          </time>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/writing/${post.slug}`}
                              className="writing-title block text-base"
                            >
                              {post.title}
                            </Link>
                            <p className="mt-1 max-w-[64ch] text-sm text-[color:var(--color-text-muted)]">
                              {post.summary}
                            </p>
                            {post.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {post.tags.slice(0, 4).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[color:var(--color-text-muted)]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-xs whitespace-nowrap text-[color:var(--color-text-muted)]">
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
