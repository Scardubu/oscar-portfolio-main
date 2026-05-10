// components/ArchDecision.tsx
// CONVICTION ENGINE v19.0
// Mobile-native: compact layout is default; full stacked on sm+.

interface ArchDecisionProps {
  chosen:    string;
  over:      string;
  because:   string;
  compact?:  boolean;
}

const ITEMS = [
  {
    key:         'chosen'  as const,
    label:       'CHOSEN',
    labelColor:  'var(--color-success)',
    valueWeight: 'font-normal',
  },
  {
    key:         'over'    as const,
    label:       'OVER',
    labelColor:  'var(--color-text-muted)',
    valueWeight: 'font-normal',
  },
  {
    key:         'because' as const,
    label:       'BECAUSE',
    labelColor:  'var(--color-film-teal)',
    valueWeight: 'font-semibold',
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
      role="region"
      className="arch-decision overflow-hidden rounded-[var(--radius-md)] border"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-2 border-b px-3.5 py-2.5 sm:px-4 sm:py-3"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: 'var(--color-accent)' }}
        />
        <span className="label-mono text-[10px]">Architecture Decision</span>
      </header>

      {/* Rows */}
      <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
        {ITEMS.map((item) => {
          const value = values[item.key];
          const isBecause = item.key === 'because';

          return (
            <div
              key={item.key}
              className={`px-3.5 py-2.5 sm:px-4 sm:py-3 ${isBecause ? 'arch-because-cell' : ''}`}
            >
              {/* Mobile: label + value inline (compact).  Desktop: stacked. */}
              <div className={compact ? 'flex items-start gap-2.5' : 'flex items-start gap-2.5 sm:block'}>
                <p
                  className="arch-label font-mono text-[10px] tracking-[0.18em] uppercase shrink-0 w-14 pt-0.5 sm:w-auto sm:mb-1.5"
                  data-arch-key={item.key}
                  style={{ color: item.labelColor }}
                >
                  {item.label}
                </p>
                <p
                  className={`text-[11px] sm:text-sm leading-5 sm:leading-6 ${item.valueWeight}`}
                  style={{
                    color: isBecause
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-secondary)',
                  }}
                  data-label={item.label}
                >
                  {value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}