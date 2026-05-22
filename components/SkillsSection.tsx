'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// Skills section v31 — L1 / L2 / L3 progressive disclosure architecture.
//
// L1  Core trust layer (immediate): header + outcome metrics + viewport-capped
//     canonical skills (mobile: 6, tablet: 8, desktop: 10). System 1 readers
//     reach conviction in <5 s before any full-explorer content mounts.
// L2  Technical lineage (immediate): system × skill provenance strip showing
//     exactly which tool powers which live system.
// L3  Full explorer (gated — user-initiated): SkillsMap with pillar tabs.
//     Depth available on demand; never auto-rendered before L1/L2 land.
//     The SkillsMap component is only mounted after the user explicitly opens
//     the explorer, eliminating the DATABASE_DUMP_EFFECT on first paint.
//
// Canonical sources:
//   getCoreProductionSkills()   →  lib/data/skills.ts (L1 skill set)
//   SYSTEM_LINEAGE              →  lib/data/skills.ts (L2 provenance)
//   SkillsMap                   →  components/skills/SkillsMap.tsx (L3)

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ChapterFrame } from '@/components/cinematic/ChapterFrame';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { SkillsMap } from '@/components/skills/SkillsMap';
import { getChapterBySectionId } from '@/lib/cinematic/chapters';
import { anchorUrl } from '@/lib/config';
import { getCoreProductionSkills, SYSTEM_LINEAGE } from '@/lib/data/skills';
import { clipReveal, fadeRise, noMotion } from '@/lib/motionVariants';
import type { SkillLevel, SkillNode } from '@/lib/types';

// ── Level display config ──────────────────────────────────────────────────────
// Local copy for compact L1 cards only.
// SkillsMap maintains its own equivalent for the full explorer.
const LEVEL_DISPLAY: Record<
  SkillLevel,
  { label: string; color: string; barColor: string; barWidth: string }
> = {
  expert: {
    label: 'Expert',
    color: 'var(--color-film-teal)',
    barColor: 'oklch(73% 0.18 196)',
    barWidth: '95%',
  },
  proficient: {
    label: 'Pro',
    color: 'oklch(72% 0.17 160)',
    barColor: 'oklch(72% 0.17 160)',
    barWidth: '70%',
  },
  foundational: {
    label: 'Foundational',
    color: 'var(--color-text-muted)',
    barColor: 'oklch(100% 0 0 / 0.3)',
    barWidth: '35%',
  },
};

// ── Trust metrics ─────────────────────────────────────────────────────────────
// Values are consistent with CONVICTION_STATS in lib/portfolio-data.ts.
// `sub` field provides Skills-specific tool context not present in the global stat record.
const TRUST_METRICS = [
  {
    value: '4h → 15min',
    label: 'tax filing time',
    sub: 'TaxBridge · Fastify 5 · PostgreSQL 15 RLS',
    color: 'var(--color-film-teal)',
    borderColor: 'oklch(70% 0.21 188 / 0.22)',
  },
  {
    value: '99.9%+',
    label: 'sustained uptime',
    sub: 'SabiScore · XGBoost · LightGBM · Prometheus',
    color: 'oklch(72% 0.17 160)',
    borderColor: 'oklch(72% 0.17 160 / 0.22)',
  },
  {
    value: 'Self-improving',
    label: 'AI agent fleet',
    sub: 'SwarmXQ · Ollama GGUF · Checkpoint Recovery',
    color: 'oklch(75% 0.16 300)',
    borderColor: 'oklch(75% 0.16 300 / 0.22)',
  },
] as const;

const TOTAL_SKILL_COUNT = 62;
const MOBILE_CORE_COUNT = 6;
const TABLET_CORE_COUNT = 8;
const DESKTOP_CORE_COUNT = 10;

function getInitialCoreSkillCount() {
  if (typeof window === 'undefined') return MOBILE_CORE_COUNT;
  if (window.innerWidth >= 1024) return DESKTOP_CORE_COUNT;
  if (window.innerWidth >= 768) return TABLET_CORE_COUNT;
  return MOBILE_CORE_COUNT;
}

