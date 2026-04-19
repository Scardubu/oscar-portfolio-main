// components/SectionSkeleton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Suspense fallback for dynamically-imported sections.
// Matches approximate layout of the real section to prevent CLS.
// ─────────────────────────────────────────────────────────────────────────────

interface SectionSkeletonProps {
  id:     string;
  label:  string;
  height: number;
}

export function SectionSkeleton({ id, label, height }: SectionSkeletonProps) {
  return (
    <section
      id={id}
      className="section-gap mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label={`Loading ${label}`}
    >
      {/* Header skeleton */}
      <div className="mb-12 flex flex-col gap-3">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton h-8 w-64 rounded-xl" />
        <div className="skeleton h-5 w-96 max-w-full rounded-lg" />
      </div>

      {/* Body skeleton */}
      <div className="skeleton w-full rounded-(--radius-3xl)" style={{ height }} />
    </section>
  );
}
