'use client';

import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import { useRef } from 'react';

import { useChapterTimeline } from '@/hooks/useChapterTimeline';
import type { ChapterConfig } from '@/lib/cinematic/chapters';

type ChapterFrameProps = {
  chapter: ChapterConfig;
  children: ReactNode;
  ariaLabelledBy?: string;
  className?: string;
  contentClassName?: string;
};

function ChapterTransition({ chapter }: { chapter: ChapterConfig }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24">
      <div
        className="absolute inset-x-0 top-0 h-px opacity-70"
        // eslint-disable-next-line no-restricted-syntax
        style={{
          background: `linear-gradient(90deg, transparent, ${chapter.colors.accent}66, transparent)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        // eslint-disable-next-line no-restricted-syntax
        style={{
          background: `radial-gradient(circle at 50% 0%, ${chapter.colors.wash}66 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

export function ChapterFrame({
  chapter,
  children,
  ariaLabelledBy,
  className,
  contentClassName,
}: Readonly<ChapterFrameProps>) {
  const ref = useRef<HTMLElement>(null);

  useChapterTimeline({ chapter, rootRef: ref });

  return (
    <section
      ref={ref}
      id={chapter.sectionId}
      data-chapter={chapter.id}
      data-chapter-mood={chapter.mood}
      data-chapter-transition={chapter.transition}
      aria-labelledby={ariaLabelledBy}
      className={clsx('relative border-t py-[var(--section-py)]', className)}
      // eslint-disable-next-line no-restricted-syntax
      style={
        {
          '--chapter-accent': chapter.colors.accent,
          '--chapter-wash': chapter.colors.wash,
          '--chapter-ink': chapter.colors.ink,
        } as CSSProperties
      }
    >
      <div className={clsx('relative z-10 container', contentClassName)}>{children}</div>
      <p className="sr-only">
        {chapter.label}. {chapter.purpose} {chapter.transition}
      </p>
      <ChapterTransition chapter={chapter} />
    </section>
  );
}
