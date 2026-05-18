// CONVICTION ENGINE v22.1 — SkillsMap
//
// v22.1 vs v22.0:
//   [FIX MICROCOPY-3]: LEVEL_CONFIG 'foundational' label: 'Found.' → 'Foundational'.
//     'Found.' is ambiguous at 9–10px mono text — it parses as past tense of
//     "find" before it parses as an abbreviated expertise tier. At the sizes
//     used in the skill card the extra characters fit on all breakpoints.
//     'Expert' and 'Pro' are short enough that no abbreviation was ever needed;
//     'Foundational' should not have been abbreviated either.
//   KEEP: All v22 filter tab logic, SkillCard layout, bar animations,
//     aria-pressed filter buttons, live count region, AnimatePresence grid.


//   [FIX]: Filter tab row — Responsive Failure resolved.
//     Previous: overflow-x-auto + no-scrollbar on all viewports.
//     Problem: "Backend & APIs", "Data & Storage", "DevOps & SRE" scroll
//       off the right edge with no visible affordance. Users on mobile
//       never discover the additional filter categories.
//       (Nielsen: zero hidden content — if the user can't see it, it doesn't exist)
//     Fix: flex-wrap at mobile so all 6 tabs are visible without any scroll.
//       At sm+ (640px), single-row with overflow-x-auto activates only if
//       the combined tab widths exceed viewport — consistent with WritingSection v22.1.
//     KEEP: All v21 shrink-0, min-h-[44px] touch targets, aria-pressed,
//       focus rings, spring bar animations, SkillCard layout.

import { ALL_PILLARS, SKILLS } from '@/lib/data/skills';
import { filterTransition } from '@/lib/motionVariants';
import type { SkillNode, SkillPillar } from '@/lib/types';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import * as React from 'react';

const LEVEL_CONFIG = {
  expert: {
    label: 'Expert',
    width: '95%',
    barColor: 'oklch(73% 0.18 196)',
    labelColor: 'var(--color-film-teal)',
  },
  proficient: {
    label: 'Pro',
    width: '70%',
    barColor: 'oklch(72% 0.17 160)',
    labelColor: 'oklch(72% 0.17 160)',
  },
  foundational: {
    label: 'Foundational',
    width: '35%',
    barColor: 'oklch(100% 0 0 / 0.3)',
    labelColor: 'var(--color-text-muted)',
  },
} as const;

