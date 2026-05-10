// CONVICTION ENGINE v18.0 — SkillsMap
// Mobile-native:
//   • Tab row: overflow-x-auto, shrink-0 tabs, no flex-wrap on mobile.
//   • Grid: 2-col on mobile, 3 on md, 4 on lg, 5 on xl.
//   • Skill cards: compact padding on mobile (p-2.5), context tags hidden
//     on mobile to reduce density (shown on sm+).
//   • Bar fill animation: unchanged (framer-motion initial/animate pattern).
//
// ANIMATION CONTRACT (unchanged):
//   AnimatePresence handles tab switch. Inner items use initial/animate — NOT whileInView.
//   When animate is set to a string, Framer ignores viewport triggers.

import { ALL_PILLARS, SKILLS } from '@/lib/data/skills';
import { filterTransition } from '@/lib/motion';
import type { SkillNode, SkillPillar } from '@/lib/types';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import * as React from 'react';

const LEVEL_CONFIG = {
  expert:       { label: 'Expert',      width: '95%', barClassName: 'bg-cyan-400' },
  proficient:   { label: 'Proficient',  width: '70%', barClassName: 'bg-emerald-400' },
  foundational: { label: 'Foundational', width: '35%', barClassName: 'bg-white/35' },
} as const;

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
      className="border-border-subtle bg-surface-raised hover:border-border h-full rounded-lg border p-2.5 sm:p-3 transition-colors duration-200"
      aria-label={cardLabel}
    >
      {/* Pillar label: hidden on mobile to save space */}
      <p className="hidden sm:block mb-2 font-mono text-[10px] tracking-widest text-white/45 uppercase">
        {skill.pillar}
      </p>

      <div className="mb-2 flex items-center justify-between gap-1">
        <span className="text-text-primary truncate text-xs sm:text-sm leading-snug font-semibold">
          {skill.name}
        </span>
        <span className="text-text-muted shrink-0 text-[9px] sm:text-[10px] font-medium">
          {lvl.label}
        </span>
      </div>

      <div
        className="bg-border-subtle mb-2 h-[3px] w-full overflow-hidden rounded-full"
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

      {/* Context tags: only on sm+ to avoid mobile overload */}
      {(systemTags.length > 0 || metaTags.length > 0) && (
        <div className="hidden sm:flex flex-wrap gap-1 mt-1">
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

export function SkillsMap(): React.ReactElement {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = React.useState<'All' | SkillPillar>('All');

  const filtered: SkillNode[] = active === 'All' ? SKILLS : SKILLS.filter((s) => s.pillar === active);
  const tabs: Array<'All' | SkillPillar> = ['All', ...ALL_PILLARS];
  const activeCountLabel = active === 'All' ? `All skills — ${filtered.length}` : `${active} — ${filtered.length} skills`;

  return (
    <div className="space-y-5">
      {/* ── Tab row: overflow scroll on mobile ─────────────────────── */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
        role="group"
        aria-label="Filter skills by category"
      >
        {tabs.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              type="button"
              className={`
                shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium
                transition-all duration-200 min-h-[36px]
                focus:outline-none focus:ring-2 focus:ring-offset-1
                ${isActive
                  ? 'border-white/30 bg-white/10 text-white shadow-sm'
                  : 'border-border text-text-secondary hover:border-border/60 hover:text-text-primary bg-transparent'
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Live count ─────────────────────────────────────────────── */}
      <p
        aria-live="polite"
        className="font-mono text-[11px] tracking-widest text-white/40 uppercase"
      >
        {activeCountLabel}
      </p>

      {/* ── Skill grid ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <m.div
          key={active}
          id="skills-grid"
          aria-label={`${active} skills — ${filtered.length} items`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={prefersReduced ? { duration: 0 } : (filterTransition as Parameters<typeof m.div>[0]['transition'])}
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
                    : { delay: i * 0.018, duration: 0.2, ease: [0.16, 1, 0.3, 1] }
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