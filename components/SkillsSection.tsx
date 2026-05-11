// CONVICTION ENGINE v22.0 — SkillsSection
// Mobile-native wrapper around SkillsMap. Lagos → Global.
//
// v22 vs v21:
//   • Trust strip: grid on mobile (2-col), flex-wrap on sm+ — never overflows 320px
//   • Intro paragraph: max-w-[52ch] tightened for 320px scan comfort
//   • Section number corrected to 03 in page order
//   • Added motion reveal on section header

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { fadeRise, noMotion } from '@/lib/motionVariants';
import { SkillsMap } from '@/components/skills/SkillsMap';

const TRUST_METRICS = [
  {
    label: '52 skills',
    sub: 'mapped to live systems',
    color: 'var(--color-film-teal)',
  },
  {
    label: '7 disciplines',
    sub: 'ML · Backend · Fintech · DevOps',
    color: 'oklch(72% 0.17 160)',
  },
  {
    label: '4 years',
    sub: 'production, Lagos',
    color: 'oklch(75% 0.16 300)',
  },
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
              style={{ color: 'var(--color-text-secondary)', overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              52 battle-tested skills across ML, fintech compliance, backend
              infrastructure, and DevOps — every one traceable to a live
              production system.
            </p>

            {/* Trust strip — 2-col grid on mobile, flex-wrap on sm+ */}
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
        </m.div>

        <SkillsMap />
      </div>
    </section>
  );
}