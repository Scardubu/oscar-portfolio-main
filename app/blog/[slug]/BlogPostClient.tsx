"use client";
// app/blog/[slug]/BlogPostClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion:
//   • useScroll + useTransform: reading progress bar
//   • stagger entrance for header elements
//   • spring hover on tag badges
// ─────────────────────────────────────────────────────────────────────────────

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { staggerContainer, fadeUp, springs } from "@/lib/motion";

interface BlogPostClientProps {
  title:       string;
  description: string;
  date:        string;
  updated?:    string;
  tags:        string[];
  readingTime: string;
  children:    React.ReactNode;
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
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping:   30,
    restDelta: 0.001,
  });

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="outline-none pt-20 pb-24"
    >
      {/* Reading progress bar */}
      {!prefersReduced && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[var(--z-toast)]"
          style={{
            scaleX,
            background: "var(--gradient-accent)",
          }}
          aria-hidden="true"
        />
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.default}
          className="mb-10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-caption text-muted hover:text-primary transition-colors no-underline group"
          >
            <motion.span
              className="inline-block"
              whileHover={{ x: -3 }}
              transition={springs.snappy}
              aria-hidden="true"
            >
              ←
            </motion.span>
            <span className="group-hover:text-primary transition-colors">
              Back to Blog
            </span>
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
          <motion.div className="flex flex-wrap gap-2 mb-4" variants={fadeUp}>
            {tags.map((tag) => (
              <motion.span
                key={tag}
                className="badge badge-primary text-[0.6rem]"
                whileHover={{ scale: 1.06 }}
                transition={springs.bouncy}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-display text-primary mb-4 leading-tight"
            variants={fadeUp}
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-subhead text-secondary mb-6"
            variants={fadeUp}
          >
            {description}
          </motion.p>

          {/* Meta */}
          <motion.div
            className="flex flex-wrap items-center gap-4 text-caption text-muted border-t border-white/[0.06] pt-4"
            variants={fadeUp}
          >
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true">📅</span>
              <time dateTime={date}>{formatDate(date)}</time>
            </div>
            {updated && updated !== date && (
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true">🔄</span>
                <span>Updated {formatDate(updated)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true">⏱</span>
              <span>{readingTime}</span>
            </div>
          </motion.div>
        </motion.header>

        {/* Content */}
        <motion.div
          className="prose-blog"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.default, delay: 0.3 }}
        >
          {children}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-16 pt-8 border-t border-white/[0.06]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...springs.default, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-caption text-muted mb-1">Written by</p>
              <p className="text-body text-primary font-semibold">
                Oscar Ndugbu
              </p>
              <p className="text-caption text-muted">Full-Stack ML Engineer</p>
            </div>
            <div className="flex gap-3">
              <Link href="/blog" className="btn btn-ghost text-sm">
                ← More Posts
              </Link>
              <Link href="/#contact" className="btn btn-primary text-sm">
                Work Together →
              </Link>
            </div>
          </div>
        </motion.footer>
      </article>
    </main>
  );
}
