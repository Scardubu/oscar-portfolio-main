import { LiquidGlassCard } from "@/components/shared/LiquidGlassCard";
import { TechTag } from "@/components/shared/TechTag";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { experience } from "@/data/portfolio";

const accentColor = {
  cyan:   "var(--accent-primary)",
  violet: "var(--accent-secondary)",
  teal:   "var(--accent-fintech)",
  warn:   "var(--accent-warn)",
};

export function ExperienceTimeline() {
  return (
    <section className="section-gap mx-auto max-w-6xl px-6 lg:px-8">
      <SectionHeader
        eyebrow="Experience"
        title="Where I've built things"
        description="4+ years of shipping production AI and full-stack systems — here's the career arc."
      />

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-6 top-0 hidden h-full w-px md:block"
          style={{
            background: "linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary), transparent)",
            opacity: 0.2,
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-6">
          {experience.map((role, i) => {
            const accent = accentColor[role.accent];
            return (
              <div
                key={role.id}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
                className="relative flex gap-6"
              >
                {/* Timeline dot */}
                <div className="relative hidden shrink-0 md:flex flex-col items-center">
                  <div
                    className="relative z-10 mt-6 h-3 w-3 rounded-full"
                    style={{ background: accent, boxShadow: `0 0 12px ${accent}88` }}
                    aria-hidden="true"
                  >
                    {role.current && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ background: accent, opacity: 0.4 }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>

                <LiquidGlassCard
                  variant={role.accent}
                  className="flex-1 p-7"
                >
                  {/* Header */}
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        {role.current && (
                          <span
                            className="badge"
                            style={{
                              color: accent,
                              background: `${accent}18`,
                              borderColor: `${accent}44`,
                            }}
                          >
                            <span className="live-dot animate-ping-glow" style={{ background: "var(--metric-live)" }} aria-hidden="true" />
                            Current
                          </span>
                        )}
                        <span className="badge" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
                          {role.type}
                        </span>
                      </div>
                      <h3
                        className="text-xl font-bold text-[var(--text-primary)]"
                        style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                      >
                        {role.role}
                      </h3>
                      <p className="mt-0.5 text-sm font-medium" style={{ color: accent }}>
                        {role.company}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-[var(--text-muted)]">
                      {role.duration}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {role.description}
                  </p>

                  {/* Bullets */}
                  <ul className="mb-5 space-y-2" role="list">
                    {role.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: accent }} aria-hidden="true" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {role.stack.map((t) => <TechTag key={t} label={t} size="sm" />)}
                  </div>
                </LiquidGlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
