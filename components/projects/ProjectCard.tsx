'use client'

/**
 * components/projects/ProjectCard.tsx
 *
 * Asymmetric system card that composes all evidence primitives:
 *   MetricBadge    — every number has a source
 *   SystemArc      — architecture is interrogatable
 *   ComplianceBadges — compliance is visible and defensible
 *   DecisionList   — trade-offs are explicit
 *   BlogBridge     — Tier 1 articles wired directly in
 *
 * VISUAL HIERARCHY:
 *   featured: true  → full-width, prominent, accent border
 *   featured: false → standard card, supporting role
 *
 * All types imported from lib/types — nothing redefined here.
 */

import * as React          from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce }     from '@/lib/motion'
import { MetricBadge }              from '@/components/ui/MetricBadge'
import { SystemArc }                from '@/components/projects/SystemArc'
import { ComplianceBadges }         from '@/components/projects/ComplianceBadges'
import { DecisionList }             from '@/components/projects/DecisionChip'
import { BlogBridge }               from '@/components/blog/BlogBridge'
import type { ProjectData }         from '@/lib/types'

// ─── Sub-components ───────────────────────────────────────────────────────────

function StackPill({ label }: { label: string }): React.ReactElement {
  return (
    <span className="
      inline-flex items-center px-2.5 py-1 rounded-md
      text-xs font-medium
      bg-[color:var(--bg-elevated)]
      border border-[color:var(--border-subtle)]
      text-[color:var(--text-secondary)]
    ">
      {label}
    </span>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project:    ProjectData
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectCard({ project, className = '' }: ProjectCardProps): React.ReactElement {
  const prefersReduced = useReducedMotion()
  const shouldAnimate  = !prefersReduced
  const isFeatured     = project.featured

  return (
    <motion.article
      variants={shouldAnimate ? fadeUp : {}}
      initial={shouldAnimate ? 'hidden' : false}
      whileInView={shouldAnimate ? 'visible' : undefined}
      viewport={shouldAnimate ? viewportOnce : undefined}
      className={`
        rounded-2xl overflow-hidden
        ${isFeatured
          ? 'border border-[color:var(--border-strong)] bg-[color:var(--bg-surface)]'
          : 'border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]'
        }
        ${className}
      `}
      aria-labelledby={`project-${project.id}-title`}
    >

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className={`p-6 pb-0 ${isFeatured ? 'pt-8' : 'pt-6'}`}>

        {/* Featured label */}
        {isFeatured && (
          <p className="
            text-[10px] font-bold tracking-widest uppercase mb-2
            text-[color:var(--accent-primary)]
          ">
            Featured System
          </p>
        )}

        {/* Title + external links row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h2
              id={`project-${project.id}-title`}
              className="text-headline text-[color:var(--text-primary)] leading-tight"
            >
              {project.name}
            </h2>
            <p className="text-sm text-[color:var(--text-secondary)] mt-1 leading-snug">
              {project.tagline}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-shrink-0 mt-0.5">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-3 py-1.5 rounded-lg text-xs font-semibold
                  bg-[color:var(--accent-primary)] text-[color:var(--bg-base)]
                  hover:brightness-110 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
                  focus:ring-offset-1 focus:ring-offset-[color:var(--bg-surface)]
                "
                aria-label={`View live demo of ${project.name}`}
              >
                Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-3 py-1.5 rounded-lg text-xs font-semibold
                  border border-[color:var(--border-default)]
                  text-[color:var(--text-secondary)]
                  hover:border-[color:var(--border-strong)]
                  hover:text-[color:var(--text-primary)]
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
                  focus:ring-offset-1 focus:ring-offset-[color:var(--bg-surface)]
                "
                aria-label={`View source code for ${project.name}`}
              >
                Code
              </a>
            )}
          </div>
        </div>

        {/* Context note for internal/non-public systems */}
        {project.contextNote && !project.demoUrl && !project.repoUrl && (
          <p className="
            text-[11px] text-[color:var(--text-muted)]
            bg-[color:var(--bg-elevated)]
            border border-[color:var(--border-subtle)]
            rounded-md px-3 py-1.5 mb-3
            inline-flex items-center gap-1.5
          ">
            <span aria-hidden="true">ℹ</span>
            {project.contextNote}
          </p>
        )}

        {/* Compliance badges */}
        <ComplianceBadges tags={project.compliance} className="mb-4" />

        {/* Technology stack */}
        <div className="flex flex-wrap gap-1.5 mb-6" role="list" aria-label="Technology stack">
          {project.stack.map(tech => (
            <StackPill key={tech} label={tech} />
          ))}
        </div>
      </div>

      {/* ── DESCRIPTION ────────────────────────────────────────────────────── */}
      <div className="px-6 mb-6">
        <p className="text-body leading-relaxed">{project.description}</p>
      </div>

      {/* ── METRICS GRID ────────────────────────────────────────────────────── */}
      {project.metrics.length > 0 && (
        <div className="px-6 mb-6">
          <p className="text-caption mb-4" style={{ color: 'var(--text-muted)' }}>
            Verified system metrics
          </p>
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-5"
            role="list"
            aria-label="System metrics with verified sources"
          >
            {project.metrics.map(metric => (
              <div key={metric.label} role="listitem">
                <MetricBadge
                  value={metric.value}
                  label={metric.label}
                  badge={metric.badge}
                  sourceLabel={metric.sourceLabel}
                  sourceHref={metric.sourceHref}
                  sublabel={metric.sublabel}
                  size="md"
                  animate={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ARCHITECTURE ARC ─────────────────────────────────────────────── */}
      <div className="px-6 mb-6">
        <SystemArc stages={project.arc} system={project.id} />
      </div>

      {/* ── ARCHITECTURE DECISIONS ──────────────────────────────────────── */}
      {project.decisions.length > 0 && (
        <div className="px-6 mb-6">
          <p className="text-caption mb-3" style={{ color: 'var(--text-muted)' }}>
            Architecture decisions
          </p>
          <DecisionList records={project.decisions} />
        </div>
      )}

      {/* ── BLOG BRIDGE (Tier 1 only) ────────────────────────────────────── */}
      {project.blog && (
        <div className="px-6 pb-6">
          <p className="text-caption mb-3" style={{ color: 'var(--text-muted)' }}>
            Implementation deep dive
          </p>
          <BlogBridge {...project.blog} />
        </div>
      )}

      {/* ── BLOG GAP INDICATOR (systems without a Tier 1 article yet) ─────── */}
      {!project.blog && (
        <div className="px-6 pb-6">
          <div className="
            rounded-lg border border-dashed border-[color:var(--border-subtle)]
            bg-[color:var(--bg-elevated)]
            p-4
          ">
            <p className="text-[10px] font-bold tracking-widest uppercase text-[color:var(--text-muted)] mb-1">
              Implementation article
            </p>
            <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">
              Deep dive in progress — covering architecture decisions, failure modes,
              and the production trade-offs that shaped this system.
            </p>
          </div>
        </div>
      )}

    </motion.article>
  )
}