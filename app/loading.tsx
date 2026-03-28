export default function Loading() {
  return (
    <main id="main-content">
      <section style={{ paddingTop: 'calc(var(--nav-height) + var(--space-12))' }}>
        <div className="container" style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <div className="skeleton" style={{ width: '14rem', height: '2rem' }} />
          <div className="skeleton" style={{ width: 'min(42rem, 100%)', height: '5rem' }} />
          <div className="skeleton" style={{ width: 'min(36rem, 100%)', height: '6rem' }} />
          <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="skeleton" style={{ height: '12rem' }} />
            <div className="skeleton" style={{ height: '12rem' }} />
            <div className="skeleton" style={{ height: '12rem' }} />
          </div>
        </div>
      </section>
    </main>
  );
}