// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// FIX — TypeError: can't access property "opacity" of undefined
//
// ROOT CAUSE:
//   A `Variants` object was previously being passed into the `transition` prop.
//   Framer Motion expects `transition` to be a plain Transition config, not a
//   variants object with `hidden` / `visible` / `exit` keys.
//
//   The unsafe pattern looked like this:
//     transition={filterTransition as Parameters<typeof m.div>[0]['transition']}
//
//   That cast satisfied TypeScript but still failed at runtime because Framer
//   Motion later tried to resolve `transition.opacity` and `transition.y`.
//   Those keys do not exist on a Transition object, producing the repeated
//   console error:
//
//     Uncaught TypeError: can't access property "opacity" of undefined
//
// FIX:
//   Keep `filterTransition` for variant-driven animation only.
//   Use a plain Transition config for the grid container swap.
//
//   This file now uses a dedicated `SKILL_GRID_TRANSITION` constant with the
//   correct Framer Motion shape, eliminating the crash while preserving the
//   entrance / exit behavior.

import { ALL_PILLARS, SKILLS } from '@/lib/data/skills';
import { SPRING_SMOOTH } from '@/lib/motion';
import type { SkillNode, SkillPillar } from '@/lib/types';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import * as React from 'react';

const SKILL_GRID_TRANSITION = SPRING_SMOOTH;

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
                'focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
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

      <p
        aria-live="polite"
        aria-atomic="true"
        className="text-color-text-muted font-mono text-[11px] tracking-widest uppercase"
      >
        {liveLabel}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={active}
          id="skills-grid"
          aria-label={liveLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={prefersReduced ? { duration: 0 } : SKILL_GRID_TRANSITION}
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
