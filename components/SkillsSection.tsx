// components/SkillsSection.tsx
// CONVICTION ENGINE v19.0 — Skills section extracted from page.tsx
// Mobile-native: single source of truth for Skills section rendering.

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
        <div className="mb-10 sm:mb-14 max-w-4xl">
          <div className="section-kicker-row">
            <span className="section-number" aria-hidden="true">03</span>
            <span className="section-label">SKILLS</span>
          </div>

          <h2
            id="skills-heading"
            className="mt-[var(--space-2)]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Built for the full stack. Proven in production.
          </h2>

          <p
            className="mt-4 max-w-[60ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            52 skills across backend infrastructure, ML systems, frontend architecture, compliance
            engineering, and DevOps — each one battle-tested in a live product.
          </p>
        </div>

        <SkillsMap />
      </div>
    </section>
  );
}