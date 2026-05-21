'use client';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';

import type { ChapterId } from '@/lib/cinematic/chapters';
import { CHAPTERS } from '@/lib/cinematic/chapters';

gsap.registerPlugin(ScrollTrigger);

type ScrollCinemaContextValue = {
  reducedMotion: boolean;
  activeChapter: ChapterId;
  activeChapterRef: MutableRefObject<ChapterId>;
  scrollProgressRef: MutableRefObject<number>;
  setActiveChapter: (chapter: ChapterId) => void;
  scrollToSection: (sectionId: string) => void;
};

const ScrollCinemaContext = createContext<ScrollCinemaContextValue | null>(null);

export function useScrollCinema() {
  const value = useContext(ScrollCinemaContext);
  if (!value) {
    throw new Error('useScrollCinema must be used within ScrollCinemaProvider');
  }
  return value;
}

export function ScrollCinemaProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeChapter, setActiveChapterState] = useState<ChapterId>('prologue');

  const activeChapterRef = useRef<ChapterId>('prologue');
  const scrollProgressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  const setActiveChapter = useCallback((chapter: ChapterId) => {
    activeChapterRef.current = chapter;
    setActiveChapterState(chapter);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.activeChapter = chapter;
    }
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const maxAttempts = 120;

      const tryScroll = (attempt: number) => {
        const el = document.getElementById(sectionId);
        if (!el) {
          if (attempt < maxAttempts) {
            window.setTimeout(() => tryScroll(attempt + 1), 100);
          }
          return;
        }

        if (reducedMotion || !lenisRef.current) {
          el.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
          return;
        }

        // FIX BUG 1: removed `immediate: true` — that flag bypasses Lenis's
        // lerp interpolation and produces an instant jump instead of the
        // cinematic glide the design requires.
        lenisRef.current.scrollTo(el, { offset: -88 });
      };

      tryScroll(0);
    },
    [reducedMotion]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scrollFromHash = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      scrollToSection(id);
    };

    scrollFromHash();
    window.addEventListener('hashchange', scrollFromHash);

    return () => {
      window.removeEventListener('hashchange', scrollFromHash);
    };
  }, [scrollToSection]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMotion = () => {
      const reduce = media.matches;
      setReducedMotion(reduce);
      document.documentElement.dataset.reducedMotion = reduce ? 'true' : 'false';
    };

    syncMotion();
    media.addEventListener('change', syncMotion);

    return () => {
      media.removeEventListener('change', syncMotion);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pointerMedia = window.matchMedia('(pointer: fine)');

    const syncPointer = () => {
      document.documentElement.dataset.pointerFine = pointerMedia.matches ? 'true' : 'false';
    };

    syncPointer();
    pointerMedia.addEventListener('change', syncPointer);

    return () => {
      pointerMedia.removeEventListener('change', syncPointer);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.activeChapter = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (reducedMotion) {
      scrollProgressRef.current = 0;
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      ScrollTrigger.refresh(true);
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });

    lenisRef.current = lenis;

    // FIX ENHANCEMENT 8: removed the `ScrollTrigger.update()` call from
    // this handler. GSAP's ticker.add(raf) already drives ScrollTrigger
    // internally — calling update() here caused double-processing per frame
    // and introduced subtle animation stutter on pinned sections.
    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      scrollProgressRef.current = limit > 0 ? scroll / limit : 0;
    };

    lenis.on('scroll', onScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('orientationchange', refresh, { passive: true });

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        ScrollTrigger.refresh(true);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(() => ScrollTrigger.refresh(true));
    }

    return () => {
      lenis.off('scroll', onScroll);
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(raf);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  const value = useMemo<ScrollCinemaContextValue>(
    () => ({
      reducedMotion,
      activeChapter,
      activeChapterRef,
      scrollProgressRef,
      setActiveChapter,
      scrollToSection,
    }),
    [activeChapter, reducedMotion, scrollToSection, setActiveChapter]
  );

  // ENHANCEMENT 9: visually hidden aria-live region that announces the active
  // chapter label to screen readers each time the chapter changes. aria-live
  // "polite" waits for the current utterance to finish before announcing —
  // appropriate for ambient scroll navigation context.
  const chapterLabel = CHAPTERS.find((c) => c.id === activeChapter)?.label ?? '';

  return (
    <ScrollCinemaContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {`Now viewing: ${chapterLabel}`}
      </div>
    </ScrollCinemaContext.Provider>
  );
}
