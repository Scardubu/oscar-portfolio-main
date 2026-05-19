'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Mobile-native: BECAUSE is the hero signal — dominant type, colored border, full-width.
// CHOSEN / OVER: secondary rows, 48px min touch target, compact on mobile, expanded sm+.

interface ArchDecisionProps {
  readonly chosen: string;
  readonly over: string;
  readonly because: string;
  /** Render a condensed variant for non-featured / grid cards */
  readonly compact?: boolean;
}

export function ArchDecision({ chosen, over, because, compact = false }: ArchDecisionProps) {
  return (
    <div className="border-color-border-subtle rounded-[var(--radius-lg)] border bg-[oklch(100%_0_0_/_0.018)]">
      {/* BECAUSE — primary conviction signal */}
      <div
        className={`border-color-border-subtle border-b ${compact ? 'px-3 py-3' : 'px-4 py-4 sm:px-6 sm:py-5'}`}
      >
        <p className="label-mono text-color-film-teal mb-2 text-[10px]">BECAUSE</p>
        <p
          className={`text-color-text-primary leading-[1.75] font-medium ${compact ? 'line-clamp-3 text-xs' : 'text-sm sm:text-base'}`}
        >
          {because}
        </p>
      </div>

      {/* CHOSEN / OVER — secondary rows */}
      <div className="divide-color-border-subtle divide-y">
        <div
          className={`flex min-h-[48px] items-start gap-3 py-3 ${compact ? 'px-3' : 'px-4 sm:px-6'}`}
        >
          <span className="label-mono text-color-success w-14 shrink-0 pt-0.5 text-[10px]">
            CHOSEN
          </span>
          <span
            className={`text-color-text-secondary leading-[1.7] ${compact ? 'line-clamp-2 text-[11px]' : 'text-xs sm:text-sm'}`}
          >
            {chosen}
          </span>
        </div>

        <div
          className={`flex min-h-[48px] items-start gap-3 py-3 ${compact ? 'px-3' : 'px-4 sm:px-6'}`}
        >
          <span className="label-mono text-color-warning w-14 shrink-0 pt-0.5 text-[10px]">
            OVER
          </span>
          <span
            className={`text-color-text-muted leading-[1.7] ${compact ? 'line-clamp-2 text-[11px]' : 'text-xs sm:text-sm'}`}
          >
            {over}
          </span>
        </div>
      </div>
    </div>
  );
}
