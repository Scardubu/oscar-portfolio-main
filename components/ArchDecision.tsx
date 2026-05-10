// components/ArchDecision.tsx
// CONVICTION ENGINE v21.0
// Mobile-native: BECAUSE is the hero signal — dominant type, colored border, full-width.
// CHOSEN / OVER: secondary rows, compact on mobile, expanded sm+.

interface ArchDecisionProps {
  chosen:   string;
  over:     string;
  because:  string;
  compact?: boolean;
}

export function ArchDecision({
  chosen,
  over,
  because,
  compact = false,
}: Readonly<ArchDecisionProps>) {
  return (
    <section
      aria-label="Architecture decision record"
      className="overflow-hidden rounded-[var(--radius-md)] border"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-2 border-b px-3.5 py-2.5"
        style={{
          borderColor: 'var(--color-border)',
          background: 'oklch(100% 0 0 / 0.025)',
        }}
      >
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: 'var(--color-accent)' }}
        />
        <span className="label-mono text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
          Architecture Decision
        </span>
      </header>

      {/* BECAUSE — hero row: most valuable signal */}
      <div
        className="px-3.5 py-3 sm:px-4 sm:py-4 border-b"
        style={{
          borderLeftWidth: '3px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'var(--color-film-teal)',
          borderBottomColor: 'var(--color-border-subtle)',
          background: 'oklch(73% 0.18 196 / 0.04)',
        }}
      >
        <p
          className="label-mono text-[10px] tracking-[0.18em] uppercase mb-1.5"
          style={{ color: 'var(--color-film-teal)' }}
        >
          Because
        </p>
        <p
          className="text-[12px] sm:text-sm leading-5 sm:leading-6 font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {because}
        </p>
      </div>

      {/* CHOSEN / OVER — secondary rows */}
      <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
        {[
          { label: 'Chosen', value: chosen, color: 'var(--color-success)' },
          { label: 'Over', value: over, color: 'var(--color-text-muted)' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`px-3.5 py-2.5 sm:px-4 sm:py-3 ${compact ? '' : 'flex items-start gap-2.5 sm:block'}`}
          >
            <p
              className="label-mono text-[10px] tracking-[0.18em] uppercase shrink-0 w-12 pt-0.5 sm:w-auto sm:mb-1"
              style={{ color }}
            >
              {label}
            </p>
            <p
              className="text-[11px] sm:text-sm leading-5 sm:leading-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}