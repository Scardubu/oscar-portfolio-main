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
  // ENHANCEMENT 4: opt-out of the default top border.
  // Used by the first ChapterFrame below the hero (ProjectsSection) so the
  // atmospheric brush field flows continuously from hero into projects without
  // a hard horizontal rule cutting across the canvas.
  noBorderTop?: boolean;
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
  noBorderTop = false,
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
      className={clsx(
        'relative py-[var(--section-py)]',
        // Apply the default top border only when noBorderTop is false.
        // All sections except ProjectsSection retain this border for the
        // subtle inter-chapter visual rhythm it provides.
        !noBorderTop && 'border-t',
        className
      )}
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
      <ChapterTransition chapter={chapter} />
    </section>
  );
}
