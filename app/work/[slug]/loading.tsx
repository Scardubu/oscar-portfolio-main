export default function WorkCaseLoading() {
  return (
    <main id="main-content">
      <section style={{ paddingTop: 'calc(var(--nav-height) + var(--space-12))' }}>
        <div className="container" style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <div className="skeleton" style={{ width: '8rem', height: '1rem' }} />
          <div className="skeleton" style={{ width: 'min(40rem, 100%)', height: '4rem' }} />
          <div className="skeleton" style={{ width: 'min(32rem, 100%)', height: '2rem' }} />
          <div className="skeleton" style={{ width: '100%', height: '12rem' }} />
        </div>
      </section>
    </main>
  );
}