// ── L1 Core Skill Card ────────────────────────────────────────────────────────
function CoreSkillCard({
  skill,
  index,
  reducedMotion,
  shouldAnimate,
}: {
  skill: SkillNode;
  index: number;
  reducedMotion: boolean;
  shouldAnimate: boolean;
}) {
  const lvl = LEVEL_DISPLAY[skill.level];
  const systemTags = skill.tags
    .filter((t) => t.startsWith('used-in:'))
    .map((t) => t.replace('used-in:', ''));
  const projectLabel = systemTags.slice(0, 2).join(' · ');
  const valuenow = skill.level === 'expert' ? 95 : skill.level === 'proficient' ? 70 : 35;

  return (
    <div
      data-cinematic="card"
      className="glass-surface flex h-full min-w-0 flex-col gap-2 rounded-[var(--radius-md)] p-3"
      // eslint-disable-next-line no-restricted-syntax
      style={{ borderTop: `2px solid ${lvl.color}30` }}
      aria-label={`${skill.name} — ${lvl.label}${projectLabel ? ` — ${projectLabel}` : ''}`}
    >
      <span
        className="shrink-0 font-mono text-[9px] font-semibold tracking-widest uppercase"
        // eslint-disable-next-line no-restricted-syntax
        style={{ color: lvl.color }}
      >
        {lvl.label}
      </span>

      <span className="text-color-text-primary text-xs leading-tight font-semibold break-words">
        {skill.name}
      </span>

      {projectLabel ? (
        <span
          className="text-color-text-muted font-mono text-[8px] leading-tight break-words"
          title={systemTags.join(' · ')}
        >
          {projectLabel}
        </span>
      ) : null}

      <div
        className="mt-auto h-[2px] w-full overflow-hidden rounded-full bg-[oklch(100%_0_0_/_0.07)]"
        role="meter"
        aria-valuenow={valuenow}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        <m.div
          className="h-full rounded-full"
          // eslint-disable-next-line no-restricted-syntax
          style={{ background: lvl.barColor }}
          initial={{ width: '0%' }}
          animate={{ width: shouldAnimate || reducedMotion ? lvl.barWidth : '0%' }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  delay: index * 0.04 + 0.08,
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                  mass: 1,
                }
          }
        />
      </div>
    </div>
  );
}

