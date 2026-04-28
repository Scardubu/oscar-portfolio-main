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

import { ALL_PILLARS, SKILLS } from '@/lib/data/skills';
import { filterTransition } from '@/lib/motion';
import type { SkillNode, SkillPillar } from '@/lib/types';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import * as React from 'react';

// ─── Level configuration ──────────────────────────────────────────────────────

const LEVEL_CONFIG = {
  expert: { label: 'Expert' },
  proficient: { label: 'Proficient' },
  foundational: { label: 'Foundational' },
} as const;

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({ skill }: { readonly skill: SkillNode }): React.ReactElement {
  const lvl = LEVEL_CONFIG[skill.level];

  const systemTags = skill.tags
    .filter((t): t is Extract<typeof t, `used-in:${string}`> => t.startsWith('used-in:'))
    .map((t) => t.replace('used-in:', ''));

  const metaTags = skill.tags.filter((t) => !t.startsWith('used-in:'));

  let progressValue: number;
  if (skill.level === 'expert') {
    progressValue = 95;
  } else if (skill.level === 'proficient') {
    progressValue = 70;
  } else {
    progressValue = 35;
  }

  const usedInLabel = systemTags.length ? ` — used in: ${systemTags.join(', ')}` : '';
  const cardLabel = `${skill.name} — ${lvl.label}${usedInLabel}`;

  return (
    <div
      className="border-border-subtle bg-surface-raised hover:border-border h-full rounded-lg border p-3 transition-colors duration-200"
      aria-label={cardLabel}
    >
      {/* Name and level label */}
      <div className="mb-2 flex items-center justify-between gap-1">
        <span className="text-text-primary truncate text-sm leading-snug font-semibold">
          {skill.name}
        </span>
        <span className="text-text-muted shrink-0 text-[10px] font-medium">{lvl.label}</span>
      </div>

      {/* Proficiency bar */}
      <progress
        className="[&::-webkit-progress-bar]:bg-border-subtle mb-2.5 h-1 w-full rounded-full [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full"
        data-level={skill.level}
        value={progressValue}
        max={100}
        aria-label={`${skill.name} proficiency: ${lvl.label}`}
      />

      {/* Context tags */}
      {(systemTags.length > 0 || metaTags.length > 0) && (
        <div className="flex flex-wrap gap-1">
          {systemTags.map((tag) => (
            <span
              key={`sys-${tag}`}
              className="border-border-subtle bg-surface text-cyan rounded border px-1.5 py-0.5 text-[9px] font-semibold"
              aria-label={`Used in ${tag}`}
            >
              {tag}
            </span>
          ))}
          {metaTags.map((tag) => (
            <span
              key={`meta-${tag}`}
              className="border-border-subtle bg-surface text-text-muted rounded border px-1.5 py-0.5 text-[9px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
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
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter skills by pillar">
        {tabs.map((tab) => {
          const count =
            tab === 'All' ? SKILLS.length : SKILLS.filter((s) => s.pillar === tab).length;
          const isActive = active === tab;

          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive ? 'true' : 'false'}
              aria-controls="skills-grid"
              onClick={() => setActive(tab)}
              className={`focus:ring-accent focus:ring-offset-bg rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                isActive
                  ? 'bg-accent text-bg border-transparent shadow-sm'
                  : 'border-border text-text-secondary hover:border-border/60 hover:text-text-primary bg-transparent'
              } `}
            >
              {tab}
              <span
                className={`ml-1.5 text-[10px] font-normal ${isActive ? 'opacity-70' : 'opacity-50'}`}
              >
                {count}
              </span>
            </button>
          );
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
        <m.div
          key={active}
          id="skills-grid"
          role="tabpanel"
          aria-label={`${active} skills — ${filtered.length} items`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={prefersReduced ? { duration: 0 } : filterTransition}
        >
          <ul className="grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((skill, i) => (
              <m.li
                key={skill.id}
                initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        delay: i * 0.02,
                        duration: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
              >
                <SkillCard skill={skill} />
              </m.li>
            ))}
          </ul>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
