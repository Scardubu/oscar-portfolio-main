import { Skeleton } from '@/components/Skeleton';

export default function WritingLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label="Loading writing index">
      <section className="pt-[calc(var(--nav-height)+var(--space-12))]">
        <div className="container grid gap-(--space-4)">
          <Skeleton width="10rem" height="1.5rem" />
          <Skeleton width="min(34rem, 100%)" height="4rem" />
          <Skeleton height="4rem" />
          <Skeleton height="4rem" />
          <Skeleton height="4rem" />
        </div>
      </section>
    </div>
  );
}
