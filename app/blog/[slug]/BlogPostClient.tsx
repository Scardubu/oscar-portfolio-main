'use client';
// app/blog/[slug]/BlogPostClient.tsx

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { formatDate } from '@/lib/utils';
import { staggerContainer, fadeUp, springs } from '@/lib/motion';

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
    <main id="main-content" tabIndex={-1} className="pb-24 pt-20 outline-none">
      {/* Reading progress bar */}
      {!prefersReduced && (
        <motion.div
          className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
          style={{
            scaleX,
            background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-cyan) 100%)',
          }}
          aria-hidden="true"
        />
      )}

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.default}
          className="mb-10"
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 font-mono text-xs tracking-[var(--tracking-wide)] text-[color:var(--color-text-muted)] uppercase transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <motion.span
              className="inline-block"
              whileHover={{ x: -3 }}
              transition={springs.snappy}
              aria-hidden="true"
            >
              ←
            </motion.span>
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mb-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Tags */}
          <motion.div className="mb-4 flex flex-wrap gap-2" variants={fadeUp}>
            {tags.map((tag) => (
              <motion.span
                key={tag}
                className="tag"
                whileHover={{ scale: 1.06 }}
                transition={springs.bouncy}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1 className="mb-4 leading-tight text-white" variants={fadeUp}>
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mb-6 max-w-[62ch] text-[length:var(--text-xl)] leading-[1.8] text-[color:var(--color-text-secondary)]"
            variants={fadeUp}
          >
            {description}
          </motion.p>

          {/* Meta */}
          <motion.div
            className="flex flex-wrap items-center gap-4 border-t border-[color:var(--color-border)] pt-4 font-mono text-xs text-[color:var(--color-text-muted)]"
            variants={fadeUp}
          >
            <time dateTime={date}>{formatDate(date)}</time>
            {updated && updated !== date && (
              <span>Updated {formatDate(updated)}</span>
            )}
            <span>{readingTime}</span>
          </motion.div>
        </motion.header>

        {/* Content */}
        <motion.div
          className="prose"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.default, delay: 0.3 }}
        >
          {children}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-16 border-t border-[color:var(--color-border)] pt-8"
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
                className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-4 py-2 font-mono text-xs text-[color:var(--color-text-secondary)] uppercase transition hover:border-[color:var(--color-border-subtle)] hover:text-[color:var(--color-text-primary)]"
              >
                ← More posts
              </Link>
              <Link
                href="/#contact"
                className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-[color:var(--color-accent)] bg-[color:var(--color-accent)] px-4 py-2 font-mono text-xs font-semibold text-white uppercase shadow-[0_0_20px_var(--color-accent-glow)] transition"
              >
                Work together →
              </Link>
            </div>
          </div>
        </motion.footer>
      </article>
    </main>
  );
}
