"use client";
// components/Testimonials.tsx — Social Proof Engine
// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion:
//   • AnimatePresence with custom slide direction
//   • drag-to-swipe gesture for testimonial carousel
//   • whileInView stagger for stat row
//   • spring physics on card lift
// ─────────────────────────────────────────────────────────────────────────────

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TESTIMONIALS } from "@/lib/portfolio-data";
import {
  staggerContainer,
  staggerFast,
  fadeUp,
  testimonialSlide,
  springs,
} from "@/lib/motion";

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({
  initials,
  accent,
}: {
  initials: string;
  accent:   string;
}) {
  return (
    <motion.div
      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
      style={{
        background:  accent + "22",
        color:       accent,
        border:      `1.5px solid ${accent}44`,
      }}
      whileHover={{ scale: 1.08, borderColor: accent + "99" }}
      transition={springs.snappy}
      aria-hidden="true"
    >
      {initials}
    </motion.div>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  direction,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  direction:   number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      key={testimonial.id}
      className="liquid-glass bento-cell flex flex-col gap-5 w-full"
      style={{ borderColor: testimonial.accent + "33" }}
      custom={direction}
      variants={prefersReduced ? undefined : testimonialSlide}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
    >
      {/* Quote mark */}
      <div
        className="text-5xl font-serif leading-none select-none -mb-2"
        style={{ color: testimonial.accent + "44" }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <blockquote className="text-body text-secondary leading-relaxed flex-1">
        {testimonial.quote}
      </blockquote>

      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
        <Avatar initials={testimonial.initials} accent={testimonial.accent} />
        <div>
          <p className="text-body text-primary font-semibold leading-tight">
            {testimonial.name}
          </p>
          <p className="text-caption text-muted">
            {testimonial.title} · {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Proof stats ───────────────────────────────────────────────────────────────

const PROOF_STATS = [
  { icon: "🏢", value: "5+",   label: "Companies Served"    },
  { icon: "⭐", value: "100%", label: "Client Satisfaction" },
  { icon: "🔄", value: "3×",   label: "Repeat Engagements"  },
] as const;

// ── Main export ───────────────────────────────────────────────────────────────

export default function Testimonials() {
  const prefersReduced = useReducedMotion();
  const [[activeIdx, direction], setPage] = useState([0, 0]);

  const paginate = useCallback(
    (newDir: number) => {
      setPage(([cur]) => [
        (cur + newDir + TESTIMONIALS.length) % TESTIMONIALS.length,
        newDir,
      ]);
    },
    []
  );

  // Auto-advance
  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => paginate(1), 5200);
    return () => clearInterval(id);
  }, [paginate, prefersReduced]);

  const current = TESTIMONIALS[activeIdx]!;

  return (
    <section
      id="testimonials"
      className="section-gap max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      aria-labelledby="testimonials-heading"
    >
      {/* Header */}
      <motion.div
        className="mb-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p className="text-caption text-muted mb-2" variants={fadeUp}>
          Social Proof
        </motion.p>
        <motion.h2
          id="testimonials-heading"
          className="text-headline text-gradient-kinetic"
          variants={fadeUp}
        >
          What Clients Say
        </motion.h2>
        <motion.p
          className="text-subhead text-secondary mt-3 max-w-xl"
          variants={fadeUp}
        >
          Real feedback from teams I&apos;ve shipped production ML systems for.
        </motion.p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="liquid-glass rounded-2xl mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={springs.liquid}
      >
        <div className="grid grid-cols-3">
          {PROOF_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={cn(
                "flex flex-col sm:flex-row items-center gap-2 sm:gap-3 py-4 px-4 text-center sm:text-left",
                i < PROOF_STATS.length - 1 && "border-r border-white/[0.06]"
              )}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ ...springs.default, delay: i * 0.1 }}
            >
              <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
              <div>
                <p className="text-metric font-mono font-extrabold text-gradient-accent leading-none">
                  {stat.value}
                </p>
                <p className="text-caption text-muted mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <TestimonialCard
            key={current.id}
            testimonial={current}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <motion.button
          onClick={() => paginate(-1)}
          className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-muted hover:text-primary transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={springs.snappy}
          aria-label="Previous testimonial"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((t, i) => (
            <motion.button
              key={t.id}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`View testimonial from ${t.name}`}
              onClick={() =>
                setPage(([cur]) => [i, i > cur ? 1 : -1])
              }
              className="rounded-full transition-colors"
              animate={{
                width:      i === activeIdx ? 24 : 6,
                background: i === activeIdx
                  ? "var(--accent-primary)"
                  : "rgba(255,255,255,0.2)",
              }}
              style={{ height: 6 }}
              transition={springs.layout}
            />
          ))}
        </div>

        <motion.button
          onClick={() => paginate(1)}
          className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-muted hover:text-primary transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={springs.snappy}
          aria-label="Next testimonial"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </section>
  );
}
