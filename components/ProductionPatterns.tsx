"use client";
// components/ProductionPatterns.tsx — Architecture Depth Signal
// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion:
//   • whileInView stagger reveal
//   • AnimatePresence for expand/collapse description
//   • spring physics on card interactions
//   • layout animation for smooth height changes
// ─────────────────────────────────────────────────────────────────────────────

import { fadeUp, liquidCard, springs, staggerContainer, staggerSlow } from '@/lib/motion';
import { PRODUCTION_PATTERNS } from '@/lib/portfolio-data';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

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
  cyan:   { color: 'var(--color-cyan)',   dim: 'var(--color-cyan-surface)'   },
  teal:   { color: 'var(--color-live)',   dim: 'var(--color-live-glow)'      },
  violet: { color: 'var(--color-accent)', dim: 'var(--color-accent-surface)' },
};

// ── Pattern card ──────────────────────────────────────────────────────────────

function PatternCard({
  pattern,
}: Readonly<{
  pattern: (typeof PRODUCTION_PATTERNS)[number];
}>) {
  const prefersReduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const accent = ACCENT_STYLES[pattern.accent as keyof typeof ACCENT_STYLES];
  const Icon = ICONS[pattern.id];

  return (
    <m.div
      className="glass glass-medium flex cursor-pointer flex-col gap-5 rounded-(--radius-lg) p-6 sm:p-7"
      data-accent={pattern.accent}
      variants={liquidCard}
      whileHover={prefersReduced ? {} : { y: -4, boxShadow: 'var(--glass-shadow-hover)' }}
      whileTap={prefersReduced ? {} : { scale: 0.99 }}
      transition={springs.smooth}
      layout
      onClick={() => setExpanded((v) => !v)}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setExpanded((v) => !v);
        }
      }}
    >
      {/* Icon + header */}
      <div className="flex items-start gap-4">
        <m.div
          className="pattern-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          whileHover={prefersReduced ? {} : { rotate: 5, scale: 1.1 }}
          transition={springs.snappy}
        >
          {Icon && <Icon color={accent.color} />}
          </m.div>

        <div className="flex-1 text-left">
          <p className="label mb-0.5">{pattern.caption}</p>
          <h3 className="text-base font-semibold text-white">{pattern.title}</h3>
        </div>

        {/* Chevron */}
        <m.div
          className="pattern-chevron flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
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
          </m.div>
      </div>

      {/* Expandable description */}
      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            key="desc"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ ...springs.smooth, duration: 0.32 }}
            className="overflow-hidden"
          >
            <p className="text-base leading-7 text-(--color-text-secondary)">
              {pattern.description}
            </p>
          </m.div>
        )}
      </AnimatePresence>

      {/* Metrics */}
      <div className="mt-auto flex gap-6">
        {(pattern.metrics as ReadonlyArray<{ readonly value: string; readonly label: string }>).map(
          (metric) => (
            <div key={metric.label} className="flex flex-col gap-0.5">
              <m.span
                className="pattern-metric font-mono text-(length:--text-2xl) leading-none font-extrabold"
                whileHover={prefersReduced ? {} : { scale: 1.06 }}
                transition={springs.snappy}
              >
                {metric.value}
              </m.span>
              <span className="label">{metric.label}</span>
            </div>
          )
        )}
      </div>
    </m.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ProductionPatterns() {
  return (
    <section
      id="architecture"
      className="border-t border-(--color-border) py-28 sm:py-32"
      aria-labelledby="architecture-heading"
    >
      <div className="container">
        <m.div
          className="mb-12"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <m.span className="label" variants={fadeUp}>
            Architecture Depth
          </m.span>
          <m.h2
            id="architecture-heading"
            className="gradient-text mt-(--space-2)"
            variants={fadeUp}
          >
            Production Patterns
          </m.h2>
          <m.p
            className="mt-5 max-w-prose text-(length:--text-xl) leading-[1.8] text-(--color-text-secondary)"
            variants={fadeUp}
          >
            The architecture decisions behind systems that stay in production. Click any card to see
            the design rationale.
          </m.p>
        </m.div>

        <m.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {PRODUCTION_PATTERNS.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </m.div>

        {/* Philosophy callout */}
        <m.div
          className="glass glass-medium mt-8 rounded-(--radius-lg) p-6 sm:p-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--color-accent-surface) text-2xl"
              aria-hidden="true"
            >
              🏗️
            </div>
            <div>
              <span className="label">Engineering Philosophy</span>
              <h3 className="mt-3 font-semibold text-white">
                Systems over features. Observability by default. Zero manual deploys.
              </h3>
              <p className="mt-4 text-base leading-7 text-(--color-text-secondary)">
                Systems designed for the second year, not just the first sprint. Production systems
                ship with monitoring, retraining pipelines, and runbooks from day one.
              </p>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}