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

import { trackSectionView } from '@/app/lib/analytics';
import type { ChapterId } from '@/lib/cinematic/chapters';
import { CHAPTERS } from '@/lib/cinematic/chapters';

gsap.registerPlugin(ScrollTrigger);

type ScrollCinemaContextValue = {
  reducedMotion: boolean;
  activeChapter: ChapterId;
  activeChapterRef: MutableRefObject<ChapterId>;
  scrollYRef: MutableRefObject<number>;
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
  const scrollYRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const trackedSectionsRef = useRef(new Set<ChapterId>());

  const warnDev = useCallback((message: string, error?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[scroll-cinema] ${message}`, error);
    }
  }, []);

  const syncScrollState = useCallback((scrollTop: number, limit: number) => {
    const clampedScrollTop = Math.max(0, scrollTop);
    scrollYRef.current = clampedScrollTop;
    scrollProgressRef.current = limit > 0 ? Math.min(1, Math.max(0, clampedScrollTop / limit)) : 0;
  }, []);

  const syncNativeScrollProgress = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
    const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
    const viewportHeight = window.innerHeight || doc.clientHeight || 0;
    const limit = Math.max(scrollHeight - viewportHeight, 0);
    syncScrollState(scrollTop, limit);
  }, [syncScrollState]);

  const getSectionOffset = useCallback(() => {
    if (typeof window === 'undefined') return -88;
    const navHeightToken = getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height')
      .trim();
    const navHeight = Number.parseFloat(navHeightToken);

    if (!Number.isFinite(navHeight)) return -88;
    return -(navHeight + 16);
  }, []);

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

      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      const tryScroll = (attempt: number) => {
        const el = document.getElementById(sectionId);
        if (!el) {
          if (attempt < maxAttempts) {
            retryTimerRef.current = window.setTimeout(() => {
              retryTimerRef.current = null;
              tryScroll(attempt + 1);
            }, 80);
          }
          return;
        }

        retryTimerRef.current = null;

        const nativeScroll = () => {
          const top = el.getBoundingClientRect().top + window.scrollY + getSectionOffset();
          window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' });
        };

        if (reducedMotion || !lenisRef.current) {
          nativeScroll();
          return;
        }

        // FIX BUG 1: removed `immediate: true` — that flag bypasses Lenis's
        // lerp interpolation and produces an instant jump instead of the
        // cinematic glide the design requires.
        try {
          lenisRef.current.scrollTo(el, { offset: getSectionOffset() });
        } catch (error) {
          warnDev('Lenis scrollTo failed. Falling back to native smooth scrolling.', error);
          lenisRef.current = null;
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.scrollEngine = 'native';
          }
          nativeScroll();
        }
      };

      tryScroll(0);
    },
    [getSectionOffset, reducedMotion, warnDev]
  );

  useEffect(() => {
    return () => {
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

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
    if (typeof document === 'undefined') return;

    const chapter = CHAPTERS.find((item) => item.id === activeChapter);
    if (!chapter) return;
    if (!document.getElementById(chapter.sectionId)) return;
    if (trackedSectionsRef.current.has(chapter.id)) return;

    trackedSectionsRef.current.add(chapter.id);
    trackSectionView(chapter.sectionId, chapter.id, chapter.label);
  }, [activeChapter]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setupNativeScrollProgress = () => {
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.scrollEngine = 'native';
      }

      const onNativeScroll = () => {
        syncNativeScrollProgress();
      };

      onNativeScroll();

      window.addEventListener('scroll', onNativeScroll, { passive: true });
      window.addEventListener('resize', onNativeScroll, { passive: true });
      window.addEventListener('orientationchange', onNativeScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', onNativeScroll);
        window.removeEventListener('resize', onNativeScroll);
        window.removeEventListener('orientationchange', onNativeScroll);
      };
    };

    if (reducedMotion) {
      if (lenisRef.current) {
        try {
          lenisRef.current.destroy();
        } catch (error) {
          warnDev('Lenis destroy failed while entering reduced-motion mode.', error);
        }
        lenisRef.current = null;
      }
      const cleanupNative = setupNativeScrollProgress();
      ScrollTrigger.refresh(true);
      return () => {
        cleanupNative();
      };
    }

    let lenis: Lenis | null = null;
    let usingLenis = true;
    let cleanupNative: (() => void) | null = null;

    try {
      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
      });
      lenisRef.current = lenis;
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.scrollEngine = 'lenis';
      }
    } catch (error) {
      usingLenis = false;
      lenisRef.current = null;
      warnDev('Lenis initialization failed. Falling back to native scrolling.', error);
      cleanupNative = setupNativeScrollProgress();
    }

    // FIX ENHANCEMENT 8: removed the `ScrollTrigger.update()` call from
    // this handler. GSAP's ticker.add(raf) already drives ScrollTrigger
    // internally — calling update() here caused double-processing per frame
    // and introduced subtle animation stutter on pinned sections.
    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      syncScrollState(scroll, limit);
    };

    if (lenis) {
      lenis.on('scroll', onScroll);
      syncNativeScrollProgress();
    }

    const raf = (time: number) => {
      if (!usingLenis || !lenis) return;
      lenis.raf(time * 1000);
    };

    if (usingLenis) {
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const refresh = () => {
      ScrollTrigger.refresh();
      syncNativeScrollProgress();
    };

    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('orientationchange', refresh, { passive: true });

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        ScrollTrigger.refresh(true);
        syncNativeScrollProgress();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(() => {
        ScrollTrigger.refresh(true);
        syncNativeScrollProgress();
      });
    }

    return () => {
      if (cleanupNative) {
        cleanupNative();
      }
      if (lenis) {
        lenis.off('scroll', onScroll);
        try {
          lenis.destroy();
        } catch (error) {
          warnDev('Lenis destroy failed during ScrollCinemaProvider cleanup.', error);
        }
      }
      lenisRef.current = null;
      if (usingLenis) {
        gsap.ticker.remove(raf);
      }
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion, syncNativeScrollProgress, syncScrollState, warnDev]);

  const value = useMemo<ScrollCinemaContextValue>(
    () => ({
      reducedMotion,
      activeChapter,
      activeChapterRef,
      scrollYRef,
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
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {`Now viewing: ${chapterLabel}`}
      </div>
    </ScrollCinemaContext.Provider>
  );
}
