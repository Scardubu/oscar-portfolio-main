'use client';

// CONVICTION ENGINE — ScrollProgress v2.0
//
// CHANGES from v1.0:
//   - Active dot now uses `.chapter-dot-active` CSS class (defined in globals.css)
//     which drives a `chapter-dot-breathe` keyframe animation whose glow colour is
//     bound to `--chapter-accent`. Because `--chapter-accent` is a registered
//     @property with a 0.65s transition, the glow cross-fades between chapters at
//     zero JS cost.
//   - Tooltip label is now always rendered (opacity-0 → opacity-100 on hover/focus)
//     instead of conditionally mounted — prevents layout shift and FOUC.
//   - All scale/opacity transitions on the rail use CSS `transition` only (no
//     framer-motion) to avoid adding a scroll subscriber to the page. Framer's
//     `useScroll` must NOT be called in any homepage component — it would compete
//     with Lenis. This rail is purely CSS-driven.
//   - `aria-current="step"` is preserved on the active button.
//   - `data-reduced-motion` attribute is kept for Playwright smoke tests.

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
                'group relative flex h-3.5 w-3.5 items-center justify-center rounded-full',
                // CSS transition handles scale — no framer-motion scroll hook
                'transition-all duration-300',
                active ? 'scale-110' : 'scale-100 opacity-50 hover:scale-105 hover:opacity-90',
              ].join(' ')}
              aria-label={`Jump to ${chapter.label}`}
              aria-current={active ? 'step' : undefined}
            >
              {/* Dot — uses .chapter-dot-active for CSS-driven glow animation */}
              <span
                className={[
                  'h-2.5 w-2.5 rounded-full border transition-all duration-300',
                  active ? 'chapter-dot-active border-white/40' : 'border-white/20 bg-white/10',
                ].join(' ')}
              />

              {/* Tooltip — always rendered, opacity-toggled for no layout shift */}
              <span
                className={[
                  'pointer-events-none absolute top-1/2 right-7 -translate-y-1/2',
                  'rounded-full border border-white/8 bg-black/70 px-2.5 py-1',
                  'font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-white/70 uppercase',
                  'opacity-0 transition-opacity duration-200',
                  'group-hover:opacity-100 group-focus-visible:opacity-100',
                  'hidden lg:block',
                ].join(' ')}
              >
                {chapter.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
