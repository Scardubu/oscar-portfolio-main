// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

export default function Loading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading page">
      {/* Nav bar skeleton */}
      <div
        aria-hidden="true"
        className="border-color-border-subtle fixed top-0 right-0 left-0 z-50 flex h-[var(--nav-height)] items-center justify-between border-b bg-[oklch(7%_0.010_265_/_0.7)] px-[clamp(1rem,5vw,3rem)]"
      >
        <div className="flex flex-col gap-1.5">
          <Shimmer width="w-28" height="h-3" />
          <Shimmer width="w-20" height="h-2" opacity="opacity-50" />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Shimmer width="w-16" height="h-3" />
          <Shimmer width="w-16" height="h-3" />
          <Shimmer width="w-16" height="h-3" />
          <Shimmer width="w-24" height="h-9" rounded="rounded-md" />
        </div>
      </div>

      {/* Hero section skeleton */}
      <section
        className="pt-[calc(var(--nav-height)+clamp(2.5rem,7vw,8.5rem))] pb-[var(--section-py)]"
        aria-hidden="true"
      >
        <div className="container">
          <div className="grid items-start gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-[54%_46%]">
            {/* Left column */}
            <div className="flex flex-col gap-5">
              {/* Mobile headshot */}
              <div className="mb-2 flex lg:hidden">
                <Shimmer width="w-16" height="h-16" rounded="rounded-full" />
              </div>

              {/* Kicker */}
              <Shimmer width="w-64" height="h-2.5" />

              {/* Headline — 3 lines */}
              <div className="flex flex-col gap-2.5">
                <Shimmer width="w-4/5" height="h-10 sm:h-14" />
                <Shimmer width="w-3/5" height="h-10 sm:h-14" />
              </div>

              {/* Didone sub-line */}
              <Shimmer width="w-3/4" height="h-5" />

              {/* Body copy — 2 lines */}
              <div className="flex flex-col gap-2 pt-1">
                <Shimmer width="w-full" height="h-4" />
                <Shimmer width="w-5/6" height="h-4" />
              </div>

              {/* Conviction stat strip */}
              <div className="border-color-border-subtle grid grid-cols-2 gap-3 border-y py-4 sm:flex sm:flex-wrap sm:gap-x-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Shimmer width="w-20" height="h-3.5" />
                    <Shimmer width="w-14" height="h-2" opacity="opacity-50" />
                  </div>
                ))}
              </div>

              {/* Proof callout */}
              <Shimmer width="w-full" height="h-12" rounded="rounded-md" />

              {/* Live activity bar */}
              <Shimmer width="w-48" height="h-3" />

              {/* CTA row */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Shimmer width="w-full sm:w-44" height="h-14" rounded="rounded-md" />
                <Shimmer
                  width="w-full sm:w-36"
                  height="h-14"
                  rounded="rounded-md"
                  opacity="opacity-60"
                />
              </div>

              {/* Ghost CV link */}
              <Shimmer width="w-28" height="h-3" opacity="opacity-40" />
            </div>

            {/* Right column — desktop only */}
            <div className="hidden flex-col items-end gap-6 lg:flex">
              {/* Headshot */}
              <Shimmer width="w-28 xl:w-36" height="h-28 xl:h-36" rounded="rounded-[14px]" />

              {/* Metric panel stubs */}
              {[72, 80, 64, 56].map((h, i) => (
                <Shimmer
                  key={i}
                  width="w-full"
                  height={`h-${h === 72 ? '[72px]' : h === 80 ? '[80px]' : h === 64 ? '[64px]' : '[56px]'}`}
                  rounded="rounded-[14px]"
                  opacity={i > 0 ? 'opacity-60' : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Shimmer primitive ─────────────────────────────────────────────────────── */
function Shimmer({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-lg',
  opacity,
}: {
  width?: string;
  height?: string;
  rounded?: string;
  opacity?: string;
}) {
  return (
    <div
      className={`${width} ${height} ${rounded} ${opacity ?? ''} skeleton-shimmer bg-color-border`}
      aria-hidden="true"
    />
  );
}
