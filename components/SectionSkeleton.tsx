// CONVICTION ENGINE v20.0 — SectionSkeleton
// Suspense fallback for dynamically-imported sections.
//
// v20 fix:
//   • Replaced `section-gap` (undefined class) with `py-[var(--section-py)]`
//     which matches the real section padding token.
//   • Added `container` for consistent max-width / padding alignment.
//   • Height clamp: never locks layout to a fixed pixel value on mobile —
//     `max(height, 30vh)` prevents excessive whitespace on small viewports.
//   • aria-busy + aria-label preserved for assistive tech.

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