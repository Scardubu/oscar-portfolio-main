import { Skeleton } from '@/components/Skeleton';

export default function WorkCaseLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label="Loading case study">
      <section className="pt-[calc(var(--nav-height)+var(--space-12))]">
        <div className="container grid gap-(--space-4)">
          <Skeleton width="8rem" height="1rem" />
          <Skeleton width="min(40rem, 100%)" height="4rem" />
          <Skeleton width="min(32rem, 100%)" height="2rem" />
          <Skeleton height="12rem" />
        </div>
      </section>
    </div>
  );
}
