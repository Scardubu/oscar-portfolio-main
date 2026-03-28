"use client";
// components/BentoFeaturedProjects.tsx — Proof Engine
// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion:
//   • whileInView staggered reveals for all cards
//   • spring physics on hover (lift + glow)
//   • layout animations for metric expansion
//   • scroll-driven horizontal parallax on feature card
// ─────────────────────────────────────────────────────────────────────────────

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PROJECTS } from "@/lib/portfolio-data";
import type { Project } from "@/lib/portfolio-data";
import {
  staggerContainer,
  staggerSlow,
  fadeUp,
  bentoCard,
  liquidCard,
  springs,
} from "@/lib/motion";

// ── Accent config ─────────────────────────────────────────────────────────────

const accentConfig = {
  cyan:   {
    cardClass:   "liquid-glass-cyan",
    textColor:   "var(--accent-primary)",
    dimColor:    "var(--accent-primary-dim)",
  },
  violet: {
    cardClass:   "liquid-glass-violet",
    textColor:   "var(--accent-secondary)",
    dimColor:    "var(--accent-secondary-dim)",
  },
  teal:   {
    cardClass:   "liquid-glass-teal",
    textColor:   "var(--accent-fintech)",
    dimColor:    "var(--accent-fintech-dim)",
  },
};

// ── Stack tag ─────────────────────────────────────────────────────────────────

function StackTag({ name }: { name: string }) {
  return (
    <motion.span
      className="badge badge-secondary font-mono text-[0.6rem]"
      whileHover={{ scale: 1.06 }}
      transition={springs.snappy}
    >
      {name}
    </motion.span>
  );
}

// ── Metric block ──────────────────────────────────────────────────────────────

function MetricBlock({
  value,
  label,
  type,
  accentColor,
}: {
  value:       string;
  label:       string;
  type:        string;
  accentColor: string;
}) {
  const typeColors: Record<string, string> = {
    live:        "var(--metric-live)",
    documented:  "var(--metric-documented)",
    backtested:  "var(--metric-backtested)",
    snapshot:    "var(--metric-snapshot)",
  };

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-mono font-extrabold leading-none"
        style={{
          fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
          color: accentColor,
        }}
      >
        {value}
      </span>
      <span className="text-caption text-muted leading-tight">{label}</span>
      <span
        className="text-[0.55rem] font-bold uppercase tracking-widest mt-0.5"
        style={{ color: typeColors[type] ?? typeColors["snapshot"] }}
      >
        {type}
      </span>
    </div>
  );
}

// ── Feature project card — large, 8-col ──────────────────────────────────────

