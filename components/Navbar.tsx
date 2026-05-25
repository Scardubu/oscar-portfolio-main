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

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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
  hidden: { opacity: 0, y: -12, transition: { duration: 0.18 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, staggerChildren: 0.04 } },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
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
  const reducedMotion = useReducedMotion();
  const { activeChapter, scrollToSection } = useScrollCinema();

  const navItems = useMemo(() => NAV_ITEMS, []);
  const activeSectionId = getActiveIdFromChapter(activeChapter);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, [mobileOpen]);

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

  // Scroll state: darken nav background once content scrolls under it
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll(); // Initialize from current scroll position on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        className={[
          'fixed inset-x-0 top-0 z-50 transform-gpu border-b backdrop-blur-xl',
          'transition-[background-color,border-color,box-shadow] duration-200',
          scrolled
            ? 'border-white/10 bg-[oklch(7%_0.01_265/0.92)] shadow-[0_1px_0_oklch(100%_0_0/0.04),0_4px_24px_-4px_oklch(0%_0_0/0.45)]'
            : 'border-white/8 bg-black/20',
        ].join(' ')}
        // eslint-disable-next-line no-restricted-syntax
        style={{ translateZ: 0 }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Wordmark ───────────────────────────────────────────────── */}
          <Link
            href="/"
            className="group relative flex items-center gap-3 rounded-[13px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            // eslint-disable-next-line no-restricted-syntax
            style={{ '--tw-ring-color': 'var(--chapter-accent)' } as React.CSSProperties}
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
              <span className="text-[10px] tracking-[0.24em] text-white/45 uppercase">
                Principal Full-Stack Engineer
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ────────────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = activeSectionId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'group relative rounded-full px-3 py-2 text-sm transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                    active ? 'text-white' : 'text-white/60 hover:text-white/90',
                  ].join(' ')}
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ '--tw-ring-color': 'var(--chapter-accent)' } as React.CSSProperties}
                >
                  {/* Tinted glass background — chapter-accent tinted on active */}
                  <span
                    aria-hidden="true"
                    className={[
                      'absolute inset-0 rounded-full transition-opacity duration-300',
                      active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
                    ].join(' ')}
                    // eslint-disable-next-line no-restricted-syntax
                    style={{
                      background: active
                        ? 'color-mix(in oklch, var(--chapter-accent) 12%, oklch(100% 0 0 / 0.06))'
                        : 'oklch(100% 0 0 / 0.05)',
                      border: active
                        ? '1px solid color-mix(in oklch, var(--chapter-accent) 20%, oklch(100% 0 0 / 0.08))'
                        : '1px solid transparent',
                    }}
                  />

                  <span className="relative">{item.label}</span>

                  {/* Chapter-accent underline — always rendered, opacity-toggled */}
                  <span
                    aria-hidden="true"
                    className={[
                      'nav-item-active-indicator absolute inset-x-3 bottom-1 h-px rounded-full',
                      'transition-[opacity,transform] duration-300',
                      active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0',
                    ].join(' ')}
                    // eslint-disable-next-line no-restricted-syntax
                    style={{ transformOrigin: 'center' }}
                  />
                </a>
              );
            })}
          </nav>

          {/* ── Mobile menu button ─────────────────────────────────────── */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <m.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <X className="h-5 w-5" />
                </m.span>
              ) : (
                <m.span
                  key="open"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <Menu className="h-5 w-5" />
                </m.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </m.header>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            id="mobile-navigation"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="fixed inset-x-0 top-16 z-50 border-b border-white/8 bg-black/95 px-4 py-4 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = activeSectionId === item.id;
                return (
                  <m.div key={item.id} variants={mobileItemVariants}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id)}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors duration-200',
                        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                        active ? 'text-white' : 'text-white/75',
                      ].join(' ')}
                      // eslint-disable-next-line no-restricted-syntax
                      style={
                        {
                          background: active
                            ? 'color-mix(in oklch, var(--chapter-accent) 10%, oklch(100% 0 0 / 0.07))'
                            : 'oklch(100% 0 0 / 0.04)',
                          borderColor: active
                            ? 'color-mix(in oklch, var(--chapter-accent) 25%, oklch(100% 0 0 / 0.10))'
                            : 'oklch(100% 0 0 / 0.08)',

                          '--tw-ring-color': 'var(--chapter-accent)',
                        } as React.CSSProperties
                      }
                    >
                      <span>{item.label}</span>
                      {active && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full"
                          // eslint-disable-next-line no-restricted-syntax
                          style={{ background: 'var(--chapter-accent)' }}
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