function SkillCard({
  skill,
  prefersReduced,
  index,
}: {
  readonly skill: SkillNode;
  readonly prefersReduced: boolean;
  readonly index: number;
}): React.ReactElement {
  const lvl = LEVEL_CONFIG[skill.level];
  const isExpert = skill.level === 'expert';

  const systemTags = skill.tags
    .filter((t): t is Extract<typeof t, `used-in:${string}`> => t.startsWith('used-in:'))
    .map((t) => t.replace('used-in:', ''));

  const metaTags = skill.tags.filter((t) => !t.startsWith('used-in:'));
  const usedInLabel = systemTags.length ? ` — used in: ${systemTags.join(', ')}` : '';
  const cardLabel = `${skill.name} — ${LEVEL_CONFIG[skill.level].label}${usedInLabel}`;

  return (
    <m.div
      initial={prefersReduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : {
              delay: index * 0.016,
              type: 'spring',
              stiffness: 280,
              damping: 26,
            }
      }
      className="border-border-subtle bg-surface-raised hover:border-border h-full rounded-lg border p-2.5 sm:p-3 transition-colors duration-200"
      aria-label={cardLabel}
    >
      {/* Pillar: hidden on mobile */}
      <p className="hidden sm:block mb-2 font-mono text-[10px] tracking-widest text-white/40 uppercase truncate">
        {skill.pillar}
      </p>

      <div className="mb-2 flex items-center justify-between gap-1">
        <span className="text-text-primary truncate text-xs sm:text-sm leading-snug font-semibold">
          {skill.name}
        </span>
        <span
          className="shrink-0 text-[9px] sm:text-[10px] font-medium font-mono"
          style={{ color: lvl.labelColor }}
        >
          {lvl.label}
        </span>
      </div>

      {/* Proficiency bar */}
      <div
        className="mb-2 h-[3px] w-full overflow-hidden rounded-full"
        style={{ background: 'oklch(100% 0 0 / 0.08)' }}
        role="meter"
        aria-valuenow={
          skill.level === 'expert' ? 95 : skill.level === 'proficient' ? 70 : 35
        }
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency: ${LEVEL_CONFIG[skill.level].label}`}
      >
        <m.div
          style={{ background: lvl.barColor }}
          className="h-full rounded-full"
          initial={{ width: prefersReduced ? lvl.width : '0%' }}
          animate={{ width: lvl.width }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : {
                  delay: index * 0.016 + 0.1,
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                  mass: 1,
                }
          }
        />
      </div>

      {/* Context tags:
          - Expert: show on mobile (trust signal) — 1 system tag max
          - Proficient: show on sm+ only
          - Foundational: sm+ only */}
      {systemTags.length > 0 && (
        <div className={`flex flex-wrap gap-1 mt-1 ${isExpert ? '' : 'hidden sm:flex'}`}>
          {systemTags.slice(0, isExpert ? 1 : 3).map((tag) => (
            <span
              key={`sys-${tag}`}
              className="border-border-subtle bg-surface text-cyan rounded border px-1.5 py-0.5 text-[9px] font-semibold"
              aria-label={`Used in ${tag}`}
            >
              {tag}
            </span>
          ))}
          {!isExpert && metaTags.slice(0, 2).map((tag) => (
            <span
              key={`meta-${tag}`}
              className="border-border-subtle bg-surface text-text-muted rounded border px-1.5 py-0.5 text-[9px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </m.div>
  );
}

export function SkillsMap(): React.ReactElement {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = React.useState<'All' | SkillPillar>('All');

  const filtered: SkillNode[] =
    active === 'All' ? SKILLS : SKILLS.filter((s) => s.pillar === active);
  const tabs: Array<'All' | SkillPillar> = ['All', ...ALL_PILLARS];
  const liveLabel =
    active === 'All'
      ? `Showing all ${filtered.length} skills`
      : `${active} — ${filtered.length} skills`;

  return (
    <div className="space-y-5">
      {/*
        Filter tab row.
        v22 FIX (Responsive Failure — Nielsen: Zero Hidden Content):
          Mobile (<640px): flex-wrap so all 6 category tabs are visible without
          horizontal scroll. "Data & Storage" and "DevOps & SRE" were invisible
          to mobile users under the previous overflow-x-auto + no-scrollbar pattern.
          sm+ (≥640px): flex-nowrap + overflow-x-auto activates only if tab widths
          exceed viewport. Matches the WritingSection v22.1 pattern.
      */}
      <div
        className="flex flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto sm:pb-1"
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
              aria-pressed={isActive}
              className={[
                'shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium',
                'transition-all duration-200 min-h-[44px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                isActive
                  ? 'bg-white/10 text-white border border-white/25 shadow-sm'
                  : 'border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 bg-transparent',
              ].join(' ')}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Live count */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="font-mono text-[11px] tracking-widest uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {liveLabel}
      </p>

      {/* Skill grid */}
      <AnimatePresence mode="wait">
        <m.div
          key={active}
          id="skills-grid"
          aria-label={liveLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : (filterTransition as Parameters<typeof m.div>[0]['transition'])
          }
        >
          <ul className="grid list-none grid-cols-1 gap-2 p-0 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((skill, i) => (
              <li key={skill.id} className="h-full">
                <SkillCard
                  skill={skill}
                  prefersReduced={Boolean(prefersReduced)}
                  index={i}
                />
              </li>
            ))}
          </ul>
        </m.div>
      </AnimatePresence>
    </div>
  );
}