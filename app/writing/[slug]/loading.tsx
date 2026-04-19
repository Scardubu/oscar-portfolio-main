import { Skeleton } from '@/components/Skeleton';

export default function WritingPostLoading() {
  return (
    <main id="main-content">
      <section className="pt-[calc(var(--nav-height)+var(--space-12))]">
        <div className="container grid gap-(--space-4)">
          <Skeleton width="8rem" height="1rem" />
          <Skeleton width="min(42rem, 100%)" height="4rem" />
          <Skeleton width="14rem" height="1rem" />
          <Skeleton height="10rem" />
        </div>
      </section>
    </main>
  );
}