function FeatureCard({ project }: { project: Project }) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const accent = accentConfig[project.accent];

  // Subtle horizontal parallax on scroll
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const parallaxX = useTransform(scrollYProgress, [0, 1], ["1%", "-1%"]);

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "col-span-12 lg:col-span-8",
        "liquid-glass",
        accent.cardClass,
        "bento-cell noise-overlay",
        "flex flex-col justify-between gap-6 min-h-[420px]"
      )}
      variants={bentoCard}
      whileHover={
        prefersReduced
          ? {}
          : {
              y: -5,
              boxShadow: "var(--shadow-liquid-3d-hover)",
            }
      }
      transition={springs.liquid}
      style={prefersReduced ? {} : { x: parallaxX }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-caption text-muted mb-1">{project.tagline}</p>
            <h3 className="text-headline text-primary">{project.title}</h3>
          </div>
          <motion.div
            className="flex flex-wrap gap-1.5"
            variants={staggerContainer}
          >
            {project.stack.map((s) => (
              <StackTag key={s} name={s} />
            ))}
          </motion.div>
        </div>
        <p className="text-body text-secondary max-w-2xl">{project.description}</p>
      </div>

      {/* Metrics grid — depth layer */}
      <div className="liquid-depth-layer p-4 sm:p-6">
        <p className="text-caption text-muted mb-4 uppercase tracking-widest">
          Production Metrics
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {project.metrics.map((m) => (
            <MetricBlock
              key={m.label}
              value={m.value}
              label={m.label}
              type={m.type}
              accentColor={accent.textColor}
            />
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        {project.links.caseStudy && (
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.03, y: -1 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            transition={springs.snappy}
          >
            <Link href={project.links.caseStudy} className="btn btn-primary">
              View Full Case Study →
            </Link>
          </motion.div>
        )}
        {project.links.demo && (
          <motion.a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            whileHover={prefersReduced ? {} : { scale: 1.02 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            transition={springs.snappy}
          >
            Live Demo ↗
          </motion.a>
        )}
        {project.links.repo && (
          <motion.a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            whileHover={prefersReduced ? {} : { scale: 1.02 }}
            transition={springs.snappy}
          >
            GitHub ↗
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

// ── Side metric bento — 4-col ─────────────────────────────────────────────────

function SideMetrics() {
  const prefersReduced = useReducedMotion();

  const cells = [
    {
      label:    "Active Users",
      value:    "350+",
      sub:      "Across live projects",
      accent:   "cyan",
      gradient: "text-gradient-accent",
    },
    {
      label:    "Avg. API Latency",
      value:    "87ms",
      sub:      "p50 production",
      accent:   "teal",
      gradient: "text-gradient-fintech",
    },
    {
      label:    "Test Coverage",
      value:    "90%+",
      sub:      "Hashablanca ZK platform",
      accent:   "violet",
      gradient: "",
      color:    "var(--accent-secondary)",
    },
  ] as const;

  return (
    <motion.div
      className="hidden lg:flex col-span-4 flex-col gap-[var(--bento-gap)]"
      variants={staggerSlow}
    >
      {cells.map((cell, i) => (
        <motion.div
          key={cell.label}
          className={cn(
            "liquid-glass flex flex-col gap-2 bento-cell-sm flex-1",
            cell.accent === "cyan"   && "liquid-glass-cyan",
            cell.accent === "teal"   && "liquid-glass-teal",
            cell.accent === "violet" && "liquid-glass-violet"
          )}
          variants={liquidCard}
          whileHover={
            prefersReduced
              ? {}
              : { y: -3, scale: 1.01 }
          }
          transition={springs.liquid}
        >
          <p className="text-caption text-muted">{cell.label}</p>
          <span
            className={cn(
              "font-mono font-extrabold leading-none",
              cell.gradient
            )}
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "color" in cell ? cell.color : undefined,
            }}
          >
            {cell.value}
          </span>
          <p className="text-caption text-muted">{cell.sub}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Supporting card ───────────────────────────────────────────────────────────

function SupportingCard({
  project,
  index,
}: {
  project: Project;
  index:   number;
}) {
  const prefersReduced = useReducedMotion();
  const accent = accentConfig[project.accent];

  return (
    <motion.div
      className={cn(
        "col-span-12 sm:col-span-6",
        "liquid-glass",
        accent.cardClass,
        "bento-cell",
        "flex flex-col justify-between gap-4 min-h-[300px]"
      )}
      variants={bentoCard}
      whileHover={
        prefersReduced
          ? {}
          : { y: -4, boxShadow: "var(--shadow-liquid-3d-hover)" }
      }
      transition={springs.liquid}
    >
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted">{project.tagline}</p>
        <h3 className="text-headline text-primary">{project.title}</h3>
        <p className="text-body text-secondary line-clamp-3">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <StackTag key={s} name={s} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {project.metrics.slice(0, 3).map((m) => (
          <MetricBlock
            key={m.label}
            value={m.value}
            label={m.label}
            type={m.type}
            accentColor={accent.textColor}
          />
        ))}
      </div>

      {project.links.caseStudy && (
        <motion.div
          whileHover={prefersReduced ? {} : { x: 3 }}
          transition={springs.snappy}
        >
          <Link
            href={project.links.caseStudy}
            className="btn btn-ghost self-start text-sm"
          >
            Read Case Study →
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function BentoFeaturedProjects() {
  const [featured, ...rest] = PROJECTS;

  return (
    <section
      id="projects"
      className="section-gap max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      aria-labelledby="projects-heading"
    >
      {/* Section header */}
      <motion.div
        className="mb-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p className="text-caption text-muted mb-2" variants={fadeUp}>
          Proof Engine
        </motion.p>
        <motion.h2
          id="projects-heading"
          className="text-headline text-gradient-kinetic"
          variants={fadeUp}
        >
          Featured Builds
        </motion.h2>
        <motion.p
          className="text-subhead text-secondary mt-3 max-w-2xl"
          variants={fadeUp}
        >
          Real products where I owned the full stack — from data pipelines and ML
          models to APIs and frontends. Everything here shipped to real users.
        </motion.p>
      </motion.div>

      {/* Bento grid */}
      <motion.div
        className="bento-grid"
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <FeatureCard project={featured!} />
        <SideMetrics />
        {rest.map((project, i) => (
          <SupportingCard key={project.id} project={project} index={i} />
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-14 flex flex-col items-center gap-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={springs.default}
      >
        <p className="text-subhead text-secondary">
          Have a production ML or AI product in mind?
        </p>
        <motion.div
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
        >
          <Link href="#contact" className="btn btn-primary">
            Let&apos;s talk about your use case →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
