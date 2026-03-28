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

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { mobileMenu, mobileMenuItems, mobileMenuItem, springs } from '@/lib/motion';

const NAV_LINKS = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
] as const;

//  Hamburger icon

function HamburgerIcon({ open, onClick }: { open: boolean; onClick: () => void }) {
  const prefersReduced = useReducedMotion();

  return (
    <button
      type="button"
      aria-label="Toggle navigation"
      aria-expanded={open}
      aria-controls="mobile-nav"
      onClick={onClick}
      className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg"
    >
      <motion.span
        className="block h-[1.5px] w-5 origin-center rounded-full bg-white/70"
        animate={prefersReduced ? {} : open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
        transition={springs.snappy}
      />
      <motion.span
        className="block h-[1.5px] w-5 origin-center rounded-full bg-white/70"
        animate={prefersReduced ? {} : open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={springs.snappy}
      />
      <motion.span
        className="block h-[1.5px] w-5 origin-center rounded-full bg-white/70"
        animate={prefersReduced ? {} : open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
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
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Glass activates after scrollY > 8
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section tracking  scroll-linked, not click-driven
  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const ids = ['hero', 'projects', 'about', 'contact'];
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [pathname]);

  // Escape key closes menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Body scroll lock while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => {
      if (href === '/writing') {
        return pathname.startsWith('/writing');
      }

      const sectionId = href.split('#')[1];
      return pathname === '/' && sectionId ? activeSection === sectionId : false;
    },
    [activeSection, pathname]
  );

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-[250ms]',
        scrolled ? 'glass-no-hover glass-full border-b border-white/[0.08]' : 'bg-transparent'
      )}
      style={{ height: 'var(--nav-height)' }}
      role="banner"
    >
      <nav
        className="container flex h-full items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo + tagline */}
        <Link href="/" className="flex items-center gap-3" aria-label="Oscar Scardubu home">
          <span
            className="text-base font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Oscar<span style={{ color: 'var(--color-accent)' }}>.</span>
          </span>
          <span
            className="hidden text-xs sm:block"
            style={{ color: 'var(--color-text-muted)' }}
            aria-hidden="true"
          >
            Production AI systems · Full-stack execution
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex" role="list" aria-label="Site sections">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'relative block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                  isActive(link.href) ? 'text-white' : 'text-white/55 hover:text-white'
                )}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
                {isActive(link.href) && !prefersReduced && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-px block h-[1.5px] rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    transition={springs.layout}
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Open to Work pill + hamburger */}
        <div className="flex items-center gap-3">
          <span
            className="hidden items-center gap-2 rounded-full border px-3 py-1 text-xs sm:inline-flex"
            style={{
              borderColor: 'rgba(34,197,94,0.25)',
              color: '#86efac',
            }}
            role="status"
            aria-label="Availability: open to work"
          >
            <span className="live-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />
            Open to Work
          </span>

          <div className="md:hidden">
            <HamburgerIcon open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-menu"
            variants={prefersReduced ? undefined : mobileMenu}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="glass-no-hover border-t border-white/[0.08] md:hidden"
          >
            <motion.ul
              variants={prefersReduced ? undefined : mobileMenuItems}
              initial="hidden"
              animate="visible"
              className="container flex flex-col gap-1 py-4"
              role="list"
            >
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={prefersReduced ? undefined : mobileMenuItem}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center rounded-xl px-3 py-3 text-base font-medium transition-colors duration-150',
                      isActive(link.href)
                        ? 'bg-white/[0.06] text-white'
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                    )}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}

              <motion.li variants={prefersReduced ? undefined : mobileMenuItem} className="pt-2">
                <Link
                  href="/#contact"
                  onClick={() => setMenuOpen(false)}
                  className="glass-card flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white"
                >
                  Get in Touch
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
