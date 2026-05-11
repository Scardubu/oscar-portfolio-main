'use client';
// CONVICTION ENGINE v25.0 — SkillsSection
// v25 CHANGES vs v24:
//   HEADING: "Full-stack. Every layer." → "The stack behind the systems."
//     More precise — references the actual shipped systems, not a claim.
//   BODY COPY: "React Native to Fastify to Python ML — 62 skills" →
//     outcome-first rewrite for non-technical founders: what these skills
//     delivered, not just their names.
//   TRUST STRIP: Rewritten as outcome-first — "4h→15min (TaxBridge)",
//     "99.9%+ uptime (SabiScore)", "Self-improving agents (SwarmXQ)".
//     Previous version listed tool names — useful for engineers,
//     opaque for founders. Both audiences now served.
//   FEATURED SKILL CARDS: Now show the primary project each skill is traced to.
//     Turns "Expert" label into "Expert — used in TaxBridge" — defensible, not decorative.
//   KEEP: All v24 SkillsMap, reduced-motion, stagger config.

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { fadeRise, noMotion } from '@/lib/motionVariants';
import { SkillsMap } from '@/components/skills/SkillsMap';

const TRUST_METRICS = [
  {
    value: '4h → 15min',
    label: 'tax filing time',
    sub: 'TaxBridge · Fastify 5 · PostgreSQL 15 RLS',
    color: 'var(--color-film-teal)',
  },
  {
    value: '99.9%+',
    label: 'sustained uptime',
    sub: 'SabiScore · XGBoost · LightGBM · Prometheus',
    color: 'oklch(72% 0.17 160)',
  },
  {
    value: 'Self-improving',
    label: 'AI agent fleet',
    sub: 'SwarmXQ · Next.js 15 · FastAPI · BullMQ',
    color: 'oklch(75% 0.16 300)',
  },
] as const;

// v25: Each card now shows the primary system the skill is traced to
const FEATURED_SKILLS = [
  { name: 'TypeScript strict',       level: 'Expert', project: 'TaxBridge · SwarmXQ', color: 'oklch(73% 0.18 196)' },
  { name: 'React 19',                level: 'Expert', project: 'SabiScore · portfolio', color: 'oklch(73% 0.18 196)' },
  { name: 'Next.js 15',              level: 'Expert', project: 'SabiScore · SwarmXQ',  color: 'oklch(73% 0.18 196)' },
  { name: 'React Native / Expo 54',  level: 'Pro',    project: 'TaxBridge mobile app', color: 'oklch(72% 0.17 160)' },
  { name: 'FastAPI',                 level: 'Expert', project: 'SabiScore · SwarmXQ',  color: 'oklch(73% 0.18 196)' },
  { name: 'PostgreSQL 15 RLS',       level: 'Expert', project: 'TaxBridge',            color: 'oklch(73% 0.18 196)' },
] as const;

export function SkillsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();
  const child = reducedMotion ? noMotion : fadeRise;

  return (
    <section
      id="skills"
      ref={ref}
      aria-labelledby="skills-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          <m.div variants={child} className="mb-10 sm:mb-14">
            <div className="section-kicker-row mb-[var(--space-2)]">
              <span className="section-number" aria-hidden="true">03</span>
              <span className="section-label">SKILLS</span>
            </div>

            <h2
              id="skills-heading"
              className="mt-3 max-w-[22ch]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              The stack behind the systems.
            </h2>

            <p
              className="mt-4 w-full max-w-[52ch] text-sm sm:text-base leading-8"
              style={{ color: 'var(--color-text-secondary)', overflowWrap: 'break-word' }}
            >
              62 battle-tested skills across ML, AI agent orchestration, fintech
              compliance, backend infrastructure, DevOps, and blockchain/ZK —
              every one traceable to a live production system.
            </p>

            {/* v25: Trust strip — outcome-first for non-technical founders */}
            <div
              className="mt-6 grid gap-4 sm:grid-cols-3"
              aria-label="System outcomes"
            >
              {TRUST_METRICS.map(({ value, label, sub, color }) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-md)] border p-4"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'oklch(100% 0 0 / 0.02)',
                    borderTop: `2px solid ${color}30`,
                  }}
                >
                  <p
                    className="font-mono text-sm font-semibold"
                    style={{ color }}
                  >
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

          {/*
            FEATURED STACK ROW — instant credibility scan.
            v25: each card now shows the project where the skill is used.
          */}
          <m.div
            variants={child}
            className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6"
            aria-label="Top skills — featured"
            role="list"
          >
            {FEATURED_SKILLS.map(({ name, level, project, color }) => (
              <div
                key={name}
                role="listitem"
                className="glass-surface rounded-[var(--radius-md)] border-t p-3 flex flex-col gap-2 transition-colors duration-150 hover:border-white/14"
                style={{ borderTopColor: `${color}40` }}
                aria-label={`${name} — ${level}`}
              >
                <span
                  className="font-mono text-[9px] tracking-widest uppercase font-semibold"
                  style={{ color }}
                >
                  {level}
                </span>
                <span
                  className="text-xs font-medium leading-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {name}
                </span>
                {/* v25: project trace */}
                <span
                  className="font-mono text-[8px] leading-tight"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {project}
                </span>
                {/* Level bar */}
                <div
                  className="h-[2px] w-full rounded-full overflow-hidden"
                  style={{ background: 'oklch(100% 0 0 / 0.07)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: level === 'Expert' ? '95%' : '70%',
                      background: color,
                      transition: reducedMotion ? 'none' : 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </m.div>
        </m.div>

        {/* Full interactive SkillsMap — tabs default to Frontend & Full-Stack */}
        <SkillsMap />
      </div>
    </section>
  );
}