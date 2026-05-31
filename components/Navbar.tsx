'use client';

// CONVICTION ENGINE — Navbar v2.0
//
// CHANGES from v1.0:
//   - Active nav item now renders a chapter-accent underline via CSS variable.
//     Because --chapter-accent is a registered @property with a 0.65s transition,
//     the underline colour cross-fades automatically as chapters change — zero JS.
//   - Active pill background uses color-mix(in oklch, --chapter-accent) for a
//     subtle tinted glass instead of the flat bg-white/10.
//   - Mobile menu active item similarly uses chapter-accent border tint.
//   - Focus ring uses var(--chapter-accent) directly — consistent with the global
//     :focus-visible upgrade in globals.css.
//   - No new framer-motion scroll hooks. No Lenis competition.
//   - All animation logic preserved. Menu close on resize/escape preserved.

import { AnimatePresence, m, useAnimationFrame, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import { anchorUrl } from '@/lib/config';

type NavItem = {
  label: string;
  href: string;
  id: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', href: anchorUrl('section-projects'), id: 'section-projects' },
  { label: 'Record', href: anchorUrl('section-testimonials'), id: 'section-testimonials' },
  { label: 'Open Source', href: anchorUrl('open-source'), id: 'open-source' },
  { label: 'Skills', href: anchorUrl('skills'), id: 'skills' },
  { label: 'About', href: anchorUrl('section-about'), id: 'section-about' },
  { label: 'Writing', href: anchorUrl('section-writing'), id: 'section-writing' },
  { label: 'Contact', href: anchorUrl('section-contact'), id: 'section-contact' },
];

const navbarVariants = {
  hidden: { y: -20, opacity: 1 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.16,
      ease: [0.16, 1, 0.3, 1],
      // Children exit in reverse order, finishing before the panel fades
      staggerChildren: 0.03,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
      delayChildren: 0.04,
      when: 'beforeChildren',
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -10, transition: { duration: 0.1 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
};

function getActiveIdFromChapter(activeChapter: string) {
  const map: Record<string, string> = {
    prologue: 'hero',
    proof: 'section-projects',
    credibility: 'section-testimonials',
    craft: 'open-source',
    range: 'skills',
    human: 'section-about',
    judgment: 'section-writing',
    epilogue: 'section-contact',
  };
  return map[activeChapter] ?? 'hero';
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const { activeChapter, scrollToSection, scrollYRef, lenisRef } = useScrollCinema();
  const pathname = usePathname();

  // SAFETY: close mobile menu and release body lock on route change.
  // Without this, an unmount mid-animation could leak `body { overflow: hidden }`,
  // causing the page to render with content invisible below viewport on return.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // SAFETY: defensive cleanup — ensure scroll lock is fully released on unmount,
  // covering edge cases where the cleanup in the lock effect didn't fire
  // (e.g. React 19 concurrent unmount during animation).
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('nav-open');
        document.body.style.top = '';
        document.documentElement.removeAttribute('data-nav-open');
      }
    };
  }, []);

  const activeSectionId = getActiveIdFromChapter(activeChapter);

  useAnimationFrame(() => {
    const nextScrolled = scrollYRef.current > 20;
    if (nextScrolled === scrolledRef.current) return;

    scrolledRef.current = nextScrolled;
    setScrolled(nextScrolled);
  });

  // Lock body scroll and pause Lenis when mobile menu is open.
  // Uses position:fixed + scroll save/restore to prevent iOS jump and avoid
  // the BFC conflict that overflow:hidden causes with overflow-x:clip on html.
  useEffect(() => {
    if (!mobileOpen) {
      document.documentElement.removeAttribute('data-nav-open');
      return;
    }
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('nav-open');
    document.documentElement.setAttribute('data-nav-open', 'true');
    // Capture the Lenis instance at the time the menu opens — the ref may
    // point to a different (or null) instance by the time cleanup runs.
    const lenis = lenisRef.current;
    lenis?.stop();
    return () => {
      document.body.classList.remove('nav-open');
      document.body.style.top = '';
      document.documentElement.removeAttribute('data-nav-open');
      window.scrollTo(0, scrollY);
      lenis?.start();
    };
  }, [mobileOpen, lenisRef]);

  // Close mobile menu on desktop breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  // Navigate via Lenis when clicking a nav link (suppresses default jump)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const nextHash = `#${id}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
    scrollToSection(id);
    closeMenu();
  };

  return (
    <>
      <m.header
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className="glass-nav hero-nav-shell [transform:translateZ(0)]"
        data-scrolled={scrolled ? 'true' : 'false'}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Wordmark ───────────────────────────────────────────────── */}
          <Link
            href="/"
            className="group relative flex items-center gap-3 rounded-[13px] focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            aria-label="Oscar Ndugbu — Homepage"
          >
            <div className="flex flex-col gap-0.5">
              <m.span
                className="nav-wordmark-luminary"
                whileHover={reducedMotion ? undefined : { y: -1 }}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                Oscar Ndugbu
              </m.span>
              <span className="text-[10px] tracking-[0.24em] text-white/55 uppercase sm:text-white/45">
                Principal Full-Stack Engineer
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ────────────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const active = activeSectionId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'hero-nav-item group relative rounded-full px-3 py-2 text-sm transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                    'focus-visible:ring-[color:var(--chapter-accent)]',
                    active ? 'text-white' : 'text-white/60 hover:text-white/90',
                  ].join(' ')}
                >
                  {/* Tinted glass background — chapter-accent tinted on active */}
                  <span
                    aria-hidden="true"
                    className={[
                      'hero-nav-item-bg absolute inset-0 rounded-full transition-opacity duration-300',
                      active
                        ? 'hero-nav-item-bg-active opacity-100'
                        : 'hero-nav-item-bg-idle opacity-0 group-hover:opacity-60',
                    ].join(' ')}
                  />

                  <span className="relative">{item.label}</span>

                  {/* Chapter-accent underline — always rendered, opacity-toggled */}
                  <span
                    aria-hidden="true"
                    className={[
                      'nav-item-active-indicator absolute inset-x-3 bottom-1 h-px rounded-full',
                      'origin-center transition-[opacity,transform] duration-300',
                      active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0',
                    ].join(' ')}
                  />
                </a>
              );
            })}
          </nav>

          {/* ── Desktop availability CTA pill — PATCH v2026.18 [nav-cta] ─────
              Persistent conversion affordance at lg+ only (hidden on mobile via `hidden lg:inline-flex`).
              Once the user scrolls past the hero availability badge, this pill keeps the
              availability signal alive throughout the scroll journey — mirroring the green dot
              + monospace pill visual language established in the hero section.
              Uses the same handleNavClick + scrollToSection path as all other nav items —
              cinematic Lenis glide to #section-contact, no page jump.
              No new imports needed: anchorUrl is already imported at line 24. */}
          <a
            href={anchorUrl('section-contact')}
            onClick={(e) => handleNavClick(e, 'section-contact')}
            className="nav-availability-cta hidden lg:inline-flex"
            aria-label="Contact Oscar — available for Staff+ roles and consulting"
          >
            <span className="nav-availability-dot" aria-hidden="true" />
            Available
          </a>

          {/* ── Mobile menu button ─────────────────────────────────────── */}
          <button
            type="button"
            className="hero-nav-menu-button inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {/*
              FLICKER FIX v2026.21:
              Replaced `AnimatePresence mode="wait"` (sequential exit → enter) with a
              dual-overlay pattern. Both icons live in the DOM simultaneously — their
              opacity and rotation animate in PARALLEL so there is never a frame where
              neither icon is visible. Eliminates the ~140ms empty-button flash that
              appeared on iOS when tapping the hamburger, and makes the interaction
              immune to parent re-renders triggered by useScrollCinema / useAnimationFrame.
            */}
            <span className="relative flex h-5 w-5 items-center justify-center">
              {/* Hamburger — fades + rotates out when menu opens */}
              <m.span
                className="absolute flex items-center justify-center"
                initial={false}
                animate={{
                  opacity: mobileOpen ? 0 : 1,
                  rotate: mobileOpen ? -90 : 0,
                  scale: mobileOpen ? 0.5 : 1,
                }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              >
                <Menu className="h-5 w-5" />
              </m.span>
              {/* Close — fades + rotates in when menu opens */}
              <m.span
                className="absolute flex items-center justify-center"
                initial={false}
                animate={{
                  opacity: mobileOpen ? 1 : 0,
                  rotate: mobileOpen ? 0 : 90,
                  scale: mobileOpen ? 1 : 0.5,
                }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              >
                <X className="h-5 w-5" />
              </m.span>
            </span>
          </button>
        </div>
      </m.header>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <m.div
            id="mobile-navigation"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="hero-mobile-nav-panel fixed inset-x-0 top-16 z-50 px-4 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const active = activeSectionId === item.id;
                return (
                  <m.div key={item.id} variants={mobileItemVariants}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id)}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'hero-mobile-nav-item flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors duration-200',
                        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                        'focus-visible:ring-[color:var(--chapter-accent)]',
                        active ? 'text-white' : 'text-white/75',
                        active ? 'hero-mobile-nav-item--active' : 'hero-mobile-nav-item--idle',
                      ].join(' ')}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <span
                          aria-hidden="true"
                          className="hero-mobile-nav-item-dot h-1.5 w-1.5 rounded-full"
                        />
                      )}
                    </a>
                  </m.div>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
