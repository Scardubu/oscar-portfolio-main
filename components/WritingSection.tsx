// CONVICTION ENGINE v23.0 — WritingSection
//
// v23 vs v22.1:
//   [CHANGE]: Section intro — editorial 2-col at lg+.
//     Previous: kicker + h2 + description + filter chips stacked single-column.
//     Problem: At desktop, the full-width heading sits alone while the description
//       and filter chips follow below in a single column — same "blown-up phone"
//       pattern that was corrected in Projects (v25) and Open Source (v24).
//     Fix: Wrap kicker+heading and description in `section-intro-editorial` div
//       (layout.css). At lg+ this becomes heading-left / description-right with
//       editorial alignment. Filter chips remain full-width below both columns.
//     (layout.css `.section-intro-editorial` — desktop expansion, not mobile change)
//     (Nielsen: Flexible and Efficient Use — desktop canvas used intentionally)
//   KEEP: All v22.1 behaviour — flex-wrap filter chips on mobile, overflow-x:auto
//     at sm+, article list, featured card, view-all CTA, motion choreography,
//     reduced-motion fallbacks, all copy and microcopy.
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
  const inView = useInView(ref, { once: true, margin: '-40px' });
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

          {/* ── Section header ────────────────────────────────────────────── */}
          <m.div variants={child} className="mb-8 sm:mb-12">
            {/*
              v23 CHANGE: Editorial intro — section-intro-editorial (layout.css).
              Mobile: kicker, h2, description, and filter chips stack vertically (unchanged).
              lg+: kicker+h2 anchor the left column; description sits right with
                editorial alignment — richer desktop composition, not blown-up mobile.
              Filter chips remain full-width below the editorial pair on all viewports.
            */}
            <div className="section-intro-editorial mb-5 sm:mb-6">
              {/* Left: kicker + heading */}
              <div>
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
              </div>

              {/* Right: description — editorial counterweight at lg+ */}
              <div className="lg:flex lg:flex-col lg:justify-end">
                <m.p
                  variants={child}
                  className="mt-4 lg:mt-0 max-w-[52ch] text-sm sm:text-base leading-[1.8]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Architecture calls, ML trade-offs, and the production decisions
                  behind them — from Lagos to the world.
                </m.p>
              </div>
            </div>

            {/*
              v24.0 CHANGE — Filter chips:
                Mobile (< md): horizontal scroll strip — `overflow-x-auto scrollbar-none`
                  with snap-x. Previously flex-wrap created 3 awkward rows (ALL,
                  ARCHITECTURE / ML SYSTEMS, RELIABILITY / FINTECH). A scroll strip
                  keeps all 5 chips reachable without layout clutter.
                md+: flex-wrap retained — the wider canvas has room for all chips.
              v22.1 intent (keep every chip visible) is preserved — now also usable.
            */}
            <m.div
              variants={child}
              className="filter-chip-row"
              role="group"
              aria-label="Filter articles by topic"
            >
              {/* Scroll wrapper — horizontal on mobile, wrap on md+ */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x md:flex-wrap md:overflow-visible">
              {(['ALL', ...FILTER_LABELS] as const).map((label) => {
                const isActive = activeFilter === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveFilter(label as FilterLabel | 'ALL')}
                    aria-pressed={isActive}
                    data-active={isActive ? 'true' : 'false'}
                    className={[
                      'writing-filter-chip shrink-0 snap-start rounded-full px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase whitespace-nowrap',
                      'transition-all duration-200 min-h-[44px] border',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                      'active:scale-[0.97]',
                      isActive
                        ? 'bg-white/10 border-white/28 text-white'
                        : 'border-white/10 text-white/45 hover:text-white/70 hover:border-white/20',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
              </div>
            </m.div>
          </m.div>

          {featuredPost ? (
            <>
              {/* ── Featured article ───────────────────────────────────────── */}
              <m.article
                variants={card}
                className="glass-full rounded-[var(--radius-xl)] p-5 sm:p-8 lg:p-10 mb-4"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="pill pill-cyan">Featured</span>
                  <span className="badge-muted">{posts.length} articles</span>
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
                  className="mt-3 max-w-[64ch] text-sm sm:text-base leading-8"
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
                  className="mt-6 inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center sm:justify-start gap-2 rounded-full border px-5 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.97]"
                  style={{
                    borderColor: 'var(--color-film-teal-glow)',
                    color: 'var(--color-film-teal)',
                  }}
                >
                  <span>Read the article</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </m.article>

              {/* ── Article list ───────────────────────────────────────────── */}
              {otherPosts.length > 0 && (
                <AnimatePresence mode="popLayout">
                  <m.div
                    variants={container}
                    className="writing-articles-list grid gap-px overflow-hidden rounded-[var(--radius-lg)]"
                    style={{ background: 'var(--color-border)' }}
                  >
                    {otherPosts.map((post) => (
                      <m.div
                        key={post.slug}
                        variants={card}
                        exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                        layout
                        style={{ background: 'var(--color-bg)' }}
                      >
                        <Link href={`/writing/${post.slug}`} className="block group">
                          <m.article
                            whileHover={
                              reducedMotion
                                ? undefined
                                : {
                                    x: 4,
                                    transition: { type: 'spring', stiffness: 320, damping: 28 },
                                  }
                            }
                            className="flex min-h-[52px] items-center gap-3 px-4 py-3.5"
                          >
                            {/* Date — stacked on mobile, inline on sm+ */}
                            <div className="hidden sm:block min-w-24 shrink-0">
                              <time
                                dateTime={post.date}
                                className="font-mono text-xs"
                                style={{ color: 'var(--color-text-muted)' }}
                              >
                                {formatDate(post.date)}
                              </time>
                            </div>

                            <div className="flex-1 min-w-0">
                              <span
                                className="block text-sm font-medium line-clamp-2 sm:line-clamp-2 sm:whitespace-normal transition group-hover:text-white"
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

              {/* ── View all CTA: full-width on mobile ─────────────────────── */}
              <m.div variants={child} className="mt-8">
                <Link
                  href="/writing"
                  className="inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center sm:justify-start gap-2 rounded-full border px-6 py-3 font-mono text-[11px] tracking-widest uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.97]"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-film-teal)',
                  }}
                >
                  See all {posts.length} articles
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