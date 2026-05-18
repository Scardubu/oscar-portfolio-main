// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Suspense fallback for dynamically-imported sections.

interface SectionSkeletonProps {
  id:     string;
  label:  string;
  height: number;
}

export function SectionSkeleton({ id, label, height }: Readonly<SectionSkeletonProps>) {
  return (
    <section
      id={id}
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
      aria-busy="true"
      aria-label={`Loading ${label}`}
    >
      <div className="container">
        {/* Header skeleton */}
        <div className="mb-10 flex flex-col gap-3">
          <div className="skeleton h-3 w-20 rounded-full" />
          <div className="skeleton h-8 w-56 rounded-xl" />
          <div className="skeleton h-5 w-80 max-w-full rounded-lg" />
        </div>

        {/* Body skeleton — clamped to avoid CLS on small viewports */}
        <div
          className="skeleton w-full rounded-2xl"
          style={{ height: `clamp(180px, 30vh, ${height}px)` }}
        />
      </div>
    </section>
  );
}
