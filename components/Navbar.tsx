'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import { anchorUrl } from '@/lib/config';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';

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
  { label: 'Projects', href: '#section-projects', id: 'section-projects' },
  { label: 'Record', href: '#section-testimonials', id: 'section-testimonials' },
  { label: 'Open Source', href: '#open-source', id: 'open-source' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'About', href: '#section-about', id: 'section-about' },
  { label: 'Writing', href: '#section-writing', id: 'section-writing' },
  { label: 'Contact', href: '#section-contact', id: 'section-contact' },
];

const navbarVariants = {
  hidden: { y: -32, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
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
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

// Icon crossfade variants — 120ms is imperceptible but eliminates the hard flash
const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.08 } },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('section-projects');
  const [scrolled, setScrolled] = useState(false);

  const reducedMotion = useReducedMotion();

  // Refs used inside RAF closures — avoid stale closure reads without
  // putting these values into useEffect dependency arrays.
  const tickingRef = useRef(false);
  const visibilityRef = useRef<Map<SectionId, number>>(new Map());
  const activeSectionRef = useRef<SectionId>('section-projects');
  const scrolledRef = useRef(false);

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
    return () => {
      document.body.style.overflow = originalOverflow;
    };
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

  const navigateToSection = (sectionId: SectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

    window.history.replaceState(null, '', anchorUrl(sectionId));
    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });

    activeSectionRef.current = sectionId;
    setActiveSection(sectionId);
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: SectionId,
    onAfterNavigate?: () => void
  ) => {
    event.preventDefault();
    navigateToSection(sectionId);
    onAfterNavigate?.();
  };

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
          scrolled ? 'border-b border-white/10 bg-black/70 backdrop-blur-2xl' : 'bg-transparent',
        ].join(' ')}
        // eslint-disable-next-line no-restricted-syntax
        style={{ translateZ: 0 }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Wordmark */}
          <Link
            href="/"
            className="group relative flex items-center gap-3 rounded-[13px] focus-visible:ring-2 focus-visible:ring-[oklch(70%_0.21_188)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
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
              <span className="nav-tagline text-white/50">Staff+ Engineer · Lagos → Global</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.id)}
                  className="relative"
                >
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
            className="hidden min-h-[44px] items-center gap-2 rounded-xl border border-[oklch(73%_0.18_196_/_0.55)] px-4 text-sm font-medium text-[oklch(73%_0.18_196)] transition-colors duration-200 hover:bg-[oklch(73%_0.18_196_/_0.08)] focus-visible:ring-2 focus-visible:ring-[oklch(73%_0.18_196)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none lg:inline-flex"
          >
            Hire Oscar
          </Link>

          {/* Hamburger — FIX v23.1:
              transform-gpu added to the button itself. The header, backdrop, and panel
              are all pre-promoted; the button was the only element in the chain without
              its own compositor layer. When backdrop/panel mount (new stacking contexts),
              the browser repaints the header and its non-promoted children — this button
              was in that group. Permanent promotion eliminates the on-demand cost at
              click time and matches the layer strategy of every other animated element. */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative flex h-11 w-11 transform-gpu items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors duration-200 hover:border-white/20 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[oklch(73%_0.18_196)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none lg:hidden"
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
            {/* Backdrop — FIX v23: backdrop-blur-md removed (on-demand compositor
                layer creation was the flash). transform-gpu pre-promotes the element.
                bg-black/80 replaces bg-black/70 backdrop-blur-md — reads the same. */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 transform-gpu bg-black/80 lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Panel — FIX v23: transform-gpu pre-promotes compositor layer so
                backdrop-blur-2xl activates on an existing layer, not a new one.
                bg-[#0d0d0d]/97 replaces bg-black/90 for better depth without blur flash. */}
            <m.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="fixed inset-x-4 top-20 z-50 transform-gpu overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d]/97 shadow-2xl backdrop-blur-2xl lg:hidden"
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
                        onClick={(event) => handleNavClick(event, item.id, closeMenu)}
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
                            className="h-2 w-2 rounded-full bg-[oklch(73%_0.18_196)]"
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
