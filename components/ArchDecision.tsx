'use client';
// components/ArchDecision.tsx — CONVICTION ENGINE v22.0
// Mobile-native: BECAUSE is the hero signal — dominant type, colored border, full-width.
// CHOSEN / OVER: secondary rows, 48px min touch target, compact on mobile, expanded sm+.

interface ArchDecisionProps {
  readonly chosen: string;
  readonly over: string;
  readonly because: string;
}

export function ArchDecision({ chosen, over, because }: ArchDecisionProps) {
  return (
    <div
      className="rounded-[var(--radius-lg)] border"
      style={{
        borderColor: 'var(--color-border-subtle)',
        background: 'oklch(100% 0 0 / 0.018)',
      }}
    >
      {/* BECAUSE — primary conviction signal */}
      <div
        className="px-4 py-4 sm:px-6 sm:py-5 border-b"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <p
          className="label-mono mb-2 text-[10px]"
          style={{ color: 'var(--color-film-teal)' }}
        >
          BECAUSE
        </p>
        <p
          className="text-sm sm:text-base leading-[1.75] font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {because}
        </p>
      </div>

      {/* CHOSEN / OVER — secondary rows */}
      <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div
          className="flex min-h-[48px] items-start gap-3 px-4 py-3 sm:px-6"
        >
          <span
            className="label-mono w-14 shrink-0 pt-0.5 text-[10px]"
            style={{ color: 'var(--color-success)' }}
          >
            CHOSEN
          </span>
          <span
            className="text-xs sm:text-sm leading-[1.7]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {chosen}
          </span>
        </div>

        <div
          className="flex min-h-[48px] items-start gap-3 px-4 py-3 sm:px-6"
        >
          <span
            className="label-mono w-14 shrink-0 pt-0.5 text-[10px]"
            style={{ color: 'var(--color-warning)' }}
          >
            OVER
          </span>
          <span
            className="text-xs sm:text-sm leading-[1.7]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {over}
          </span>
        </div>
      </div>
    </div>
  );
}