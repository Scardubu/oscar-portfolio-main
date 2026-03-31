interface ArchDecisionProps {
  chosen: string;
  over: string;
  because: string;
  compact?: boolean;
}

const ITEMS = [
  { key: 'chosen', label: 'CHOSEN', color: 'var(--color-live)' },
  { key: 'over', label: 'OVER', color: 'var(--color-danger)' },
  { key: 'because', label: 'BECAUSE', color: 'var(--color-accent)' },
] as const;

export function ArchDecision({
  chosen,
  over,
  because,
  compact = false,
}: Readonly<ArchDecisionProps>) {
  const values = { chosen, over, because };

  return (
    <section
      aria-label="Architecture decision"
      className="arch-decision mt-5 overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg)]"
    >
      <header className="flex items-center gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
        />
        <span className="label text-[10px]">Architecture Decision</span>
      </header>

      <div className={`arch-grid ${compact ? '' : 'sm:grid-cols-3'}`}>
        {ITEMS.map((item, index) => {
          const value = values[item.key];
          const compactDivider = compact && index < ITEMS.length - 1;
          const desktopDivider = !compact && index < ITEMS.length - 1;

          return (
            <div
              key={item.key}
              className={`px-4 py-3 ${compactDivider ? 'border-b border-[color:var(--color-border-subtle)]' : ''} ${desktopDivider ? 'sm:border-r sm:border-[color:var(--color-border-subtle)]' : ''}`}
            >
              <p
                className="arch-label font-mono text-[10px] tracking-[0.18em] uppercase"
                data-arch-key={item.key}
              >
                {item.label}
              </p>
              <p className="mt-2 max-w-none text-sm leading-6 text-[color:var(--color-text-secondary)]">
                {value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
