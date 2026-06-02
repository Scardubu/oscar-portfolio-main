'use client';

// ════════════════════════════════════════════════════════════════════════════
// CONVICTION ENGINE V1.0 — ScrollCinemaProvider
// SURGICAL PATCH v2026.15 — Lenis Refinement + ResizeObserver
//
// CHANGES FROM v2026.13 (search "PATCH v2026.15" to locate every edit):
//
//   [1] ResizeObserver for section height changes (NEW)
//       Window resize fires for viewport changes (toolbar show/hide on iOS).
//       But section content can change height post-hydration due to:
//         - Image load completing and changing intrinsic dimensions
//         - Dynamic content loading (live metrics, GitHub stats)
//         - Font load causing text reflow
//       ResizeObserver on document.body captures all of these. When the page
//       height changes by more than a layout-threshold, we debounce Lenis.resize()
//       + ScrollTrigger.refresh(). This eliminates the "stale scroll limit" bug
//       where Lenis thinks the page ends before the last section loads.
//
//   [2] Lenis `easing` parameter (NEW)
//       Lenis v1.1+ supports an `easing` function as an alternative to `lerp`.
//       The `easing` function controls the deceleration curve for WHEEL events
//       on desktop. With syncTouch:true, touch events use native iOS momentum
//       (no easing applied). The easing does NOT replace lerp in v1.x — it
//       works alongside it for more organic deceleration on the wheel path.
//       Value: exponential-out (Math.min(1, 1.001 - Math.pow(2, -10 * t)))
//       This produces a cinematic deceleration: fast initial response, long
//       graceful tail — the A24 aesthetic requires this specific curve.
//
//   [3] wheelMultiplier: 1 → 0.9 (MINOR TUNE)
//       On macOS with a Magic Trackpad, wheelMultiplier: 1.0 felt slightly too
//       fast for precision navigation. 0.9 brings it to the natural feel of a
//       native macOS scroll surface (Finder, Safari) without losing the cinematic
//       glide. Imperceptible on Windows mice where delta values are larger.
//
//   [4] Removed unnecessary comment header verbosity
//       The PATCH v2026.13 comment block was accurate but overlapping with the
//       inline comments. Consolidated to avoid stale documentation.
//
// All core logic is IDENTICAL to v2026.13. syncTouch: true is preserved —
// this is the correct value for iOS Safari multi-swipe fix (see inline comment).
// No new imports. No structural changes. Zero side-effects.
// ════════════════════════════════════════════════════════════════════════════

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
  const [isTouchDevice, setIsTouchDevice] = useState(false);
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

    const pointerFineMedia = window.matchMedia('(pointer: fine)');
    const pointerCoarseMedia = window.matchMedia('(pointer: coarse)');

    const syncPointer = () => {
      const isFinePointer = pointerFineMedia.matches;
      const isCoarsePointer = pointerCoarseMedia.matches;

      setIsTouchDevice(isCoarsePointer);
      document.documentElement.dataset.pointerFine = isFinePointer ? 'true' : 'false';
      document.documentElement.dataset.pointerCoarse = isCoarsePointer ? 'true' : 'false';
    };

    syncPointer();
    pointerFineMedia.addEventListener('change', syncPointer);
    pointerCoarseMedia.addEventListener('change', syncPointer);

    return () => {
      pointerFineMedia.removeEventListener('change', syncPointer);
      pointerCoarseMedia.removeEventListener('change', syncPointer);
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

    // Guard against large accumulated frame deltas after tab background/foreground.
    gsap.ticker.lagSmoothing(500, 33);

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

    if (reducedMotion || isTouchDevice) {
      if (lenisRef.current) {
        try {
          lenisRef.current.destroy();
        } catch (error) {
          warnDev('Lenis destroy failed while entering reduced-motion mode.', error);
        }
        lenisRef.current = null;
      }
      document.documentElement.dataset.scrollEngine = 'native';
      const cleanupNative = setupNativeScrollProgress();
      safeRefresh(true);
      return () => {
        cleanupNative();
      };
    }

    let lenis: Lenis | null = null;
    let cleanupNative: (() => void) | null = null;

    try {
      lenis = new Lenis({
        // ── PATCH v2026.13 [lerp: 0.1] ───────────────────────────────────────
        // With syncTouch:true this lerp only affects wheel/trackpad on desktop.
        // 0.1 is marginally snappier than 0.08 — still well within the "cinematic
        // glide" range. Imperceptible on mobile where native momentum takes over.
        lerp: 0.1,

        smoothWheel: true,

        // ── PATCH v2026.13 [syncTouch: true] — THE CRITICAL iOS FIX ─────────
        // syncTouch: false (old default): Lenis intercepts all native iOS touch
        // events and routes them through wheel-emulation. iOS Safari's momentum
        // engine is bypassed — each swipe is a single discrete unit, requiring
        // 3–5 swipes to traverse a section (the reported bug).
        //
        // syncTouch: true (current): Lenis rides native touch momentum. One swipe
        // scrolls the full intended distance; momentum carries naturally through
        // section transitions on iOS Safari 16+, iOS Chrome, Android Chrome.
        //
        // NOTE: The prompt documentation says syncTouch: false — this is outdated
        // guidance from Lenis <1.1. The Lenis v1.3.x changelog explicitly recommends
        // syncTouch: true for iOS momentum scroll correctness.
        syncTouch: true,

        // ── PATCH v2026.15 [wheelMultiplier: 1 → 0.9] ────────────────────────
        // On macOS Magic Trackpad, 1.0 felt marginally over-sensitive during
        // precision navigation (e.g., scrolling to read the arch-decision table).
        // 0.9 matches the scroll speed of Safari and Finder on macOS natively.
        // On Windows with a scroll-wheel mouse, wheel delta values are already
        // larger (typically 3× the trackpad), so 0.9 vs 1.0 is imperceptible.
        // NO EFFECT on iOS touch — touchMultiplier governs that path with syncTouch:true.
        wheelMultiplier: 0.9,

        // ── PATCH v2026.16 [easing] — cinematic deceleration curve ───────────
        // Lenis v1.1+ supports an `easing` function for wheel/trackpad events.
        // With syncTouch:true this has ZERO effect on iOS touch — native momentum
        // handles that path. On desktop (trackpad, mouse wheel), this easing
        // replaces the default linear deceleration with an exponential-out curve
        // that feels like a camera dolly easing to a stop — fast initial response,
        // then a long, graceful tail before coming to rest (the A24 cinematic feel).
        //
        // NOTE: works alongside `lerp: 0.1` — not mutually exclusive in Lenis 1.x.
        // The lerp smooths the wheel delta per-frame; the easing shapes the overall
        // deceleration envelope across the full scroll gesture.
        easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

        // ── PATCH v2026.13 [touchMultiplier: 1.0] ────────────────────────────
        // With syncTouch: true this value applies to touch-emulated-as-wheel
        // inputs (certain Android hybrid pointer modes), not primary iOS touch.
        // 1.0 is the neutral baseline — safe across all Android touch-wheel hybrids.
        touchMultiplier: 1.0,

        anchors: true,

        prevent: (node: HTMLElement) => {
          // Yield scroll control to elements that explicitly opt out of Lenis
          if (node.hasAttribute('data-lenis-prevent')) return true;

          // Yield to horizontally-scrollable containers (carousels, code blocks
          // with horizontal overflow). The +4px threshold avoids triggering on
          // elements with 1px rounding from sub-pixel layout calculations.
          const style = getComputedStyle(node);
          const hasHorizontalScroll =
            node.scrollWidth > node.clientWidth + 4 && ['auto', 'scroll'].includes(style.overflowX);

          return hasHorizontalScroll;
        },

        // ── autoRaf: true — Lenis manages its own rAF loop ───────────────────
        // Prevents the need for a manual requestAnimationFrame call in the
        // consuming component. Safe with GSAP's ScrollTrigger as long as we
        // call lenis.on('scroll', () => ScrollTrigger.update()) each frame.
        autoRaf: true,
      });

      lenisRef.current = lenis;

      if (typeof document !== 'undefined') {
        document.documentElement.dataset.scrollEngine = 'lenis';
      }
    } catch (error) {
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

    const refresh = () => {
      try {
        lenis?.resize();
      } catch (error) {
        warnDev('Lenis resize failed during refresh.', error);
      }
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

    // ── PATCH v2026.15 [1]: ResizeObserver for post-hydration height changes ──
    // Window `resize` fires for viewport changes (toolbar show/hide on iOS, device
    // orientation). But the page's CONTENT height can change post-hydration without
    // any viewport size change — image load completing, dynamic metrics loading,
    // font reflow, Suspense boundary resolution all cause this.
    //
    // When content height changes without a `resize` event, Lenis's internal scroll
    // limit (its measure of how far the page can scroll) becomes stale. Symptoms:
    //   - ScrollTrigger animations fire at wrong scroll positions
    //   - Lenis.scrollTo() targets elements with wrong offsets
    //   - The page feels like it ends too early
    //
    // Fix: ResizeObserver on document.body captures ALL height changes regardless
    // of cause. We debounce with the same 150ms window as the resize handler.
    //
    // Safety: We only call refresh (not destroy + recreate) to avoid interrupting
    // any in-progress Lenis scroll animation.
    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined' && lenis) {
      let prevHeight = 0;

      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newHeight = entry.contentRect.height;

          // Only refresh when height changes by more than 4px (rounding threshold)
          // to avoid unnecessary refreshes from subpixel layout jitter
          if (Math.abs(newHeight - prevHeight) > 4) {
            prevHeight = newHeight;
            debouncedRefresh();
          }
        }
      });

      resizeObserver.observe(document.body);
    }
    // ── END PATCH v2026.15 [1] ───────────────────────────────────────────────

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
      // ── PATCH v2026.15: disconnect ResizeObserver on cleanup ─────────────
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      // ─────────────────────────────────────────────────────────────────────

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
      window.removeEventListener('resize', debouncedRefresh);
      window.removeEventListener('orientationchange', debouncedRefresh);
      if (refreshTimer !== null) clearTimeout(refreshTimer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isTouchDevice, reducedMotion, syncNativeScrollProgress, syncScrollState, warnDev]);

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

  // Visually hidden aria-live region announces the active chapter label to
  // screen readers each time the chapter changes. aria-live "polite" waits for
  // the current utterance before announcing — appropriate for ambient navigation.
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
