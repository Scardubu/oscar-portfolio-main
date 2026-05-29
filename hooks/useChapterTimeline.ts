'use client';

import gsap from 'gsap';
import { useLayoutEffect } from 'react';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import type { ChapterConfig } from '@/lib/cinematic/chapters';

type UseChapterTimelineArgs = {
  chapter: ChapterConfig;
  rootRef: React.RefObject<HTMLElement | null>;
};

export function useChapterTimeline({ chapter, rootRef }: UseChapterTimelineArgs) {
  const { reducedMotion, setActiveChapter } = useScrollCinema();

  useLayoutEffect(() => {
    // ENHANCEMENT 10: Defensive SSR guard. useLayoutEffect already only runs
    // client-side, but this explicit check prevents Next.js RSC static analysis
    // from emitting warnings when browser globals like window.matchMedia are
    // encountered while analysing the client module dependency graph.
    if (typeof window === 'undefined') return;

    const root = rootRef.current;
    if (!root) return;

    const mm = window.matchMedia('(min-width: 1024px)');
    // Pinning is intentionally disabled for reveal timelines (see the
    // ScrollTrigger config below). `mm` is retained only to keep the start
    // position slightly later on large viewports where sections are taller.
    const start =
      chapter.id === 'epilogue'
        ? 'top bottom'
        : reducedMotion
          ? 'top 85%'
          : mm.matches
            ? 'top 78%'
            : 'top 85%';

    let ctx: gsap.Context | null = null;
    const cleanupFns: Array<() => void> = [];

    try {
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const select = (selector: string): HTMLElement[] => q(selector) as HTMLElement[];

        const eyebrow = select('[data-cinematic="eyebrow"]');
        const title = select('[data-cinematic="title"]');
        const lede = select('[data-cinematic="lede"]');
        const media = select('[data-cinematic="media"]');
        const panel = select('[data-cinematic="panel"]');
        const card = select('[data-cinematic="card"]');
        const proof = select('[data-cinematic="proof"]');
        const cta = select('[data-cinematic="cta"]');

        const textTargets = [...eyebrow, ...title, ...lede, ...panel, ...card, ...proof, ...cta];
        const allTargets = [...textTargets, ...media];

        // FAILSAFE: force every cinematic target fully visible. Called if the
        // ScrollTrigger never fires (Lenis/ScrollTrigger desync, refresh race,
        // or pin spacer created before the timeline plays). Without this, a
        // pinned section can sit at autoAlpha:0 permanently — rendering a tall
        // empty void exactly the height of the pin distance (the desktop blank-
        // section bug). Cheap, idempotent, and safe to call repeatedly.
        const revealAll = () => {
          if (allTargets.length === 0) return;
          gsap.set(allTargets, { autoAlpha: 1, y: 0, scale: 1, clearProps: 'transform' });
        };

        if (textTargets.length > 0) {
          gsap.set(textTargets, {
            autoAlpha: 0,
            y: reducedMotion ? 0 : 18,
          });
        }

        if (media.length > 0) {
          gsap.set(media, {
            autoAlpha: 0,
            scale: reducedMotion ? 1 : 0.985,
            y: reducedMotion ? 0 : 20,
          });
        }

        // FAILSAFE 1: if the section is already within (or above) the viewport
        // at mount — common for the first section below the hero, or after a
        // hash-jump / reload mid-page — reveal immediately. ScrollTrigger's
        // onEnter won't fire for elements that start already in view.
        const initialRect = root.getBoundingClientRect();
        if (initialRect.top < window.innerHeight * 0.92) {
          revealAll();
        }

        // ARCHITECTURE FIX: reveal timelines must NOT pin.
        //
        // Pinning a content section to drive a scrub-reveal creates a tall
        // scroll spacer (the pin distance). If the timeline doesn't play to
        // completion — which happens when Lenis drives scroll through
        // gsap.ticker and ScrollTrigger's pin spacer is measured before the
        // first refresh settles — the section's content stays at autoAlpha:0
        // while the spacer remains, producing a viewport-tall empty void
        // (the desktop blank-section bug seen on Projects + Skills).
        //
        // A reveal animation has no need to pin. We use a simple non-pinned
        // trigger with toggleActions so the content fades in once on enter and
        // reverses on scroll-up. Parallax / scrub atmospherics are owned by the
        // ThreeBrushField + Framer hero, not by these section reveals.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start,
            end: reducedMotion ? 'bottom 65%' : 'bottom 45%',
            scrub: false,
            pin: false,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            toggleActions: reducedMotion ? 'play none none none' : 'play none none reverse',
            onEnter: () => setActiveChapter(chapter.id),
            onEnterBack: () => setActiveChapter(chapter.id),
            // FAILSAFE 2: on every ScrollTrigger refresh (resize, font load,
            // layout shift), if this section is already in view, force-reveal.
            // Guards against a refresh that recalculates the trigger to a point
            // already passed, which would otherwise leave content hidden.
            onRefresh: (self) => {
              if (self.isActive || self.progress > 0) revealAll();
            },
          },
          defaults: {
            ease: 'power3.out',
            duration: reducedMotion ? 0.35 : 0.7,
          },
        });

        if (media.length > 0) {
          tl.to(media, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8 }, 0);
        }

        if (eyebrow.length > 0) {
          tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.04);
        }
        if (title.length > 0) {
          tl.to(title, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.08);
        }
        if (lede.length > 0) {
          tl.to(lede, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.14);
        }
        if (panel.length > 0) {
          tl.to(panel, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.45 }, 0.2);
        }
        if (card.length > 0) {
          tl.to(card, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45 }, 0.24);
        }
        if (proof.length > 0) {
          tl.to(proof, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45 }, 0.26);
        }
        if (cta.length > 0) {
          tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.34);
        }

        // FAILSAFE 3 (timed safety net): if, 1200ms after setup, the timeline
        // still hasn't progressed (ScrollTrigger never armed, or scroll engine
        // didn't tick), force the section visible. This guarantees content is
        // NEVER permanently hidden, regardless of scroll-engine state. The
        // delay is long enough that a normal in-view reveal will have already
        // played, so this only fires in genuine failure cases.
        const safetyTimer = window.setTimeout(() => {
          if (tl.progress() === 0 && !tl.isActive()) {
            revealAll();
          }
        }, 1200);

        // Register the timer for cleanup via the gsap context's own teardown.
        cleanupFns.push(() => window.clearTimeout(safetyTimer));
      }, root);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '[chapter-timeline] gsap.context failed. Falling back to static section.',
          error
        );
      }
      // On any failure, ensure content is visible rather than stuck hidden.
      const root = rootRef.current;
      if (root) {
        gsap.set(root.querySelectorAll('[data-cinematic]'), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          clearProps: 'transform',
        });
      }
      return;
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx?.revert();
    };
  }, [chapter, reducedMotion, rootRef, setActiveChapter]);
}
