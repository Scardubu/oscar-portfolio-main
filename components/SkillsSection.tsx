'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import Link from 'next/link';

import { SkillsMap } from '@/components/skills/SkillsMap';
import { anchorUrl } from '@/lib/config';
import { fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

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
    sub: 'SwarmXQ · Next.js 15 · FastAPI · BullMQ',
    color: 'oklch(75% 0.16 300)',
    borderColor: 'oklch(75% 0.16 300 / 0.22)',
  },
] as const;

// Each skill traced to the live system that proves it
const FEATURED_SKILLS = [
  {
    name: 'TypeScript strict',
    level: 'Expert',
    project: 'TaxBridge · SwarmXQ',
    color: 'var(--color-film-teal)',
    barWidth: '95%',
  },
  {
    name: 'React 19',
    level: 'Expert',
    project: 'SabiScore · portfolio',
    color: 'var(--color-film-teal)',
    barWidth: '95%',
  },
  {
    name: 'Next.js 15',
    level: 'Expert',
    project: 'SabiScore · SwarmXQ',
    color: 'var(--color-film-teal)',
    barWidth: '95%',
  },
  {
    name: 'React Native / Expo 54',
    level: 'Pro',
    project: 'TaxBridge mobile',
    color: 'oklch(72% 0.17 160)',
    barWidth: '70%',
  },
  {
    name: 'FastAPI',
    level: 'Expert',
    project: 'SabiScore · SwarmXQ',
    color: 'var(--color-film-teal)',
    barWidth: '95%',
  },
  {
    name: 'PostgreSQL 15 RLS',
    level: 'Expert',
    project: 'TaxBridge',
    color: 'var(--color-film-teal)',
    barWidth: '95%',
  },
  {
    // Java 17 · Spring Boot 3: NRS integration layer in production TaxBridge
    name: 'Java 17',
    level: 'Expert',
    project: 'TaxBridge · Spring Boot 3',
    color: 'var(--color-film-amber)',
    barWidth: '88%',
  },
] as const;

export function SkillsSection() {
  const ref = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const cardsInView = useInView(cardsRef, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();
  const child = reducedMotion ? noMotion : fadeRise;
  const container = staggerContainer(0.07, 0.05);

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
          {/* ── Section header ─────────────────────────────────────────── */}
          <m.div variants={child} className="mb-10 sm:mb-14">
            <div className="section-intro-editorial mb-6 sm:mb-8">
              <div>
                <div className="section-kicker-row mb-[var(--space-2)]">
                  <span className="section-number" aria-hidden="true">
                    03
                  </span>
                  <span className="section-label">SKILLS</span>
                </div>

                <h2
                  id="skills-heading"
                  className="mt-3 max-w-[22ch]"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  The stack behind systems that hold.
                </h2>
              </div>

              <div className="lg:flex lg:flex-col lg:justify-end">
                <p
                  className="mt-4 lg:mt-0 max-w-[52ch] text-sm sm:text-base leading-8"
                  style={{ color: 'var(--color-text-secondary)', overflowWrap: 'break-word' }}
                >
                  62 battle-tested skills across ML, AI agent orchestration, fintech
                  compliance, backend infrastructure, DevOps, and blockchain/ZK.
                  Every one maps to a live system running in production — not a side
                  project, not a tutorial, not a certificate exercise.
                </p>
              </div>
            </div>

            {/* Outcome-first trust strip — serves both engineers and founders */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="System outcomes linked to skills">
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
                  <p className="mt-0.5 text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {label}
                  </p>
                  <p className="mt-1 font-mono text-[9px] tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </m.div>

          {/* ── Featured skill cards — inView-triggered bar animation ───── */}
          <m.div
            ref={cardsRef}
            variants={child}
            className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4"
            aria-label="Top skills — production-traced"
            role="list"
          >
            {FEATURED_SKILLS.map(({ name, level, project, color, barWidth }, idx) => (
              <div
                key={name}
                role="listitem"
                className="glass-surface min-w-0 rounded-[var(--radius-md)] p-3 flex flex-col gap-2"
                style={{ borderTop: `2px solid ${color}30` }}
                aria-label={`${name} — ${level}`}
              >
                <span className="font-mono text-[9px] tracking-widest uppercase font-semibold" style={{ color }}>
                  {level}
                </span>

                <span className="text-xs font-medium leading-tight break-words" style={{ color: 'var(--color-text-primary)' }}>
                  {name}
                </span>

                <span className="font-mono text-[8px] leading-tight break-words" style={{ color: 'var(--color-text-muted)' }}>
                  {project}
                </span>

                {/* Animated proficiency bar */}
                <div
                  className="h-[2px] w-full rounded-full overflow-hidden"
                  style={{ background: 'oklch(100% 0 0 / 0.07)' }}
                  role="meter"
                  aria-valuenow={parseInt(barWidth, 10)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${name} proficiency`}
                >
                  <m.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: '0%' }}
                    animate={{ width: reducedMotion || cardsInView ? barWidth : '0%' }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : {
                            delay: idx * 0.04 + 0.08,
                            duration: 0.28,
                            ease: [0.16, 1, 0.3, 1],
                          }
                    }
                  />
                </div>
              </div>
            ))}
          </m.div>
        </m.div>

        {/* Full interactive SkillsMap — tabbed by pillar */}
        <SkillsMap />

        {/* Flow hook + discovery hook — V1.0 Change 6c: §Flow Mechanics §Skills + §Engagement Protocol */}
        <m.p
          variants={child}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-8 font-mono text-[13px]"
          style={{ opacity: 0.5, letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}
        >
          <Link href={anchorUrl('section-about')} className="hover:opacity-80 transition-opacity">
            These 62 skills map to three live systems →
          </Link>
        </m.p>
      </div>
    </section>
  );
}
