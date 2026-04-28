// CONVICTION ENGINE v10.0 — FULL REPLACEMENT
'use client';

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
  expert: { label: 'Expert', width: '95%', barClassName: 'bg-cyan-400' },
  proficient: { label: 'Proficient', width: '70%', barClassName: 'bg-emerald-400' },
  foundational: {
    label: 'Foundational',
    width: '35%',
    barClassName: 'bg-white/35',
  },
} as const;

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({
  skill,
  prefersReduced,
}: {
  readonly skill: SkillNode;
  readonly prefersReduced: boolean;
}): React.ReactElement {
  const lvl = LEVEL_CONFIG[skill.level];

  const systemTags = skill.tags
    .filter((t): t is Extract<typeof t, `used-in:${string}`> => t.startsWith('used-in:'))
    .map((t) => t.replace('used-in:', ''));

  const metaTags = skill.tags.filter((t) => !t.startsWith('used-in:'));

  const usedInLabel = systemTags.length ? ` — used in: ${systemTags.join(', ')}` : '';
  const cardLabel = `${skill.name} — ${lvl.label}${usedInLabel}`;

  return (
    <div
      className="border-border-subtle bg-surface-raised hover:border-border h-full rounded-lg border p-3 transition-colors duration-200"
      aria-label={cardLabel}
    >
      <p className="mb-2 font-mono text-[10px] tracking-widest text-white/45 uppercase">
        {skill.pillar}
      </p>

      <div className="mb-2 flex items-center justify-between gap-1">
        <span className="text-text-primary truncate text-sm leading-snug font-semibold">
          {skill.name}
        </span>
        <span className="text-text-muted shrink-0 text-[10px] font-medium">{lvl.label}</span>
      </div>

      <div
        className="bg-border-subtle mb-2.5 h-(--skill-bar-height) w-full overflow-hidden rounded-full"
        aria-label={`${skill.name} proficiency: ${lvl.label}`}
      >
        <m.div
          className={`h-full rounded-full ${lvl.barClassName}`}
          initial={{ width: prefersReduced ? lvl.width : '0%' }}
          animate={{ width: lvl.width }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
          }
        />
      </div>

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
  const prefersReduced = useReducedMotion();
  const [active, setActive] = React.useState<'All' | SkillPillar>('All');

  const filtered: SkillNode[] = active === 'All' ? SKILLS : SKILLS.filter((s) => s.pillar === active);

  const tabs: Array<'All' | SkillPillar> = ['All', ...ALL_PILLARS];
  const activeCountLabel = active === 'All' ? '' : `${active} — ${filtered.length} skills`;

  return (
    <div className="space-y-6">
      <div
        className="flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap"
        aria-label="Filter skills by category"
      >
        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`focus:ring-accent focus:ring-offset-bg shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                isActive
                  ? 'border-white/30 bg-white/10 text-white shadow-sm'
                  : 'border-border text-text-secondary hover:border-border/60 hover:text-text-primary bg-transparent'
              } `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="font-mono text-[11px] tracking-widest text-white/55 uppercase">
        {activeCountLabel}
      </p>

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
                <SkillCard skill={skill} prefersReduced={Boolean(prefersReduced)} />
              </m.li>
            ))}
          </ul>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
