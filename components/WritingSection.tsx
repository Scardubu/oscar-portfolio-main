// CONVICTION ENGINE v18.0 — WritingSection
// Mobile-native: filter chips scroll horizontally (no wrap), rows have
// 44px minimum touch target, featured article is vertically scannable.
// Changes from v10:
//   • Filter row: overflow-x-auto, shrink-0 chips, no wrapping on mobile.
//   • Featured article: removed lg:grid split layout — keeps vertical flow.
//   • Writing rows: min-h-[44px] flex, date + title in same row on md+.
//   • "View all" CTA: full-width on mobile, centered.
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
          {/* ── Section header ────────────────────────────────────── */}
          <m.div variants={child} className="mb-8 sm:mb-12 max-w-4xl">
            <div className="section-kicker-row">
              <span className="section-number" aria-hidden="true">05</span>
              <span className="section-label">Writing</span>
            </div>

            <m.h2
              variants={reducedMotion ? child : clipReveal}
              id="writing-heading"
              className="mt-[var(--space-2)]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Engineering in depth
            </m.h2>

            <m.p
              variants={child}
              className="mt-4 max-w-[62ch] text-base leading-[1.8]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Long-form breakdowns of shipping decisions, platform constraints, and what holds
              when production stops being polite.
            </m.p>

            {/* ── Filter chips: horizontal scroll on mobile ─────────── */}
            <m.div
              variants={child}
              className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar"
              style={{ scrollbarWidth: 'none' }}
              role="group"
              aria-label="Filter articles by topic"
            >
              {(['ALL', ...FILTER_LABELS] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveFilter(label as FilterLabel | 'ALL')}
                  className={`tag shrink-0 cursor-pointer min-h-[36px] ${activeFilter === label ? 'tag--active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </m.div>
          </m.div>

          {/* ── Featured article ──────────────────────────────────── */}
          {featuredPost ? (
            <>
              <m.article
                variants={card}
                className="glass-full rounded-[var(--radius-xl)] p-6 sm:p-8 lg:p-10 mb-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="pill pill-cyan">Featured</span>
                  <span className="badge-muted">{posts.length} published</span>
                </div>

                <h3
                  className="mt-5 max-w-[24ch] text-xl sm:text-2xl font-bold leading-snug tracking-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {featuredPost.title}
                </h3>

                <p
                  className="mt-4 max-w-[68ch] text-base leading-8"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {featuredPost.summary}
                </p>

                <div
                  className="mt-5 flex flex-wrap items-center gap-3 text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <time dateTime={featuredPost.date} className="font-mono uppercase">
                    {formatDate(featuredPost.date)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{featuredPost.readingTime} min read</span>
                  {featuredPost.tags.slice(0, 2).map((tag) => (
                    <span key={`${featuredPost.slug}-${tag}`} className="pill">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/writing/${featuredPost.slug}`}
                  className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition"
                  style={{
                    borderColor: 'var(--color-cyan-surface)',
                    color: 'var(--color-film-teal)',
                  }}
                >
                  <span>Read article</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </m.article>

              {/* ── Article list ──────────────────────────────────── */}
              {otherPosts.length > 0 && (
                <AnimatePresence mode="popLayout">
                  <m.div variants={container} className="grid gap-px overflow-hidden rounded-[var(--radius-lg)]" style={{ background: 'var(--color-border)' }}>
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
                                : { x: 4, transition: { type: 'spring', stiffness: 320, damping: 28 } }
                            }
                            className="writing-row min-h-[52px]"
                          >
                            <time
                              dateTime={post.date}
                              className="min-w-24 shrink-0 font-mono text-xs"
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
                            </div>
                            <span
                              className="text-xs whitespace-nowrap shrink-0"
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

              {/* ── View all CTA ──────────────────────────────────── */}
              <m.div
                variants={child}
                className="mt-8 flex justify-center sm:justify-start"
              >
                <Link
                  href="/writing"
                  className="pill pill-cyan inline-flex min-h-[44px] items-center gap-2 px-5 transition hover:-translate-y-px"
                >
                  <span>View all writing ({posts.length})</span>
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