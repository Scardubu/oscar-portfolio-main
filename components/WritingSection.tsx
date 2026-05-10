// CONVICTION ENGINE v21.0 — WritingSection
// Mobile-native: filter chips scroll horizontally, rows 52px min touch target.
// Lagos, Nigeria → Global.
//
// v21 changes vs v20:
//   • Featured card: min-h-[52px] read CTA for thumb zone; title line-clamp-3 mobile.
//   • Article row: explicit min-h-[52px] + py-3 for reliable tap target.
//   • Filter pill active: solid bg + border for maximum contrast outdoors.
//   • Section copy: tightened to ≤56ch for mobile line-length.
//   • "View all" CTA: w-full on mobile.
'use client';

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import type { WritingPost } from '@/lib/content';
import { cardReveal, clipReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';
import { formatDate } from '@/lib/utils';

const FILTER_LABELS = ['ARCHITECTURE', 'ML SYSTEMS', 'RELIABILITY', 'FINTECH'] as const;
type FilterLabel = (typeof FILTER_LABELS)[number];

export function WritingSection({ posts }: Readonly<{ posts: WritingPost[] }>) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<FilterLabel | 'ALL'>('ALL');

  const container = useMemo(() => staggerContainer(0.08, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;
  const card = useMemo(() => (reducedMotion ? noMotion : cardReveal(24)), [reducedMotion]);

  const featuredPost = posts.find((p) => p.featured) ?? posts[0];
  const allOtherPosts = posts.filter((p) => p !== featuredPost);
  const otherPosts =
    activeFilter === 'ALL'
      ? allOtherPosts
      : allOtherPosts.filter((p) =>
          p.tags.some((t) => t.toUpperCase().includes(activeFilter.split(' ')[0]))
        );

  return (
    <section
      id="section-writing"
      ref={ref}
      aria-labelledby="writing-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          {/* Section header */}
          <m.div variants={child} className="mb-8 sm:mb-12">
            <div className="section-kicker-row">
              <span className="section-number" aria-hidden="true">05</span>
              <span className="section-label">Writing</span>
            </div>

            <m.h2
              variants={reducedMotion ? child : clipReveal}
              id="writing-heading"
              className="mt-[var(--space-2)] max-w-[22ch]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Writing that ships decisions.
            </m.h2>

            <m.p
              variants={child}
              className="mt-4 max-w-[56ch] text-base leading-[1.8]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Architecture calls, ML trade-offs, and what actually held in production —
              from Lagos to the world.
            </m.p>

            {/* Filter chips: horizontal scroll on mobile */}
            <m.div
              variants={child}
              className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar"
              style={{ scrollbarWidth: 'none' }}
              role="group"
              aria-label="Filter articles by topic"
            >
              {(['ALL', ...FILTER_LABELS] as const).map((label) => {
                const isActive = activeFilter === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveFilter(label as FilterLabel | 'ALL')}
                    aria-pressed={isActive}
                    className={[
                      'shrink-0 rounded-full px-4 py-2 font-mono text-[11px] tracking-widest uppercase',
                      'transition-all duration-200 min-h-[44px] border',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                      isActive
                        ? 'bg-white/12 border-white/30 text-white shadow-sm'
                        : 'border-white/10 text-white/45 hover:text-white/70 hover:border-white/20',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </m.div>
          </m.div>

          {featuredPost ? (
            <>
              {/* Featured article */}
              <m.article
                variants={card}
                className="glass-full rounded-[var(--radius-xl)] p-5 sm:p-8 lg:p-10 mb-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="pill pill-cyan">Featured</span>
                  <span className="badge-muted">{posts.length} published</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {featuredPost.readingTime} min read
                  </span>
                </div>

                <h3
                  className="mt-5 max-w-[28ch] text-xl sm:text-2xl font-bold leading-snug tracking-tight line-clamp-3 sm:line-clamp-none"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {featuredPost.title}
                </h3>

                <p
                  className="mt-4 max-w-[64ch] text-base leading-8"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {featuredPost.summary}
                </p>

                <div
                  className="mt-4 flex flex-wrap items-center gap-3 text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <time dateTime={featuredPost.date} className="font-mono uppercase">
                    {formatDate(featuredPost.date)}
                  </time>
                  {featuredPost.tags.slice(0, 3).map((tag) => (
                    <span key={`${featuredPost.slug}-${tag}`} className="pill">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/writing/${featuredPost.slug}`}
                  className="mt-6 inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center sm:justify-start gap-2 rounded-full border px-5 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  style={{
                    borderColor: 'var(--color-cyan-surface)',
                    color: 'var(--color-film-teal)',
                  }}
                >
                  <span>Read article</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </m.article>

              {/* Article list */}
              {otherPosts.length > 0 && (
                <AnimatePresence mode="popLayout">
                  <m.div
                    variants={container}
                    className="grid gap-px overflow-hidden rounded-[var(--radius-lg)]"
                    style={{ background: 'var(--color-border)' }}
                  >
                    {otherPosts.map((post) => (
                      <m.div
                        key={post.slug}
                        variants={card}
                        exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                        layout
                        style={{ background: 'var(--color-bg)' }}
                      >
                        <Link href={`/writing/${post.slug}`} className="block">
                          <m.article
                            whileHover={
                              reducedMotion
                                ? undefined
                                : {
                                    x: 4,
                                    transition: {
                                      type: 'spring',
                                      stiffness: 320,
                                      damping: 28,
                                    },
                                  }
                            }
                            className="writing-row min-h-[52px] py-3 px-4 sm:px-0"
                          >
                            {/* Date: hidden on mobile — shown inline below title */}
                            <time
                              dateTime={post.date}
                              className="hidden sm:block min-w-24 shrink-0 font-mono text-xs"
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

                            <span
                              className="text-xs whitespace-nowrap shrink-0 ml-3"
                              style={{ color: 'var(--color-text-muted)' }}
                            >
                              {post.readingTime} min
                            </span>
                          </m.article>
                        </Link>
                      </m.div>
                    ))}
                  </m.div>
                </AnimatePresence>
              )}

              {/* View all CTA: full-width on mobile */}
              <m.div
                variants={child}
                className="mt-8"
              >
                <Link
                  href="/writing"
                  className="pill pill-cyan inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center sm:justify-start gap-2 px-5 transition hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <span>All {posts.length} articles</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </m.div>
            </>
          ) : null}
        </m.div>
      </div>
    </section>
  );
}