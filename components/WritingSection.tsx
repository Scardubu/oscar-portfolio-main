'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
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
      id="writing"
      ref={ref}
      aria-labelledby="writing-heading"
      className="border-t border-[color:var(--color-border)] py-20 sm:py-24"
    >
      <div className="container">
        <motion.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={child} className="mb-[var(--space-10)]">
            <motion.span variants={child} className="label">
              THE CUT
            </motion.span>
            <motion.h2 variants={child} id="writing-heading" className="mt-[var(--space-2)] text-white">
              Thoughts on engineering, teams, and the brutal honesty of production.
            </motion.h2>
            <motion.p variants={child} className="mt-[var(--space-4)] text-[length:var(--text-lg)]">
              Long-form breakdowns of shipping decisions, platform constraints, and what actually holds under load.
            </motion.p>
            <motion.div variants={child} className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`tag${activeFilter === 'ALL' ? ' tag--active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                ALL
              </button>
              {FILTER_LABELS.map((label) => (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  className={`tag${activeFilter === label ? ' tag--active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {featuredPost ? (
            <div className="grid gap-6">
              <motion.article variants={card} className="glass glass-full glass-chromatic rounded-[var(--radius-xl)] p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="pill pill-cyan">Featured</span>
                  <span className="badge-muted">{posts.length} published</span>
                </div>
                <h3 className="mt-5 max-w-[24ch] text-white">{featuredPost.title}</h3>
                <p className="mt-4 max-w-[72ch] text-base leading-7 text-white/65">{featuredPost.summary}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/55">
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
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300/50 hover:text-white"
                >
                  <span>Read article</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.article>

              {otherPosts.length ? (
                <motion.div variants={container} className="grid gap-2">
                  <AnimatePresence mode="popLayout">
                    {otherPosts.map((post) => (
                      <motion.div
                        key={post.slug}
                        variants={card}
                        exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                        layout
                      >
                        <Link href={`/writing/${post.slug}`} className="block">
                          <motion.article
                            whileHover={
                              reducedMotion
                                ? undefined
                                : { x: 4, transition: { type: 'spring', stiffness: 320, damping: 28 } }
                            }
                            whileFocus={
                              reducedMotion
                                ? undefined
                                : { x: 4, transition: { type: 'spring', stiffness: 320, damping: 28 } }
                            }
                            className="writing-row"
                          >
                            <time
                              dateTime={post.date}
                              className="min-w-28 shrink-0 font-mono text-xs text-[color:var(--color-text-muted)]"
                            >
                              {formatDate(post.date)}
                            </time>
                            <div className="flex-1">
                              <span className="writing-title block">{post.title}</span>
                            </div>
                            <span className="text-xs whitespace-nowrap text-[color:var(--color-text-muted)]">
                              {post.readingTime} min read
                            </span>
                          </motion.article>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : null}
            </div>
          ) : null}

          <motion.div variants={child} className="mt-[var(--space-8)]">
            <Link
              href="/writing"
              className="pill pill-cyan inline-flex items-center gap-2 transition hover:-translate-y-px"
            >
              <span>View all writing ({posts.length})</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
