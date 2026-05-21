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
    const canPin = Boolean(chapter.pin && mm.matches && !reducedMotion);
    const start = canPin ? 'top top' : reducedMotion ? 'top 85%' : 'top 72%';

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      const eyebrow = q('[data-cinematic="eyebrow"]');
      const title = q('[data-cinematic="title"]');
      const lede = q('[data-cinematic="lede"]');
      const media = q('[data-cinematic="media"]');
      const panel = q('[data-cinematic="panel"]');
      const card = q('[data-cinematic="card"]');
      const proof = q('[data-cinematic="proof"]');
      const cta = q('[data-cinematic="cta"]');

      gsap.set([eyebrow, title, lede, panel, card, proof, cta], {
        autoAlpha: 0,
        y: reducedMotion ? 0 : 18,
      });
      gsap.set(media, {
        autoAlpha: 0,
        scale: reducedMotion ? 1 : 0.985,
        y: reducedMotion ? 0 : 20,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start,
          end: canPin
            ? () => `+=${Math.max(root.offsetHeight * 1.15, window.innerHeight)}`
            : reducedMotion
              ? 'bottom 65%'
              : 'bottom 45%',
          scrub: canPin && !reducedMotion ? chapter.motion.scrub : false,
          pin: canPin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          toggleActions: canPin || reducedMotion ? undefined : 'play none none reverse',
          onEnter: () => setActiveChapter(chapter.id),
          onEnterBack: () => setActiveChapter(chapter.id),
        },
        defaults: {
          ease: 'power3.out',
          duration: reducedMotion ? 0.35 : 0.7,
        },
      });

      tl.to(media, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8 }, 0)
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.04)
        .to(title, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.08)
        .to(lede, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.14)
        .to(panel, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.45 }, 0.2)
        .to(card, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45 }, 0.24)
        .to(proof, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45 }, 0.26)
        .to(cta, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.34);
    }, root);

    return () => ctx.revert();
  }, [chapter, reducedMotion, rootRef, setActiveChapter]);
}
