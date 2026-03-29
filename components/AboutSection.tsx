const stackGroups = [
  {
    label: 'Languages',
    items: ['TypeScript', 'Python', 'SQL'],
  },
  {
    label: 'Frameworks',
    items: ['Next.js', 'React', 'FastAPI'],
  },
  {
    label: 'ML/AI',
    items: ['XGBoost', 'MLflow', 'Feature Stores'],
  },
  {
    label: 'Infrastructure',
    items: ['Docker', 'AWS', 'Terraform'],
  },
];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 sm:py-24">
      <div className="container grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-start">
        <div className="glass-no-hover rounded-[var(--radius-lg)] p-6 md:p-8" data-reveal="" data-reveal-delay="1">
          <span className="label">About</span>
          <h2 id="about-heading" className="mt-4 text-4xl text-white sm:text-5xl">
            Full-Stack ML Engineer — Production AI Systems
          </h2>
          <div className="mt-6 space-y-4 text-base leading-8 text-white/70">
            <p>
              SabiScore runs end-to-end: feature engineering, ensemble model training, FastAPI
              inference, Redis caching, Postgres, Docker, Next.js. Active users. Live events.
              24/7.
            </p>
            <p>
              Consulting covers ML debugging tooling and LLM integration for teams needing technical
              model behavior translated to business-readable outcomes.
            </p>
            <p>
              Open to Staff ML engineering roles, technical co-founder partnerships, and consulting
              where full-stack ownership matters.
            </p>
          </div>
        </div>

        <div data-reveal="" data-reveal-delay="2">
          <span className="label">Core stack</span>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {stackGroups.map((group) => (
              <div key={group.label} className="glass-no-hover rounded-[var(--radius-lg)] p-5">
                <p className="label">{group.label}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={`${group.label}-${item}`} className="pill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
