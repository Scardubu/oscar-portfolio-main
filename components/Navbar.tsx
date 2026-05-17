'use client';

// CONVICTION ENGINE v22.0 — Navbar
//
// v22 vs v21:
//   [FIX SCROLL_FLICKER-1]: Removed `activeSection` from scroll useEffect deps.
//     Previous: `}, [activeSection])` — the dependency caused the entire scroll
//     listener to teardown and re-register every time a section boundary was crossed.
//     Each re-registration cycle triggered a React re-render of the header, which
//     forced the GPU compositor to re-evaluate the backdrop-blur stacking context
//     and caused the hamburger button to flash visibly.
//     Fix: `activeSectionRef` stores the current section for use inside the RAF
//     closure. `setActiveSection` still uses functional updates for correctness.
//     Effect deps: `[]` — registered once on mount, cleaned up on unmount.
//
//   [FIX SCROLL_FLICKER-2]: Added `scrolledRef` guard to `setScrolled`.
//     Previous: `setScrolled(window.scrollY > 16)` fired on every scroll event,
//     even when the boolean hadn't changed. While React bails on same-value state
//     updates, the scheduler overhead still touched the fiber tree on every tick.
//     Fix: Compare new value to ref before calling setState — zero re-renders when
//     the scroll position is already past or before the 16px threshold.
//
//   [FIX SCROLL_FLICKER-3]: Removed `backdrop-blur-xl` from the hamburger button.
//     Root cause: when the header conditionally gains `backdrop-blur-2xl` on scroll,
//     the browser must promote the header to a new GPU compositor layer to render
//     the backdrop filter. The child button's own `backdrop-blur-xl` forced a
//     *nested* compositor context inside the newly promoted parent — this rebuild
//     produced the visible flash on the button at the scroll threshold boundary.
//     Fix: Remove the button's backdrop-blur. It sits inside a header that already
//     handles blur when scrolled; the button's own filter was redundant AND harmful.
//
//   [FIX SCROLL_FLICKER-4]: Button `transition-all duration-300` → `transition-colors duration-200`.
//     `transition-all` was catching every CSS property change, including compositor-
//     triggered repaints from the parent header. Scoping to `transition-colors`
//     prevents the button from responding to non-color layout changes.
//
//   [FIX SCROLL_FLICKER-5]: Added `will-change: transform` (via Tailwind `transform-gpu`)
//     and `translateZ(0)` to the header. This permanently promotes the header to its
//     own compositor layer before any scroll interaction occurs. Without this, the
//     layer is created on-demand when `backdrop-blur-2xl` first activates — the
//     on-demand promotion itself is the flash. Permanent promotion eliminates it.
//
//   [FIX SCROLL_FLICKER-6]: Scoped header class transition from `transition-all` to
//     `transition-[background-color,border-color,backdrop-filter]`. This prevents
//     the CSS transition engine from catching unrelated property changes during
//     Framer Motion's entrance animation and scroll-parallax transforms.
//
//   [FIX UX]: Icon swap (Menu ↔ X) now uses AnimatePresence with opacity crossfade.
//     Previous: hard switch caused a perceived flash as the icon changed abruptly.
//     Fix: 120ms opacity fade through zero — imperceptible duration, removes flash.
//
//   KEEP: All v21 nav tracking logic (IntersectionObserver + scroll fallback),
//     mobile overflow lock, resize close, keyboard navigation, active pill layoutId,
//     all ARIA attributes, all focus rings, all touch targets.

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { anchorUrl } from '@/lib/config';

type SectionId =
  | 'section-projects'
  | 'section-testimonials'
  | 'open-source'
  | 'skills'
  | 'section-about'
  | 'section-writing'
  | 'section-contact';

type NavItem = {
  label: string;
  href: `#${SectionId}`;
  id: SectionId;
};

const SECTION_IDS = [
  'section-projects',
  'section-testimonials',
  'open-source',
  'skills',
  'section-about',
  'section-writing',
  'section-contact',
] as const satisfies readonly SectionId[];

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects',    href: '#section-projects',    id: 'section-projects'    },
  { label: 'Record',      href: '#section-testimonials',id: 'section-testimonials'},
  { label: 'Open Source', href: '#open-source',          id: 'open-source'         },
  { label: 'Skills',      href: '#skills',               id: 'skills'              },
  { label: 'About',       href: '#section-about',        id: 'section-about'       },
  { label: 'Writing',     href: '#section-writing',      id: 'section-writing'     },
  { label: 'Contact',     href: '#section-contact',      id: 'section-contact'     },
];

const navbarVariants = {
  hidden:  { y: -32, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.18 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, staggerChildren: 0.04 },
  },
};

const mobileItemVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0  },
};

