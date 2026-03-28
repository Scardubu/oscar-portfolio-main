"use client";
// components/ProductionPatterns.tsx — Architecture Depth Signal
// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion:
//   • whileInView stagger reveal
//   • AnimatePresence for expand/collapse description
//   • spring physics on card interactions
//   • layout animation for smooth height changes
// ─────────────────────────────────────────────────────────────────────────────

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PRODUCTION_PATTERNS } from "@/lib/portfolio-data";
import {
  staggerContainer,
  staggerSlow,
  fadeUp,
  liquidCard,
  springs,
} from "@/lib/motion";

// ── Pattern icons (inline SVG) ────────────────────────────────────────────────

const ICONS: Record<string, React.FC<{ color: string }>> = {
  mlops: ({ color }) => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="5"  cy="14" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="14" cy="5"  r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="23" cy="14" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="14" cy="23" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M8 12l3-5M17 7l3 5M20 16l-3 5M11 21l-3-5"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  inference: ({ color }) => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="2"  y="9"  width="8"  height="10" rx="2" stroke={color} strokeWidth="1.5" />
      <rect x="18" y="9"  width="8"  height="10" rx="2" stroke={color} strokeWidth="1.5" />
      <rect x="10" y="5"  width="8"  height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <line x1="10" y1="14" x2="2"  y2="14" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="18" y1="14" x2="26" y2="14" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
    </svg>
  ),
  zk: ({ color }) => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3l10 5.5v11L14 25 4 19.5V8.5z" stroke={color} strokeWidth="1.5" />
      <circle cx="14" cy="14" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M14 10v8M10 14h8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  observability: ({ color }) => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <polyline points="3,21 8,14 13,17 18,9 23,13 26,6"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8"  cy="14" r="1.5" fill={color} />
      <circle cx="18" cy="9"  r="1.5" fill={color} />
      <circle cx="26" cy="6"  r="1.5" fill={color} />
    </svg>
  ),
};

const ACCENT_STYLES = {
  cyan:   { color: "var(--accent-primary)",   dim: "var(--accent-primary-dim)",   cardClass: "liquid-glass-cyan"   },
  teal:   { color: "var(--accent-fintech)",   dim: "var(--accent-fintech-dim)",   cardClass: "liquid-glass-teal"   },
  violet: { color: "var(--accent-secondary)", dim: "var(--accent-secondary-dim)", cardClass: "liquid-glass-violet" },
};

// ── Pattern card ──────────────────────────────────────────────────────────────

function PatternCard({
  pattern,
}: {
  pattern: (typeof PRODUCTION_PATTERNS)[number];
}) {
  const prefersReduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const accent = ACCENT_STYLES[pattern.accent];
  const Icon = ICONS[pattern.id];

  return (
    <motion.div
      className={cn(
        "col-span-12 sm:col-span-6",
        "liquid-glass",
        accent.cardClass,
        "bento-cell flex flex-col gap-5 cursor-pointer"
      )}
      variants={liquidCard}
      whileHover={
        prefersReduced ? {} : { y: -4, boxShadow: "var(--shadow-liquid-3d-hover)" }
      }
      whileTap={prefersReduced ? {} : { scale: 0.99 }}
      transition={springs.liquid}
      layout
      onClick={() => setExpanded((v) => !v)}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded((v) => !v);
        }
      }}
    >
      {/* Icon + header */}
      <div className="flex items-start gap-4">
        <motion.div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: accent.dim }}
          whileHover={prefersReduced ? {} : { rotate: 5, scale: 1.1 }}
          transition={springs.bouncy}
        >
          {Icon && <Icon color={accent.color} />}
        </motion.div>

        <div className="flex-1 text-left">
          <p className="text-caption text-muted mb-0.5">{pattern.caption}</p>
          <h3 className="text-headline text-primary">{pattern.title}</h3>
        </div>

        {/* Chevron */}
        <motion.div
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: accent.dim, color: accent.color }}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={springs.snappy}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 3.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* Expandable description */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="desc"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ ...springs.liquid, duration: 0.4 }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-body text-secondary">{pattern.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics */}
      <div className="flex gap-6 mt-auto">
        {pattern.metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-0.5">
            <motion.span
              className="font-mono font-extrabold leading-none"
              style={{
                color: accent.color,
                fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
              }}
              whileHover={prefersReduced ? {} : { scale: 1.06 }}
              transition={springs.bouncy}
            >
              {m.value}
            </motion.span>
            <span className="text-caption text-muted">{m.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ProductionPatterns() {
  return (
    <section
      id="architecture"
      className="section-gap max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      aria-labelledby="architecture-heading"
    >
      <motion.div
        className="mb-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p className="text-caption text-muted mb-2" variants={fadeUp}>
          Architecture Depth
        </motion.p>
        <motion.h2
          id="architecture-heading"
          className="text-headline text-gradient-kinetic"
          variants={fadeUp}
        >
          Production Patterns
        </motion.h2>
        <motion.p
          className="text-subhead text-secondary mt-3 max-w-2xl"
          variants={fadeUp}
        >
          The architecture decisions behind systems that stay in production.
          Click any card to see the design rationale.
        </motion.p>
      </motion.div>

      <motion.div
        className="bento-grid"
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {PRODUCTION_PATTERNS.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </motion.div>

      {/* Philosophy callout */}
      <motion.div
        className="mt-8 liquid-glass liquid-glass-cyan bento-cell noise-overlay"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={springs.liquid}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <motion.div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "var(--accent-primary-dim)" }}
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={springs.bouncy}
            aria-hidden="true"
          >
            🏗️
          </motion.div>
          <div>
            <p className="text-caption text-muted mb-1">Engineering Philosophy</p>
            <h3 className="text-headline text-primary mb-2">
              Systems over features. Observability by default. Zero manual
              deploys.
            </h3>
            <p className="text-body text-secondary">
              I design for the second year, not just the first sprint. Every
              system I build ships with monitoring, retraining pipelines, and
              runbooks from day one.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
