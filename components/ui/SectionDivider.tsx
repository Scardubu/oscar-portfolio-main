// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// Lightweight editorial separator for use between major content blocks
// within a section (not between sections — sections use `border-t`).
//
// Design: a single-pixel rule with a short teal glow accent at the left.
// The glow anchors reading direction without adding visual weight.
// The blur keeps it film-grade rather than utilitarian.
//
// Use sparingly — only where a visual break genuinely helps the reader
// understand a content hierarchy shift.

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-color-border relative my-4 h-px w-full overflow-hidden ${className ?? ''}`}
    >
      <div className="absolute top-0 left-0 h-full w-24 bg-[oklch(70%_0.21_188_/_0.35)] blur-[2px]" />
    </div>
  );
}