// ── L2 System Lineage Row ─────────────────────────────────────────────────────
function SystemLineageRow({
  system,
  accent,
  skills,
}: {
  system: string;
  accent: string;
  skills: SkillNode[];
}) {
  return (
    <div
      data-cinematic="panel"
      className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:gap-3"
    >
      <span
        className="shrink-0 font-mono text-[9px] font-semibold tracking-widest uppercase sm:w-[5.5rem] sm:pt-0.5"
        // eslint-disable-next-line no-restricted-syntax
        style={{ color: accent }}
      >
        {system}
      </span>
      <div className="flex min-w-0 flex-wrap gap-1">
        {skills.map((s) => (
          <span
            key={s.id}
            className="border-color-border text-color-text-secondary rounded border bg-[oklch(100%_0_0_/_0.015)] px-1.5 py-0.5 font-mono text-[9px] tracking-wide"
          >
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export function SkillsSection() {
  const reducedMotion = useReducedMotion() ?? false;
  const chapter = getChapterBySectionId('skills');
  const [coreVisibleCount, setCoreVisibleCount] = useState(MOBILE_CORE_COUNT);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const child = reducedMotion ? noMotion : fadeRise;
  const coreSkills = getCoreProductionSkills();
  const visibleCoreSkills = coreSkills.slice(0, coreVisibleCount);
  const hiddenCoreSkillCount = coreSkills.length - visibleCoreSkills.length;

  useEffect(() => {
    const updateSkillDensity = () => {
      setCoreVisibleCount(getInitialCoreSkillCount());
    };

    updateSkillDensity();
    window.addEventListener('resize', updateSkillDensity);
    return () => window.removeEventListener('resize', updateSkillDensity);
  }, []);

  return (
    <ChapterFrame chapter={chapter} ariaLabelledBy="skills-heading" className="border-color-border">
      <div>
        {/* ── L1: Header ─────────────────────────────────────────────── */}
        <m.div variants={child} className="mb-10 sm:mb-12">
          <SectionIntro
            eyebrowNumber="03"
            eyebrowLabel="Skills"
            headingId="skills-heading"
            title={<>The stack behind systems that hold.</>}
            description={
              '62 tools deployed under NRS audit pressure, 99.9%+ uptime targets, and multi-tenant compliance constraints. Every skill maps to a decision made in production — not a tutorial, not a certification exercise, not a side project.'
            }
            eyebrowVariant={child}
            titleVariant={reducedMotion ? child : clipReveal}
            descriptionVariant={child}
            titleClassName="text-color-text-primary mt-3 max-w-[22ch]"
            descriptionClassName="text-color-text-secondary mt-4 max-w-[52ch] text-sm leading-8 [overflow-wrap:break-word] sm:text-base lg:mt-0"
          />

          {/* L1: Outcome-first trust metrics */}
          <div
            data-cinematic="proof"
            className="mt-6 grid gap-3 sm:grid-cols-3"
            aria-label="System outcomes linked to skills"
          >
            {TRUST_METRICS.map(({ value, label, sub, color, borderColor }) => (
              <div
                key={label}
                className="border-color-border rounded-[var(--radius-md)] border bg-[oklch(100%_0_0_/_0.02)] p-4"
                // eslint-disable-next-line no-restricted-syntax
                style={{
                  borderTop: `2px solid ${borderColor}`,
                }}
              >
                <p
                  className="font-mono text-sm font-semibold"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ color }}
                >
                  {value}
                </p>
                <p className="text-color-text-primary mt-0.5 text-xs font-medium">{label}</p>
                <p className="text-color-text-muted mt-1 font-mono text-[9px] tracking-wide">
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </m.div>

        {/* ── L1: Core skills grid — 12 canonical production skills ─── */}
        <m.div variants={child} className="mb-3">
          <p className="text-color-text-muted mb-3 font-mono text-[10px] tracking-widest uppercase">
            Core production stack
          </p>
          <p className="text-color-text-muted max-w-[60ch] text-xs leading-6 sm:text-sm">
            Default view is intentionally curated for fast trust. Open the full explorer only when
            you want deep implementation coverage across all {TOTAL_SKILL_COUNT} tools.
          </p>
        </m.div>

        <m.div
          variants={child}
          className="mb-10 grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          aria-label="Core production skills — top 12"
          role="list"
        >
          {visibleCoreSkills.map((skill, idx) => (
            <div key={skill.id} role="listitem">
              <CoreSkillCard
                skill={skill}
                index={idx}
                reducedMotion={reducedMotion}
                shouldAnimate={true}
              />
            </div>
          ))}
        </m.div>

        {hiddenCoreSkillCount > 0 ? (
          <m.p
            variants={child}
            className="text-color-text-muted mb-10 font-mono text-[11px] tracking-wider"
          >
            +{hiddenCoreSkillCount} more in the full explorer below.
          </m.p>
        ) : null}

        {/* ── L2: System lineage strip — always visible ─────────────── */}
        <m.div variants={child} className="mb-12">
          <p className="text-color-text-muted mb-3 font-mono text-[10px] tracking-widest uppercase">
            Production system × skill lineage
          </p>
          <div
            data-cinematic="panel"
            className="border-color-border space-y-3 rounded-[var(--radius-lg)] border bg-[oklch(100%_0_0_/_0.015)] p-4 sm:p-5"
            aria-label="Which skills power each live production system"
          >
            {SYSTEM_LINEAGE.map(({ system, accent, skills }) => (
              <SystemLineageRow key={system} system={system} accent={accent} skills={skills} />
            ))}
          </div>
        </m.div>

        {/* ── L3: Full interactive SkillsMap — tabbed by pillar ─────────── */}
        <div className="border-color-border-subtle border-t pt-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-color-text-muted font-mono text-[10px] tracking-widest uppercase">
                Full explorer · {TOTAL_SKILL_COUNT} tools · 8 pillars
              </p>
              <p className="text-color-text-muted mt-2 max-w-[60ch] text-xs leading-6 sm:text-sm">
                Expanded layer for CTO and engineer-level scrutiny. Optional by design to preserve
                reading momentum for recruiters and founders.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsExplorerOpen((v) => !v)}
              data-cinematic="cta"
              aria-expanded={isExplorerOpen}
              aria-controls="skills-explorer-panel"
              aria-label={
                isExplorerOpen
                  ? 'Collapse full skills explorer'
                  : `Open full engineering stack — ${TOTAL_SKILL_COUNT} tools across 8 pillars`
              }
              className="cta-secondary min-h-[48px] shrink-0 justify-center text-xs sm:text-sm"
            >
              {isExplorerOpen
                ? 'Hide full explorer'
                : `Explore full engineering stack (${TOTAL_SKILL_COUNT})`}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isExplorerOpen && (
              <m.div
                id="skills-explorer-panel"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={
                  reducedMotion
                    ? { duration: 0.01 }
                    : { type: 'spring', stiffness: 300, damping: 28 }
                }
                className="pb-2"
              >
                <SkillsMap />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Flow hook — V1.0 Change 6c: §Flow Mechanics §Skills + §Engagement Protocol */}
        <m.p
          variants={child}
          data-cinematic="cta"
          className="text-color-text-muted mt-8 font-mono text-[13px] [letter-spacing:0.06em] opacity-50"
        >
          <Link href={anchorUrl('section-about')} className="transition-opacity hover:opacity-80">
            These 62 skills map to three live systems →
          </Link>
        </m.p>
      </div>
    </ChapterFrame>
  );
}
