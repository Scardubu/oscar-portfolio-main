'use client';
// components/NavBar.tsx
//
// Conviction-engine nav:
//   - Transparent at top  glass-full on scroll > 8px
//   - IntersectionObserver: scroll-linked active section (not click-state)
//   - Mobile hamburger: AnimatePresence slide-down, Escape/outside closes
//   - Tagline + "Open to Work" pill always visible on desktop
//   - WCAG AA: aria-expanded, aria-controls, aria-current, aria-label
//

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SystemStatus } from '@/components/SystemStatus';
import { cn } from '@/lib/utils';
import { mobileMenu, mobileMenuItems, mobileMenuItem, springs } from '@/lib/motion';

const SECTION_LINKS = ['projects', 'writing', 'skills', 'about', 'contact'] as const;
const MOBILE_NAV_ID = 'mobile-navigation';

function openCommandPalette() {
  globalThis.dispatchEvent(new Event('command-palette:open'));
}

const NAV_LINKS = [
  { label: 'Projects', href: 'projects' },
  { label: 'Writing', href: 'writing' },
  { label: 'Skills', href: 'skills' },
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
] as const;

function resolveSectionHref(pathname: string, section: string) {
  if (pathname === '/') {
    return `#${section}`;
  }

  return `/#${section}`;
}

function getHamburgerBarAnimations(open: boolean, prefersReduced: boolean) {
  if (prefersReduced) {
    return {
      top: {},
      middle: {},
      bottom: {},
    };
  }

  if (open) {
    return {
      top: { rotate: 45, y: 6.5 },
      middle: { opacity: 0, scaleX: 0 },
      bottom: { rotate: -45, y: -6.5 },
    };
  }

  return {
    top: { rotate: 0, y: 0 },
    middle: { opacity: 1, scaleX: 1 },
    bottom: { rotate: 0, y: 0 },
  };
}

function getAriaCurrent(isCurrent: boolean) {
  if (isCurrent) {
    return 'page' as const;
  }

  return undefined;
}

function getDesktopLinkClass(isCurrent: boolean) {
  if (isCurrent) {
    return 'text-white border-b border-(--color-accent)';
  }

  return 'text-white/55 border-b border-transparent hover:text-white';
}

function getMobileLinkClass(isCurrent: boolean) {
  if (isCurrent) {
    return 'bg-white/[0.06] text-white';
  }

  return 'text-white/60 hover:bg-white/[0.04] hover:text-white';
}

//  Hamburger icon

function HamburgerIcon({
  open,
  onClick,
  buttonRef,
}: Readonly<{
  open: boolean;
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}>) {
  const prefersReduced = useReducedMotion();
  const barAnimations = getHamburgerBarAnimations(open, Boolean(prefersReduced));

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Toggle navigation"
      data-state={open ? 'open' : 'closed'}
      onClick={onClick}
      className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg"
    >
      <m.span
        className="block h-[1.5px] w-5 origin-center rounded-full bg-white/70"
        animate={barAnimations.top}
        transition={springs.snappy}
      />
      <m.span
        className="block h-[1.5px] w-5 origin-center rounded-full bg-white/70"
        animate={barAnimations.middle}
        transition={springs.snappy}
      />
      <m.span
        className="block h-[1.5px] w-5 origin-center rounded-full bg-white/70"
        animate={barAnimations.bottom}
        transition={springs.snappy}
      />
    </button>
  );
}

//  Main NavBar

