'use client';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import { CHAPTERS } from '@/lib/cinematic/chapters';

export function ScrollProgress() {
  const { activeChapter, scrollToSection, reducedMotion } = useScrollCinema();

  return (
    <nav
      aria-label="Chapter progress"
      data-testid="scroll-progress"
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
      className={[
        'fixed top-1/2 right-4 z-[60] hidden -translate-y-1/2 lg:flex',
        reducedMotion ? 'pointer-events-none opacity-35' : 'pointer-events-auto',
      ].join(' ')}
    >
      <div className="flex flex-col items-center gap-3 rounded-full border border-white/8 bg-black/30 px-2 py-3 backdrop-blur-md">
        {CHAPTERS.map((chapter) => {
          const active = chapter.id === activeChapter;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToSection(chapter.sectionId)}
              className={[
                'group relative flex h-3.5 w-3.5 items-center justify-center rounded-full transition',
                active ? 'scale-110' : 'opacity-60 hover:opacity-100',
              ].join(' ')}
              aria-label={`Jump to ${chapter.label}`}
              aria-current={active ? 'step' : undefined}
            >
              <span
                className={[
                  'h-2.5 w-2.5 rounded-full border transition',
                  active
                    ? 'border-white/60 bg-[var(--chapter-accent,#67e8f9)] shadow-[0_0_18px_rgba(103,232,249,0.35)]'
                    : 'border-white/20 bg-white/10',
                ].join(' ')}
                // eslint-disable-next-line no-restricted-syntax
                style={
                  active
                    ? {
                        background: chapter.colors.accent,
                        boxShadow: `0 0 18px ${chapter.colors.accent}55`,
                      }
                    : undefined
                }
              />
              <span className="pointer-events-none absolute top-1/2 right-7 hidden -translate-y-1/2 rounded-full border border-white/8 bg-black/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-white/70 uppercase opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
                {chapter.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
