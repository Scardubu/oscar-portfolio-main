// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// FIX — TypeError: can't access property "opacity" of undefined
//
// ROOT CAUSE:
//   `filterTransition` is exported from lib/motionVariants.ts as a `Variants` object:
//     { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, ... }, exit: { ... } }
//
//   It was being passed to the `transition` prop of `m.div`:
//     transition={filterTransition as Parameters<typeof m.div>[0]['transition']}
//
//   The `transition` prop expects a Transition config (e.g. { type, duration, stiffness }).
//   When framer-motion's internal resolver processes the animated properties (opacity, y),
//   it reads `transition.opacity` and `transition.y` — both `undefined` on a Variants object,
//   whose keys are `hidden`, `visible`, `exit`. Accessing `.opacity` on `undefined` throws:
//     TypeError: can't access property "opacity" of undefined
//
//   The TypeScript cast `as Parameters<typeof m.div>[0]['transition']` silenced the
//   compiler but did not fix the runtime type mismatch. This error fires once per
//   animated property per render cycle — producing 40–66 identical console errors
//   (matching the 62-skill grid mounting + filter-tab re-mount cycles).
//
// FIX:
//   Removed the `filterTransition` import entirely.
//   Replaced the misused Variants object with a correct Transition config inline:
//     { type: 'spring', stiffness: 300, damping: 28 }
//   This matches the physics used elsewhere in the motion vocabulary for filter
//   transitions (snappy spring, no mass override needed for a simple opacity+y).

import { ALL_PILLARS, SKILLS } from '@/lib/data/skills';
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
      className="border-border-subtle bg-surface-raised hover:border-border h-full rounded-lg border p-2.5 transition-colors duration-200 sm:p-3"
      aria-label={cardLabel}
    >
      {/* Pillar: hidden on mobile */}
      <p className="mb-2 hidden truncate font-mono text-[10px] tracking-widest text-white/40 uppercase sm:block">
        {skill.pillar}
      </p>

      <div className="mb-2 flex items-center justify-between gap-1">
        <span className="text-text-primary truncate text-xs leading-snug font-semibold sm:text-sm">
          {skill.name}
        </span>
        <span
          className="shrink-0 font-mono text-[9px] font-medium sm:text-[10px]"
          // eslint-disable-next-line no-restricted-syntax
          style={{ color: lvl.labelColor }}
        >
          {lvl.label}
        </span>
      </div>

      {/* Proficiency bar */}
      <div
        className="mb-2 h-[3px] w-full overflow-hidden rounded-full bg-[oklch(100%_0_0_/_0.08)]"
        role="meter"
        aria-valuenow={skill.level === 'expert' ? 95 : skill.level === 'proficient' ? 70 : 35}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency: ${LEVEL_CONFIG[skill.level].label}`}
      >
        <m.div
          // eslint-disable-next-line no-restricted-syntax
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
        <div className={`mt-1 flex flex-wrap gap-1 ${isExpert ? '' : 'hidden sm:flex'}`}>
          {systemTags.slice(0, isExpert ? 1 : 3).map((tag) => (
            <span
              key={`sys-${tag}`}
              className="border-border-subtle bg-surface text-cyan rounded border px-1.5 py-0.5 text-[9px] font-semibold"
              aria-label={`Used in ${tag}`}
            >
              {tag}
            </span>
          ))}
          {!isExpert &&
            metaTags.slice(0, 2).map((tag) => (
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
        className="flex flex-wrap gap-2 [scrollbar-width:none] sm:flex-nowrap sm:overflow-x-auto sm:pb-1"
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
                'shrink-0 rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap',
                'min-h-[44px] transition-all duration-200',
                'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none',
                isActive
                  ? 'border border-white/25 bg-white/10 text-white shadow-sm'
                  : 'border border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white/80',
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
        className="font-mono text-[11px] tracking-widest uppercase text-color-text-muted"
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
              : // FIX: was `filterTransition` (a Variants object — wrong type for `transition` prop).
                // Framer-motion tried to read transition.opacity → undefined → crash.
                // Correct fix: use a plain Transition config object.
                { type: 'spring', stiffness: 300, damping: 28 }
          }
        >
          <ul className="grid list-none grid-cols-1 gap-2 p-0 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((skill, i) => (
              <li key={skill.id} className="h-full">
                <SkillCard skill={skill} prefersReduced={Boolean(prefersReduced)} index={i} />
              </li>
            ))}
          </ul>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
