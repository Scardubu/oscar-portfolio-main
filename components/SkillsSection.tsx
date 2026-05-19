'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// Skills section v30 — L1 / L2 / L3 progressive disclosure architecture.
//
// L1  Core trust layer (immediate): header + outcome metrics + 12 canonical skills.
//     System 1 readers reach conviction in <5 s before encountering the full explorer.
// L2  Technical lineage (immediate): system × skill provenance strip showing
//     exactly which tool powers which live system.
// L3  Full explorer (always rendered, clearly separated): SkillsMap with
//     pillar tabs. Depth available on demand; never forced before L1/L2 land.
//
// Canonical sources:
//   getCoreProductionSkills()   →  lib/data/skills.ts (L1 skill set)
//   SYSTEM_LINEAGE              →  lib/data/skills.ts (L2 provenance)
//   SkillsMap                   →  components/skills/SkillsMap.tsx (L3)

import { m, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

import { SkillsMap } from '@/components/skills/SkillsMap';
import { anchorUrl } from '@/lib/config';
import { getCoreProductionSkills, SYSTEM_LINEAGE } from '@/lib/data/skills';
import { clipReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';
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
      className="glass-surface flex h-full min-w-0 flex-col gap-2 rounded-[var(--radius-md)] p-3"
      style={{ borderTop: `2px solid ${lvl.color}30` }}
      aria-label={`${skill.name} — ${lvl.label}${projectLabel ? ` — ${projectLabel}` : ''}`}
    >
      <span
        className="shrink-0 font-mono text-[9px] font-semibold tracking-widest uppercase"
        style={{ color: lvl.color }}
      >
        {lvl.label}
      </span>

      <span
        className="text-xs leading-tight font-semibold break-words"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {skill.name}
      </span>

      {projectLabel ? (
        <span
          className="font-mono text-[8px] leading-tight break-words"
          style={{ color: 'var(--color-text-muted)' }}
          title={systemTags.join(' · ')}
        >
          {projectLabel}
        </span>
      ) : null}

      <div
        className="mt-auto h-[2px] w-full overflow-hidden rounded-full"
        style={{ background: 'oklch(100% 0 0 / 0.07)' }}
        role="meter"
        aria-valuenow={valuenow}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        <m.div
          className="h-full rounded-full"
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
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
      <span
        className="shrink-0 font-mono text-[9px] font-semibold tracking-widest uppercase sm:w-[5.5rem] sm:pt-0.5"
        style={{ color: accent }}
      >
        {system}
      </span>
      <div className="flex min-w-0 flex-wrap gap-1">
        {skills.map((s) => (
          <span
            key={s.id}
            className="rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-wide"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
              background: 'oklch(100% 0 0 / 0.015)',
            }}
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
  const ref = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const cardsInView = useInView(cardsRef, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion() ?? false;
  const child = reducedMotion ? noMotion : fadeRise;
  const container = staggerContainer(0.07, 0.05);
  const coreSkills = getCoreProductionSkills();

  return (
    <section
      id="skills"
      ref={ref}
      aria-labelledby="skills-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={container}>
          {/* ── L1: Header ─────────────────────────────────────────────── */}
          <m.div variants={child} className="mb-10 sm:mb-12">
            <div className="section-intro-editorial mb-6 sm:mb-8">
              <div>
                <div className="section-kicker-row mb-[var(--space-2)]">
                  <span className="section-number" aria-hidden="true">
                    03
                  </span>
                  <span className="section-label">SKILLS</span>
                </div>

                <m.h2
                  variants={reducedMotion ? child : clipReveal}
                  id="skills-heading"
                  className="mt-3 max-w-[22ch]"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  The stack behind systems that hold.
                </m.h2>
              </div>

              <div className="lg:flex lg:flex-col lg:justify-end">
                <p
                  className="mt-4 max-w-[52ch] text-sm leading-8 sm:text-base lg:mt-0"
                  style={{ color: 'var(--color-text-secondary)', overflowWrap: 'break-word' }}
                >
                  62 tools deployed under NRS audit pressure, 99.9%+ uptime targets, and
                  multi-tenant compliance constraints. Every skill maps to a decision made in
                  production — not a tutorial, not a certification exercise, not a side project.
                </p>
              </div>
            </div>

            {/* L1: Outcome-first trust metrics */}
            <div
              className="mt-6 grid gap-3 sm:grid-cols-3"
              aria-label="System outcomes linked to skills"
            >
              {TRUST_METRICS.map(({ value, label, sub, color, borderColor }) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-md)] border p-4"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'oklch(100% 0 0 / 0.02)',
                    borderTop: `2px solid ${borderColor}`,
                  }}
                >
                  <p className="font-mono text-sm font-semibold" style={{ color }}>
                    {value}
                  </p>
                  <p
                    className="mt-0.5 text-xs font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {label}
                  </p>
                  <p
                    className="mt-1 font-mono text-[9px] tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </m.div>

          {/* ── L1: Core skills grid — 12 canonical production skills ─── */}
          <m.div variants={child} className="mb-3">
            <p
              className="mb-3 font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Core production stack
            </p>
          </m.div>

          <m.div
            ref={cardsRef}
            variants={child}
            className="mb-10 grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            aria-label="Core production skills — top 12"
            role="list"
          >
            {coreSkills.map((skill, idx) => (
              <div key={skill.id} role="listitem">
                <CoreSkillCard
                  skill={skill}
                  index={idx}
                  reducedMotion={reducedMotion}
                  shouldAnimate={cardsInView}
                />
              </div>
            ))}
          </m.div>

          {/* ── L2: System lineage strip — always visible ─────────────── */}
          <m.div variants={child} className="mb-12">
            <p
              className="mb-3 font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Production system × skill lineage
            </p>
            <div
              className="space-y-3 rounded-[var(--radius-lg)] border p-4 sm:p-5"
              style={{
                borderColor: 'var(--color-border)',
                background: 'oklch(100% 0 0 / 0.015)',
              }}
              aria-label="Which skills power each live production system"
            >
              {SYSTEM_LINEAGE.map(({ system, accent, skills }) => (
                <SystemLineageRow key={system} system={system} accent={accent} skills={skills} />
              ))}
            </div>
          </m.div>
        </m.div>

        {/* ── L3: Full interactive SkillsMap — tabbed by pillar ─────────── */}
        <div className="border-t pt-10" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <p
            className="mb-6 font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Full explorer · 62 tools · 8 pillars
          </p>
          <SkillsMap />
        </div>

        {/* Flow hook — V1.0 Change 6c: §Flow Mechanics §Skills + §Engagement Protocol */}
        <m.p
          variants={child}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-8 font-mono text-[13px]"
          style={{ opacity: 0.5, letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}
        >
          <Link href={anchorUrl('section-about')} className="transition-opacity hover:opacity-80">
            These 62 skills map to three live systems →
          </Link>
        </m.p>
      </div>
    </section>
  );
}