// Icon crossfade variants — 120ms is imperceptible but eliminates the hard flash
const iconVariants = {
  hidden:  { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.12 } },
  exit:    { opacity: 0, scale: 0.8, transition: { duration: 0.08 } },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('section-projects');
  const [scrolled, setScrolled]         = useState(false);

  const reducedMotion = useReducedMotion();

  // Refs used inside RAF closures — avoid stale closure reads without
  // putting these values into useEffect dependency arrays.
  const tickingRef        = useRef(false);
  const visibilityRef     = useRef<Map<SectionId, number>>(new Map());
  const activeSectionRef  = useRef<SectionId>('section-projects');
  const scrolledRef       = useRef(false);

  const navItems = useMemo(() => NAV_ITEMS, []);

  // ── Scroll tracking ─────────────────────────────────────────────────────────
  // FIX v22: deps [] — registered once. activeSectionRef replaces the stale
  // closure read of `activeSection` that forced re-registration on every change.
  useEffect(() => {
    const handleScroll = () => {
      // Guard: only call setState when the boolean actually changes.
      // Eliminates the re-render storm that touched every scroll tick previously.
      const isScrolled = window.scrollY > 16;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }

      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        let nextActive: SectionId = activeSectionRef.current;

        const visibleSections = visibilityRef.current;

        if (visibleSections.size > 0) {
          const sorted = [...visibleSections.entries()].sort((a, b) => b[1] - a[1]);
          nextActive = sorted[0][0];
        } else {
          let closestId: SectionId = SECTION_IDS[0];
          let closestDistance = Number.POSITIVE_INFINITY;

          SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const distance = Math.abs(el.getBoundingClientRect().top);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestId = id;
            }
          });

          nextActive = closestId;
        }

        setActiveSection((prev) => {
          if (prev === nextActive) return prev;
          activeSectionRef.current = nextActive;
          return nextActive;
        });

        tickingRef.current = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // ← FIX: empty deps — no re-registration on section change

  // ── IntersectionObserver — section visibility tracking ──────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibilityMap = visibilityRef.current;
        entries.forEach((entry) => {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) {
            visibilityMap.set(id, entry.intersectionRatio);
          } else {
            visibilityMap.delete(id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-15% 0px -45% 0px',
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1],
      }
    );

    const elements: HTMLElement[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      elements.push(el);
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  // ── Mobile body lock ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [mobileOpen]);

  // ── Close mobile menu on desktop resize ──────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <m.header
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        // FIX v22: `transform-gpu` (will-change: transform) permanently promotes
        // the header to its own compositor layer. Without this, the layer is
        // created on-demand when backdrop-blur first activates — the on-demand
        // promotion IS the visible flash. Permanent promotion eliminates it.
        //
        // `transition-[background-color,border-color,backdrop-filter]` replaces
        // `transition-all` — scoped transitions don't catch unrelated repaints
        // from FM entrance animation or scroll-parallax transforms on children.
        className={[
          'fixed inset-x-0 top-0 z-50 transform-gpu',
          'transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled
            ? 'border-b border-white/10 bg-black/70 backdrop-blur-2xl'
            : 'bg-transparent',
        ].join(' ')}
        style={{ translateZ: 0 }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Wordmark */}
          <Link
            href="/"
            className="group relative flex items-center gap-3 rounded-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(70%_0.21_188)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Oscar Ndugbu — Homepage"
          >
            <m.span
              className="nav-wordmark-luminary sm:hidden"
              whileHover={reducedMotion ? undefined : { y: -1 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              Oscar
            </m.span>

            <div className="hidden sm:flex sm:flex-col sm:gap-0.5">
              <m.span
                className="nav-wordmark-luminary"
                whileHover={reducedMotion ? undefined : { y: -1 }}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                Oscar
              </m.span>
              <span className="nav-tagline text-white/50">
                Staff+ Engineer · Lagos → Global
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <Link key={item.id} href={item.href} className="relative">
                  <div
                    className={[
                      'relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300',
                      active ? 'text-white' : 'text-white/60 hover:text-white',
                    ].join(' ')}
                  >
                    {active && (
                      <m.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-xl border border-cyan-400/20 bg-white/10 backdrop-blur-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href={anchorUrl('section-contact')}
            className="hidden lg:inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(73%_0.18_196)] focus-visible:ring-offset-2 focus-visible:ring-offset-black hover:bg-[oklch(73%_0.18_196_/_0.08)]"
            style={{
              borderColor: 'oklch(73% 0.18 196 / 0.55)',
              color: 'oklch(73% 0.18 196)',
            }}
          >
            Hire Oscar
          </Link>

          {/* Hamburger — FIX v22:
              - backdrop-blur-xl REMOVED: was fighting parent header's compositing
                layer and causing flash on scroll threshold crossing.
              - transition-all → transition-colors: scopes CSS transitions to color
                properties only, preventing the button from catching parent repaints.
              - AnimatePresence on icon: crossfade eliminates hard icon-swap flash. */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors duration-200 hover:border-white/20 hover:bg-white/10 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(73%_0.18_196)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <m.span
                  key="close"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </m.span>
              ) : (
                <m.span
                  key="open"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </m.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </m.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Panel */}
            <m.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-3xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex flex-col p-4">
                {navItems.map((item) => {
                  const active = activeSection === item.id;
                  return (
                    <m.div
                      key={item.id}
                      variants={mobileItemVariants}
                      whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={[
                          'flex items-center justify-between rounded-2xl px-4 py-4 text-sm font-medium transition-colors duration-200',
                          active
                            ? 'bg-white/10 text-white'
                            : 'text-white/65 hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                      >
                        <span>{item.label}</span>
                        {active && (
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ background: 'oklch(73% 0.18 196)' }}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </m.div>
                  );
                })}
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}