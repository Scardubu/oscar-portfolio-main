import { Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <main id="main-content">
      <section className="pt-[calc(var(--nav-height)+var(--space-12))]">
        <div className="container grid gap-[var(--space-6)]">
          <Skeleton width="14rem" height="2rem" />
          <Skeleton width="min(42rem, 100%)" height="5rem" />
          <Skeleton width="min(36rem, 100%)" height="6rem" />
          <div className="grid gap-[var(--space-4)] [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <Skeleton height="12rem" />
            <Skeleton height="12rem" />
            <Skeleton height="12rem" />
          </div>
        </div>
      </section>
    </main>
  );
}
