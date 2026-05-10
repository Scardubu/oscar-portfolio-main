export default function Loading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading page">
      {/* Hero skeleton */}
      <section
        className="pt-[calc(var(--nav-height)+var(--space-12))] pb-[var(--section-py)]"
        aria-hidden="true"
      >
        <div className="container space-y-5">
          {/* Kicker */}
          <div
            className="h-2.5 w-24 rounded-full animate-pulse"
            style={{ background: 'var(--color-border)' }}
          />
          {/* Headline */}
          <div className="space-y-2">
            <div
              className="h-10 w-4/5 max-w-[420px] rounded-xl animate-pulse"
              style={{ background: 'var(--color-border)' }}
            />
            <div
              className="h-10 w-3/5 max-w-[320px] rounded-xl animate-pulse"
              style={{ background: 'var(--color-border)' }}
            />
          </div>
          {/* Body */}
          <div
            className="h-5 w-full max-w-[480px] rounded-lg animate-pulse"
            style={{ background: 'var(--color-border-subtle)' }}
          />
          {/* CTA row */}
          <div className="flex gap-3 pt-2">
            <div
              className="h-11 w-36 rounded-full animate-pulse"
              style={{ background: 'var(--color-border)' }}
            />
            <div
              className="h-11 w-28 rounded-full animate-pulse"
              style={{ background: 'var(--color-border-subtle)' }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}