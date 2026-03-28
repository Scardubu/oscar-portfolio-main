export default function WritingLoading() {
  return (
    <main id="main-content">
      <section style={{ paddingTop: 'calc(var(--nav-height) + var(--space-12))' }}>
        <div className="container" style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <div className="skeleton" style={{ width: '10rem', height: '1.5rem' }} />
          <div className="skeleton" style={{ width: 'min(34rem, 100%)', height: '4rem' }} />
          <div className="skeleton" style={{ width: '100%', height: '4rem' }} />
          <div className="skeleton" style={{ width: '100%', height: '4rem' }} />
          <div className="skeleton" style={{ width: '100%', height: '4rem' }} />
        </div>
      </section>
    </main>
  );
}