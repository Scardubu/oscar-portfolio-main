interface ArchDecisionProps {
  chosen: string;
  over: string;
  because: string;
  compact?: boolean;
}

const ITEMS = [
  { key: 'chosen', label: 'CHOSEN', labelClassName: '', valueClassName: '' },
  { key: 'over', label: 'OVER', labelClassName: '', valueClassName: '' },
  {
    key: 'because',
    label: 'BECAUSE',
    labelClassName: 'text-[11px]',
    valueClassName: 'font-medium',
  },
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
      className="arch-decision mt-5 overflow-hidden rounded-(--radius-md) border border-(--color-border) bg-(--color-bg)"
    >
      <header className="flex items-center gap-2 border-b border-(--color-border) px-4 py-3">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-(--color-accent)"
        />
        <span className="label text-[10px]">Architecture Decision</span>
      </header>

      <div className={`arch-grid${compact ? '' : 'arch-grid--full'}`}>
        {ITEMS.map((item, index) => {
          const value = values[item.key];
          const compactDivider = compact && index < ITEMS.length - 1;
          const isBecause = item.key === 'because';

          return (
            <div
              key={item.key}
              className={`px-4 py-3${isBecause ? 'arch-because-cell' : ''}${compactDivider ? 'border-b border-(--color-border-subtle)' : ''}`}
            >
              <p
                className={`arch-label font-mono text-[10px] tracking-[0.18em] uppercase ${item.labelClassName}`}
                data-arch-key={item.key}
              >
                {item.label}
              </p>
              <p
                className={`font-display mt-2 max-w-none text-sm leading-6 ${item.valueClassName} ${isBecause ? 'font-medium text-(--color-text-primary)' : 'text-(--color-text-secondary)'}`}
                data-label={item.label}
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
