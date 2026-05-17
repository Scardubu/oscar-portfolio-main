// CONVICTION ENGINE — SectionDivider.tsx
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
      className={`relative my-4 h-px w-full overflow-hidden ${className ?? ''}`}
      style={{ background: 'var(--color-border)' }}
    >
      <div
        className="absolute left-0 top-0 h-full w-24"
        style={{
          background: 'oklch(70% 0.21 188 / 0.35)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}
