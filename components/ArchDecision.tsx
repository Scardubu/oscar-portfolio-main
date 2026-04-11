interface ArchDecisionProps {
  chosen: string;
  over: string;
  because: string;
  compact?: boolean;
}

const ITEMS = [
  { key: 'chosen', label: 'CHOSEN', color: 'var(--color-live)', labelClassName: '', labelStyle: undefined, valueStyle: undefined },
  { key: 'over', label: 'OVER', color: 'var(--color-text-muted)', labelClassName: '', labelStyle: undefined, valueStyle: undefined },
  { key: 'because', label: 'BECAUSE', color: 'var(--color-accent)', labelClassName: 'text-[11px]', labelStyle: { fontWeight: 600 }, valueStyle: { fontWeight: 500 } },
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

      <div className={`arch-grid${compact ? '' : ' arch-grid--full'}`}>
        {ITEMS.map((item, index) => {
          const value = values[item.key];
          const compactDivider = compact && index < ITEMS.length - 1;
          const isBecause = item.key === 'because';

          return (
            <div
              key={item.key}
              className={`px-4 py-3 ${compactDivider ? 'border-b border-[color:var(--color-border-subtle)]' : ''}`}
            >
              <p
                className={`arch-label font-mono text-[10px] tracking-[0.18em] uppercase ${item.labelClassName}`}
                data-label={item.label}
                data-arch-key={item.key}
                style={{ color: item.color, ...item.labelStyle }}
              >
                {item.label}
              </p>
              <p
                className={`mt-2 max-w-none text-sm leading-6 ${isBecause ? 'text-[color:var(--color-text-primary)] font-medium' : 'text-[color:var(--color-text-secondary)]'}`}
                data-label={item.label}
                data-value-for={item.label}
                style={{ fontFamily: 'var(--font-display)', ...item.valueStyle }}
              >
                {value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
