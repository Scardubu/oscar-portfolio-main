// CONVICTION ENGINE v10.0 — FULL REPLACEMENT
'use client';

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import type { WritingPost } from '@/lib/content';
import { cardReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';
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
      className="border-t border-(--color-border) py-28 sm:py-32"
    >
      <div className="container">
        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <m.div variants={child} className="mb-12 max-w-4xl">
            <m.div variants={child} className="section-kicker-row">
              <span className="section-number" aria-hidden="true">
                05
              </span>
              <span className="section-label">WRITING</span>
            </m.div>
            <m.h2 variants={child} id="writing-heading" className="mt-(--space-2) text-white">
              Engineering in depth
            </m.h2>
            <m.p
              variants={child}
              className="mt-5 max-w-[62ch] text-(length:--text-xl) leading-[1.8]"
            >
              Long-form breakdowns of shipping decisions, platform constraints, and what continues
              to hold when production stops being polite.
            </m.p>
            <m.div variants={child} className="mt-6 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`tag cursor-pointer ${activeFilter === 'ALL' ? 'tag--active' : ''}`}
              >
                ALL
              </button>
              {FILTER_LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveFilter(label)}
                  className={`tag cursor-pointer ${activeFilter === label ? 'tag--active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </m.div>
          </m.div>

          {featuredPost ? (
            <div className="writing-section-inner">
              <m.article
                variants={card}
                className="glass glass-full glass-chromatic rounded-(--radius-xl) p-7 sm:p-9 lg:p-10"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="pill pill-cyan">Featured</span>
                  <span className="badge-muted">{posts.length} published</span>
                </div>
                <h3 className="mt-6 max-w-[20ch] text-white">{featuredPost.title}</h3>
                <p className="text-text-secondary mt-5 max-w-[68ch] text-lg leading-8">
                  {featuredPost.summary}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-(--color-text-muted)">
                  <time dateTime={featuredPost.date} className="font-mono uppercase">
                    {formatDate(featuredPost.date)}
                  </time>
                  <span aria-hidden="true">•</span>
                  <span>{featuredPost.readingTime} min read</span>
                  {featuredPost.tags.slice(0, 3).map((tag) => (
                    <span key={`${featuredPost.slug}-${tag}`} className="pill">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/writing/${featuredPost.slug}`}
                  className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-(--color-cyan-surface) px-5 py-2.5 text-sm text-(--color-cyan) transition hover:border-(--color-cyan) hover:text-white"
                >
                  <span>Read article</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </m.article>

              {posts.length < 2 ? (
                <m.article
                  variants={card}
                  className="glass-surface border-border-subtle rounded-(--radius-xl) border border-dashed p-7 opacity-75 sm:p-9"
                >
                  <p className="font-mono text-[11px] tracking-widest text-white/45 uppercase">
                    Next article
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/65">
                    In progress. A new deep-dive is currently being prepared for this section.
                  </p>
                </m.article>
              ) : null}

              {otherPosts.length ? (
                <m.div variants={container} className="grid gap-3">
                  <AnimatePresence mode="popLayout">
                    {otherPosts.map((post) => (
                      <m.div
                        key={post.slug}
                        variants={card}
                        exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                        layout
                      >
                        <Link href={`/writing/${post.slug}`} className="block">
                          <m.article
                            whileHover={
                              reducedMotion
                                ? undefined
                                : {
                                    x: 4,
                                    transition: { type: 'spring', stiffness: 320, damping: 28 },
                                  }
                            }
                            whileFocus={
                              reducedMotion
                                ? undefined
                                : {
                                    x: 4,
                                    transition: { type: 'spring', stiffness: 320, damping: 28 },
                                  }
                            }
                            className="writing-row"
                          >
                            <time
                              dateTime={post.date}
                              className="min-w-28 shrink-0 font-mono text-xs text-(--color-text-muted)"
                            >
                              {formatDate(post.date)}
                            </time>
                            <div className="flex-1">
                              <span className="writing-title block">{post.title}</span>
                            </div>
                            <span className="text-xs whitespace-nowrap text-(--color-text-muted)">
                              {post.readingTime} min read
                            </span>
                          </m.article>
                        </Link>
                      </m.div>
                    ))}
                  </AnimatePresence>
                </m.div>
              ) : null}
            </div>
          ) : null}

          <m.div variants={child} className="writing-view-all">
            <Link
              href="/writing"
              className="pill pill-cyan inline-flex items-center gap-2 transition hover:-translate-y-px"
            >
              <span>View all writing ({posts.length})</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
