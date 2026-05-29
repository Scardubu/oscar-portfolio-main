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

type ScrollCinemaContextValue = {
  reducedMotion: boolean;
  activeChapter: ChapterId;
  activeChapterRef: MutableRefObject<ChapterId>;
  lenisRef: MutableRefObject<Lenis | null>;
  scrollYRef: MutableRefObject<number>;
  scrollProgressRef: MutableRefObject<number>;
  setActiveChapter: (chapter: ChapterId) => void;
  scrollToSection: (sectionId: string) => void;
};

const ScrollCinemaContext = createContext<ScrollCinemaContextValue | null>(null);

function getSectionOffset() {
  if (typeof window === 'undefined') return -88;
  const navHeightToken = getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-height')
    .trim();
  const navHeight = Number.parseFloat(navHeightToken);

  if (!Number.isFinite(navHeight)) return -88;
  return -(navHeight + 16);
}

export function useScrollCinema() {
  const value = useContext(ScrollCinemaContext);
  if (!value) {
    throw new Error('useScrollCinema must be used within ScrollCinemaProvider');
  }
  return value;
}

export function ScrollCinemaStaticProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeChapter, setActiveChapterState] = useState<ChapterId>('prologue');

  const activeChapterRef = useRef<ChapterId>('prologue');
  const lenisRef = useRef<Lenis | null>(null);
  const scrollYRef = useRef(0);
  const scrollProgressRef = useRef(0);

  const setActiveChapter = useCallback((chapter: ChapterId) => {
    activeChapterRef.current = chapter;
    setActiveChapterState(chapter);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.activeChapter = chapter;
    }
  }, []);

  const syncNativeScrollProgress = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
    const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
    const viewportHeight = window.innerHeight || doc.clientHeight || 0;
    const limit = Math.max(scrollHeight - viewportHeight, 0);

    scrollYRef.current = Math.max(0, scrollTop);
    scrollProgressRef.current = limit > 0 ? Math.min(1, Math.max(0, scrollTop / limit)) : 0;
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (typeof document === 'undefined' || typeof window === 'undefined') return;
      const el = document.getElementById(sectionId);
      if (!el) return;

      const top = el.getBoundingClientRect().top + window.scrollY + getSectionOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    [reducedMotion]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      const reduce = media.matches;
      setReducedMotion(reduce);
      document.documentElement.dataset.reducedMotion = reduce ? 'true' : 'false';
    };

    syncMotion();
    media.addEventListener('change', syncMotion);
    return () => media.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.activeChapter = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    document.documentElement.dataset.scrollEngine = 'static';

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
  }, [syncNativeScrollProgress]);

  const value = useMemo<ScrollCinemaContextValue>(
    () => ({
      reducedMotion,
      activeChapter,
      activeChapterRef,
      lenisRef,
      scrollYRef,
      scrollProgressRef,
      setActiveChapter,
      scrollToSection,
    }),
    [activeChapter, reducedMotion, scrollToSection, setActiveChapter]
  );

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

export function ScrollCinemaProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeChapter, setActiveChapterState] = useState<ChapterId>('prologue');

  const activeChapterRef = useRef<ChapterId>('prologue');
  const scrollYRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const pluginRegisteredRef = useRef(false);
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
    [reducedMotion, warnDev]
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

    if (!pluginRegisteredRef.current) {
      try {
        gsap.registerPlugin(ScrollTrigger);
        pluginRegisteredRef.current = true;
      } catch (error) {
        warnDev('GSAP ScrollTrigger registration failed. Falling back to static scrolling.', error);
      }
    }

    const safeRefresh = (force = false) => {
      try {
        ScrollTrigger.refresh(force);
      } catch (error) {
        warnDev('ScrollTrigger refresh failed.', error);
      }
    };

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
      safeRefresh(true);
      return () => {
        cleanupNative();
      };
    }

    let lenis: Lenis | null = null;
    let usingLenis = true;
    let cleanupNative: (() => void) | null = null;

    try {
      lenis = new Lenis({
        // 2026 best practice: lerp 0.08 gives cinematic glide without
        // feeling sluggish on flagship devices. Lower values feel syrupy
        // on mid-range hardware.
        lerp: 0.08,
        smoothWheel: true,
        // syncTouch: syncs lerp to touch velocity so scroll feels physical
        // on mobile Safari / Android Chrome. Without it, touch scroll has
        // the same artificial smoothing as wheel, which feels wrong.
        syncTouch: true,
        // Multipliers tuned for comfortable reading across device types.
        // wheelMultiplier 1 = native-feeling; touchMultiplier 1.1 = slight
        // momentum boost for swipe-heavy mobile navigation.
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
        // prevent: data-lenis-prevent elements (e.g. horizontal carousels) stop
        // Lenis from intercepting their internal scroll events. The callback
        // also auto-detects horizontally-scrollable containers so new components
        // don't need manual attribute management.
        prevent: (node: HTMLElement) => {
          return (
            node.hasAttribute('data-lenis-prevent') ||
            (node.scrollWidth > node.clientWidth + 4 &&
              ['auto', 'scroll'].includes(getComputedStyle(node).overflowX))
          );
        },
        // autoRaf: false — we drive the RAF via gsap.ticker below for
        // frame-perfect sync with GSAP ScrollTrigger. Double-RAF would
        // cause double updates and potential jank.
        autoRaf: false,
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

    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      syncScrollState(scroll, limit);
    };

    const syncScrollTrigger = () => {
      try {
        ScrollTrigger.update();
      } catch (error) {
        warnDev('ScrollTrigger update failed after Lenis scroll tick.', error);
      }
    };

    if (lenis) {
      lenis.on('scroll', onScroll);
      lenis.on('scroll', syncScrollTrigger);
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
      safeRefresh();
      syncNativeScrollProgress();
    };

    // Debounce resize/orientationchange refresh to avoid firing Lenis.resize()
    // on every pixel of a drag-resize or for each orientationchange event pulse.
    // 150ms is imperceptible to the user but prevents cascading layout reads.
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedRefresh = () => {
      if (refreshTimer !== null) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        refresh();
      }, 150);
    };

    window.addEventListener('resize', debouncedRefresh, { passive: true });
    window.addEventListener('orientationchange', debouncedRefresh, { passive: true });

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (lenis) lenis.start();
        safeRefresh(true);
        syncNativeScrollProgress();
        // Emergency recovery: React 19 concurrent unmount can race with the Navbar
        // scroll-lock cleanup and leave body.overflow stuck as 'hidden'.
        // Only clear if neither the attribute-based nor class-based lock is active.
        if (
          !document.documentElement.hasAttribute('data-nav-open') &&
          !document.body.classList.contains('nav-open') &&
          document.body.style.overflow === 'hidden'
        ) {
          document.body.style.overflow = '';
        }
      } else {
        if (lenis) lenis.stop();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(() => {
        safeRefresh(true);
        syncNativeScrollProgress();
      });
    }

    return () => {
      if (cleanupNative) {
        cleanupNative();
      }
      if (lenis) {
        lenis.off('scroll', onScroll);
        lenis.off('scroll', syncScrollTrigger);
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
      window.removeEventListener('resize', debouncedRefresh);
      window.removeEventListener('orientationchange', debouncedRefresh);
      if (refreshTimer !== null) clearTimeout(refreshTimer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion, syncNativeScrollProgress, syncScrollState, warnDev]);

  const value = useMemo<ScrollCinemaContextValue>(
    () => ({
      reducedMotion,
      activeChapter,
      activeChapterRef,
      lenisRef,
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
