// CONVICTION ENGINE v21.0 — SkillsSection
// Mobile-native wrapper around SkillsMap.
// Lagos, Nigeria → Global.
//
// v21 changes vs v20:
//   • Headline: names the outcome context, not just the quantity.
//   • Intro paragraph: tightened to ≤56ch for mobile scan line.
//   • Metric strip: each label now carries production context.
//   • Section number: 03 (maintained, page order).

import { SkillsMap } from '@/components/skills/SkillsMap';

export function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <div className="mb-10 sm:mb-14">
          <div className="section-kicker-row mb-[var(--space-2)]">
            <span className="section-number" aria-hidden="true">03</span>
            <span className="section-label">SKILLS</span>
          </div>

          <h2
            id="skills-heading"
            className="mt-[var(--space-2)] max-w-[22ch]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            The stack behind the systems.
          </h2>

          <p
            className="mt-4 max-w-[56ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            52 battle-tested skills across ML, fintech compliance, backend infrastructure,
            and DevOps — every one traceable to a live production system.
          </p>

          {/* Trust strip: scannable, production-anchored */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            {[
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
                sub: 'production engineering, Lagos',
                color: 'oklch(75% 0.16 300)',
              },
            ].map(({ label, sub, color }) => (
              <div key={label} className="flex items-baseline gap-1.5">
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
        </div>

        <SkillsMap />
      </div>
    </section>
  );
}