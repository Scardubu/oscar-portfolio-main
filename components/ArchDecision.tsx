// components/ArchDecision.tsx
// CONVICTION ENGINE v18.0
// Changes:
//   • Compact mode: 3-row flex on mobile (label + value inline), not grid.
//   • Full mode: vertical stack, full width — matches mobile-native column flow.
//   • Because cell: film-teal accent maintained, background accent on desktop.
//   • Spacing: tightened for mobile (py-2 default, py-3 on sm+).

interface ArchDecisionProps {
  chosen: string;
  over: string;
  because: string;
  compact?: boolean;
}

const ITEMS = [
  {
    key: 'chosen' as const,
    label: 'CHOSEN',
    labelColor: 'var(--color-success)',
    valueWeight: 'font-normal',
  },
  {
    key: 'over' as const,
    label: 'OVER',
    labelColor: 'var(--color-text-muted)',
    valueWeight: 'font-normal',
  },
  {
    key: 'because' as const,
    label: 'BECAUSE',
    labelColor: 'var(--color-film-teal)',
    valueWeight: 'font-medium',
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
      className="arch-decision overflow-hidden rounded-[var(--radius-md)] border"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
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

      {/* ── Decision rows ────────────────────────────────────────────── */}
      <div className={compact ? 'divide-y' : 'divide-y'} style={{ borderColor: 'var(--color-border-subtle)' }}>
        {ITEMS.map((item) => {
          const value = values[item.key];
          const isBecause = item.key === 'because';

          return (
            <div
              key={item.key}
              className={`px-3.5 py-2.5 sm:px-4 sm:py-3 ${isBecause ? 'arch-because-cell' : ''}`}
            >
              {compact ? (
                /* Compact: label and value on same line */
                <div className="flex items-start gap-2.5">
                  <span
                    className="arch-label font-mono text-[10px] tracking-[0.18em] uppercase shrink-0 w-14 pt-0.5"
                    data-arch-key={item.key}
                    style={{ color: item.labelColor }}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-[11px] leading-5 ${item.valueWeight}`}
                    style={{
                      color: isBecause
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-secondary)',
                    }}
                    data-label={item.label}
                  >
                    {value}
                  </span>
                </div>
              ) : (
                /* Full: stacked label above value */
                <>
                  <p
                    className="arch-label font-mono text-[10px] tracking-[0.18em] uppercase mb-1.5"
                    data-arch-key={item.key}
                    style={{ color: item.labelColor }}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`font-body text-sm leading-6 max-w-none ${item.valueWeight}`}
                    style={{
                      color: isBecause
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-secondary)',
                    }}
                    data-label={item.label}
                  >
                    {value}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}