export function NavBar() {
  const prefersReduced = useReducedMotion();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteShortcut, setPaletteShortcut] = useState('Ctrl K');
  const [activeSection, setActiveSection] = useState<string>('');
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => {
      document.documentElement.toggleAttribute('data-scrolled', globalThis.scrollY > 8);
    };

    globalThis.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => globalThis.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const ids = [...SECTION_LINKS];
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuTriggerRef.current?.focus();
        return;
      }

      if (e.key !== 'Tab' || !menuRef.current) {
        return;
      }

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (target && navRef.current && !navRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [menuOpen]);

  // Body scroll lock while menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      firstMobileLinkRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    const isApplePlatform = /Mac|iPhone|iPad|iPod/i.test(globalThis.navigator.userAgent);

    if (isApplePlatform) {
      setPaletteShortcut('⌘K');
      return;
    }

    setPaletteShortcut('Ctrl K');
  }, []);

  const links = useMemo(
    () =>
      NAV_LINKS.map((link) => ({
        ...link,
        href: link.href.startsWith('/') ? link.href : resolveSectionHref(pathname, link.href),
      })),
    [pathname]
  );

  const mobileMenuVariants = prefersReduced ? undefined : mobileMenu;
  const mobileMenuItemsVariants = prefersReduced ? undefined : mobileMenuItems;
  const mobileMenuItemVariants = prefersReduced ? undefined : mobileMenuItem;

  const isActive = useCallback(
    (href: string) => {
      const sectionId = href.split('#')[1];

      if (!sectionId) {
        return false;
      }

      if (pathname !== '/') {
        return false;
      }

      return activeSection === sectionId;
    },
    [activeSection, pathname]
  );

  return (
    <header
      ref={navRef}
      className="glass-nav fixed inset-x-0 top-0 z-50 border-b border-white/[0.08]"
      role="banner"
    >
      <nav
        className="container grid h-[var(--nav-height)] grid-cols-[auto_1fr_auto] items-center gap-5"
        aria-label="Primary"
      >
        <m.div
          whileHover={
            prefersReduced
              ? undefined
              : { scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 30 } }
          }
        >
          <Link
            href={resolveSectionHref(pathname, 'hero')}
            className="flex items-center gap-3.5"
            aria-label="Oscar Ndugbu home"
          >
            <span className="text-[1.05rem] font-[var(--font-display)] font-bold tracking-[-0.03em] text-white">
              Oscar<span className="text-(--color-accent)">.</span>
            </span>
            <span
              className="hidden text-xs tracking-[0.08em] text-(--color-text-muted) xl:block"
              aria-hidden="true"
            >
              Fullstack engineering · AI infrastructure at scale
            </span>
          </Link>
        </m.div>

        <ul className="hidden items-center justify-center gap-1.5 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'relative block rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                  getDesktopLinkClass(isActive(link.href))
                )}
                aria-current={getAriaCurrent(isActive(link.href))}
              >
                {link.label}
                {isActive(link.href) && !prefersReduced && (
                  <m.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-px block h-[1.5px] rounded-full bg-(--color-accent)"
                    transition={springs.layout}
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-3.5">
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Open command palette"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-(--color-text-muted) transition hover:text-(--color-text-primary)"
            >
              {paletteShortcut}
            </button>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <SystemStatus />
            <div className="pill pill-cyan inline-flex items-center gap-2">
              <span className="live-dot h-[6px] w-[6px]" aria-hidden="true" />
              <span>Open to Work</span>
            </div>
          </div>

          <div className="md:hidden">
            <HamburgerIcon
              open={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              buttonRef={menuTriggerRef}
            />
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <m.button
              type="button"
              aria-label="Close navigation overlay"
              className="fixed inset-0 top-[var(--nav-height)] z-[-1] bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setMenuOpen(false);
                menuTriggerRef.current?.focus();
              }}
            />

            <m.div
              id={MOBILE_NAV_ID}
              ref={menuRef}
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="glass-no-hover border-t border-white/[0.08] md:hidden"
            >
              <m.ul
                variants={mobileMenuItemsVariants}
                initial="hidden"
                animate="visible"
                className="container flex flex-col gap-1 py-4"
              >
                {links.map((link, index) => (
                  <m.li key={link.href} variants={mobileMenuItemVariants}>
                    <Link
                      ref={index === 0 ? firstMobileLinkRef : undefined}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'flex items-center rounded-xl px-4 py-3.5 text-base font-medium transition-colors duration-200',
                        getMobileLinkClass(isActive(link.href))
                      )}
                      aria-current={getAriaCurrent(isActive(link.href))}
                    >
                      {link.label}
                    </Link>
                  </m.li>
                ))}

                <m.li variants={mobileMenuItemVariants} className="pt-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-3">
                    <span className="text-sm text-white/70">Theme</span>
                    <ThemeToggle />
                  </div>
                </m.li>

                <m.li variants={mobileMenuItemVariants}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openCommandPalette();
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-white/60 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    <span>Command palette</span>
                    <span className="text-xs text-white/40">{paletteShortcut}</span>
                  </button>
                </m.li>

                <m.li variants={mobileMenuItemVariants} className="pt-2">
                  <span className="pill pill-cyan justify-center">Open to Work</span>
                </m.li>
              </m.ul>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
