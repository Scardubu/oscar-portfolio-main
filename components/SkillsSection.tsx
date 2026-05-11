'use client';
// CONVICTION ENGINE v24.0 — SkillsSection
// v24 CHANGES vs v23:
//   • FEATURED STACK ROW: 6 hero skills shown before the tabs — instant
//     full-stack signal for recruiters who don't click through tabs.
//     TypeScript · React 19 · Next.js 15 · React Native · FastAPI · PostgreSQL
//   • Tab default: "Frontend & Full-Stack" is now pillar[0] (lib/data/skills.ts).
//   • Trust metrics updated: "6 expert frontend skills" replaces "8 disciplines".
//   • Intro copy: "React Native to Fastify to Python ML" — explicit range.
//   • KEEP: All v23 mobile ergonomics, SkillsMap, reduced-motion.

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { fadeRise, noMotion } from '@/lib/motionVariants';
import { SkillsMap } from '@/components/skills/SkillsMap';

const TRUST_METRICS = [
  {
    label: '6 expert frontend skills',
    sub: 'React · Next.js 15 · TypeScript · Tailwind v4',
    color: 'var(--color-film-teal)',
  },
  {
    label: '4 production ML models',
    sub: 'XGBoost · LightGBM · CatBoost · Feature Eng',
    color: 'oklch(72% 0.17 160)',
  },
  {
    label: '4+ years production',
    sub: 'Lagos → global, battle-tested',
    color: 'oklch(75% 0.16 300)',
  },
] as const;

// Top 6 skills — instant credibility scan for Staff+ and founder conversations.
// Chosen to show the full-stack range: mobile → web → API → DB.
const FEATURED_SKILLS = [
  { name: 'TypeScript strict',        level: 'Expert',    color: 'oklch(73% 0.18 196)' },
  { name: 'React 19',                 level: 'Expert',    color: 'oklch(73% 0.18 196)' },
  { name: 'Next.js 15',               level: 'Expert',    color: 'oklch(73% 0.18 196)' },
  { name: 'React Native / Expo 54',   level: 'Pro',       color: 'oklch(72% 0.17 160)' },
  { name: 'FastAPI',                  level: 'Expert',    color: 'oklch(73% 0.18 196)' },
  { name: 'PostgreSQL 15 RLS',        level: 'Expert',    color: 'oklch(73% 0.18 196)' },
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
              Full-stack. Every layer.
            </h2>

            <p
              className="mt-4 w-full max-w-[52ch] text-sm sm:text-base leading-8"
              style={{ color: 'var(--color-text-secondary)', overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              React Native to Next.js 15 to FastAPI to PostgreSQL — 62 skills,
              every one traceable to a production system shipped from Lagos.
              Frontend and backend held to the same standard.
            </p>

            {/* Trust strip */}
            <div
              className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-3"
              aria-label="Skills summary"
            >
              {TRUST_METRICS.map(({ label, sub, color }) => (
                <div key={label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{ color }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </m.div>

          {/*
            FEATURED STACK ROW — v24 addition.
            Renders BEFORE the tab-based SkillsMap so recruiters get the
            full-stack snapshot on first glance, even if they don't interact.
            6 cards in a 2-col mobile / 3-col sm / 6-col xl grid.
          */}
          <m.div
            variants={child}
            className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6"
            aria-label="Top skills — featured"
            role="list"
          >
            {FEATURED_SKILLS.map(({ name, level, color }) => (
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
