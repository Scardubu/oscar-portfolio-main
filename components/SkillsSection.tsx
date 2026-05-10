// CONVICTION ENGINE v20.0 — SkillsSection
// Mobile-native wrapper around SkillsMap.
// Lagos, Nigeria → Global.
//
// v20 changes:
//   • Heading: "Built for the full stack. Proven in production." → more specific,
//     outcome-first copy that names the disciplines.
//   • Count: elevated from body copy into a metric badge above the headline.
//   • Section number: 03 (kept, matches page order).

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
            className="mt-4 max-w-[60ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            52 skills across backend infrastructure, ML systems, frontend architecture,
            fintech compliance, and DevOps — every one battle-tested in a live product,
            not a tutorial.
          </p>

          {/* Trust signal: specific, scannable */}
          <div
            className="mt-5 flex flex-wrap gap-x-5 gap-y-2"
          >
            {[
              { label: '52 skills', sub: 'mapped to live systems' },
              { label: '7 disciplines', sub: 'ML · Backend · Fintech · DevOps' },
              { label: '4 years', sub: 'production engineering' },
            ].map(({ label, sub }) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: 'var(--color-film-teal)' }}
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