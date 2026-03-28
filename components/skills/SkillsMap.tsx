'use client'

/**
 * components/skills/SkillsMap.tsx
 *
 * Working skills grid with filter tabs.
 * Replaces the broken "Loading visualization..." canvas component.
 *
 * ANIMATION CONTRACT:
 *   AnimatePresence handles tab switch transitions via key prop.
 *   Individual items use animate/initial — NOT whileInView.
 *   Reason: animate="visible" and whileInView are mutually exclusive.
 *   When animate is set to a string, Framer ignores viewport triggers.
 *   See lib/motion.ts comments for full explanation.
 *
 * All types imported from lib/types. SKILLS and ALL_PILLARS from lib/data/skills.
 */

import * as React        from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { filterTransition } from '@/lib/motion'
import { SKILLS, ALL_PILLARS } from '@/lib/data/skills'
import type { SkillNode, SkillPillar } from '@/lib/types'

// ─── Level configuration ──────────────────────────────────────────────────────

const LEVEL_CONFIG = {
  expert:       { width: 'w-full',  label: 'Expert',       barColor: 'bg-[color:var(--accent-primary)]'   },
  proficient:   { width: 'w-2/3',   label: 'Proficient',   barColor: 'bg-[color:var(--accent-secondary)]' },
  foundational: { width: 'w-1/3',   label: 'Foundational', barColor: 'bg-[color:var(--text-muted)]'       },
} as const

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({ skill }: { skill: SkillNode }): React.ReactElement {
  const lvl = LEVEL_CONFIG[skill.level]

  const systemTags = skill.tags
    .filter((t): t is `used-in:${string}` => t.startsWith('used-in:'))
    .map(t => t.replace('used-in:', ''))

  const metaTags = skill.tags.filter(t => !t.startsWith('used-in:'))

  const progressValue = skill.level === 'expert' ? 100 : skill.level === 'proficient' ? 66 : 33

  return (
    <div
      className="
        rounded-lg p-3
        border border-[color:var(--border-subtle)]
        bg-[color:var(--bg-elevated)]
        hover:border-[color:var(--border-default)]
        transition-colors duration-200
        h-full
      "
      role="listitem"
      aria-label={`${skill.name} — ${lvl.label}${systemTags.length ? ` — used in: ${systemTags.join(', ')}` : ''}`}
    >
      {/* Name and level label */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-sm font-semibold text-[color:var(--text-primary)] truncate leading-snug">
          {skill.name}
        </span>
        <span className="text-[10px] text-[color:var(--text-muted)] font-medium flex-shrink-0">
          {lvl.label}
        </span>
      </div>

      {/* Proficiency bar */}
      <div
        className="w-full h-1 bg-[color:var(--border-subtle)] rounded-full mb-2.5"
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency: ${lvl.label}`}
      >
        <div className={`h-full rounded-full ${lvl.width} ${lvl.barColor}`} />
      </div>

      {/* Context tags */}
      {(systemTags.length > 0 || metaTags.length > 0) && (
        <div className="flex flex-wrap gap-1">
          {systemTags.map(tag => (
            <span
              key={`sys-${tag}`}
              className="
                text-[9px] font-semibold px-1.5 py-0.5 rounded
                bg-[color:var(--bg-surface)]
                border border-[color:var(--border-subtle)]
                text-[color:var(--accent-fintech)]
              "
              aria-label={`Used in ${tag}`}
            >
              {tag}
            </span>
          ))}
          {metaTags.map(tag => (
            <span
              key={`meta-${tag}`}
              className="
                text-[9px] font-medium px-1.5 py-0.5 rounded
                bg-[color:var(--bg-surface)]
                border border-[color:var(--border-subtle)]
                text-[color:var(--text-muted)]
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SkillsMap(): React.ReactElement {
  const prefersReduced = useReducedMotion()
  const [active, setActive] = React.useState<'All' | SkillPillar>('All')

  const filtered: SkillNode[] = active === 'All'
    ? SKILLS
    : SKILLS.filter(s => s.pillar === active)

  const tabs: Array<'All' | SkillPillar> = ['All', ...ALL_PILLARS]

  return (
    <section
      className="space-y-6"
      aria-labelledby="skills-heading"
    >
      <h2 id="skills-heading" className="sr-only">Technical skills by pillar</h2>

      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter skills by pillar"
      >
        {tabs.map(tab => {
          const count = tab === 'All' ? SKILLS.length : SKILLS.filter(s => s.pillar === tab).length
          const isActive = active === tab

          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              aria-controls="skills-grid"
              onClick={() => setActive(tab)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium
                border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
                focus:ring-offset-1 focus:ring-offset-[color:var(--bg-base)]
                ${isActive
                  ? 'bg-[color:var(--accent-primary)] text-[color:var(--bg-base)] border-transparent shadow-sm'
                  : 'bg-transparent border-[color:var(--border-default)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]'
                }
              `}
            >
              {tab}
              <span className={`ml-1.5 text-[10px] font-normal ${isActive ? 'opacity-70' : 'opacity-50'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/*
        ANIMATION PATTERN (correct):
        AnimatePresence on the outer container handles mount/unmount
        when `active` changes (via key prop).
        Inner items use initial/animate — NOT whileInView.

        WRONG pattern (do not use):
          <motion.div animate="visible" viewport={...} />
        When animate is a string, Framer Motion ignores viewport triggers.
        The element animates immediately on mount, not on scroll.
      */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          id="skills-grid"
          role="tabpanel"
          aria-label={`${active} skills — ${filtered.length} items`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={prefersReduced ? { duration: 0 } : filterTransition}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
        >
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={prefersReduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReduced ? { duration: 0 } : {
                delay:    i * 0.02,
                duration: 0.2,
                ease:     [0.16, 1, 0.3, 1],
              }}
            >
              <SkillCard skill={skill} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Live count */}
      <p
        className="text-xs text-[color:var(--text-muted)]"
        aria-live="polite"
        aria-atomic="true"
      >
        Showing {filtered.length} of {SKILLS.length} skills
        {active !== 'All' && ` in ${active}`}
      </p>
    </section>
  )
}