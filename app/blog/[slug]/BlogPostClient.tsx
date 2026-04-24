'use client';
// app/blog/[slug]/BlogPostClient.tsx

import { m, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';

import { fadeUp, springs, staggerContainer } from '@/lib/motion';
import { formatDate } from '@/lib/utils';

interface BlogPostClientProps {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  readingTime: string;
  children: React.ReactNode;
}

export default function BlogPostClient({
  title,
  description,
  date,
  updated,
  tags,
  readingTime,
  children,
}: BlogPostClientProps) {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <main id="main-content" tabIndex={-1} className="pt-20 pb-24 outline-none">
      {/* Reading progress bar */}
      {!prefersReduced && (
        <m.div
          className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
          // eslint-disable-next-line no-restricted-syntax
          style={{
            scaleX,
            background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-cyan) 100%)',
          }}
          aria-hidden="true"
        />
      )}

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <m.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.default}
          className="mb-10"
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 font-mono text-xs tracking-(--tracking-wide) text-(--color-text-muted) uppercase transition-colors hover:text-(--color-text-primary)"
          >
            <m.span
              className="inline-block"
              whileHover={{ x: -3 }}
              transition={springs.snappy}
              aria-hidden="true"
            >
              ←
            </m.span>
            Back to Blog
          </Link>
        </m.div>

        {/* Header */}
        <m.header className="mb-12" variants={staggerContainer} initial="hidden" animate="visible">
          {/* Tags */}
          <m.div className="mb-4 flex flex-wrap gap-2" variants={fadeUp}>
            {tags.map((tag) => (
              <m.span
                key={tag}
                className="tag"
                whileHover={{ scale: 1.06 }}
                transition={springs.bouncy}
              >
                {tag}
              </m.span>
            ))}
          </m.div>

          {/* Title */}
          <m.h1 className="mb-4 leading-tight text-white" variants={fadeUp}>
            {title}
          </m.h1>

          {/* Description */}
          <m.p
            className="mb-6 max-w-[62ch] text-(length:--text-xl) leading-[1.8] text-(--color-text-secondary)"
            variants={fadeUp}
          >
            {description}
          </m.p>

          {/* Meta */}
          <m.div
            className="flex flex-wrap items-center gap-4 border-t border-(--color-border) pt-4 font-mono text-xs text-(--color-text-muted)"
            variants={fadeUp}
          >
            <time dateTime={date}>{formatDate(date)}</time>
            {updated && updated !== date && <span>Updated {formatDate(updated)}</span>}
            <span>{readingTime}</span>
          </m.div>
        </m.header>

        {/* Content */}
        <m.div
          className="prose"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.default, delay: 0.3 }}
        >
          {children}
        </m.div>

        {/* Footer */}
        <m.footer
          className="mt-16 border-t border-(--color-border) pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...springs.default, delay: 0.2 }}
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="label">Written by</span>
              <p className="mt-2 font-semibold text-white">Oscar Ndugbu</p>
              <p className="label mt-1">Full-Stack ML Engineer</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/blog"
                className="inline-flex min-h-10 items-center rounded-(--radius-md) border border-(--color-border) px-4 py-2 font-mono text-xs text-(--color-text-secondary) uppercase transition hover:border-(--color-border-subtle) hover:text-(--color-text-primary)"
              >
                ← More posts
              </Link>
              <Link
                href="/#contact"
                className="inline-flex min-h-10 items-center rounded-(--radius-md) border border-(--color-accent) bg-(--color-accent) px-4 py-2 font-mono text-xs font-semibold text-white uppercase shadow-[0_0_20px_var(--color-accent-glow)] transition"
              >
                Work together →
              </Link>
            </div>
          </div>
        </m.footer>
      </article>
    </main>
  );
}
