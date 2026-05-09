// CONVICTION ENGINE v11.0 — Navbar
//
// Design principles:
//   • Linear 2026 Liquid Glass: transparent at top, glass-blur on scroll
//     JS adds data-scrolled="true" at 8px — CSS handles the transition.
//   • Spring physics: hamburger bars use spring rotation, not tween.
//   • WCAG 2.2+ §2.4.11: all interactive targets ≥24×24px CSS.
//   • Mobile: AnimatePresence slide-down, Escape/outside-click closes.
//   • Tagline always visible desktop; "Open to work" pill on scroll=0.
//   • IntersectionObserver links active section (not click-state).
//
'use client';

import { SystemStatus } from '@/components/SystemStatus';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  mobileMenu,
  mobileMenuItem,
  mobileMenuItems,
  springs,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const SECTION_IDS = [
  'section-projects',
  'open-source',
  'skills',
  'section-about',
  'section-writing',
  'section-contact',
] as const;

const NAV_LINKS = [
  { label: 'Projects',  href: 'section-projects' },
  { label: 'Writing',   href: 'section-writing' },
  { label: 'Skills',    href: 'skills' },
  { label: 'About',     href: 'section-about' },
  { label: 'Contact',   href: 'section-contact' },
] as const;

const MOBILE_NAV_ID = 'mobile-navigation';

function openCommandPalette() {
  globalThis.dispatchEvent(new Event('command-palette:open'));
}

function resolveSectionHref(pathname: string, section: string) {
  return pathname === '/' ? `#${section}` : `/#${section}`;
}

function getHamburgerAnimation(open: boolean, reduced: boolean) {
  if (reduced) return { top: {}, mid: {}, btm: {} };
  if (open) {
    return {
      top: { rotate: 45, y: 7 },
      mid: { opacity: 0, scaleX: 0 },
      btm: { rotate: -45, y: -7 },
    };
  }
  return {
    top: { rotate: 0, y: 0 },
    mid: { opacity: 1, scaleX: 1 },
    btm: { rotate: 0, y: 0 },
  };
}

export function NavBar() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const mobileRef = useRef<HTMLDivElement>(null);

  // ── Scroll: glass activation at 8px ───────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── IntersectionObserver: active section tracking ─────────────────────
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Keyboard: Escape closes mobile menu ───────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  // ── Outside click closes mobile menu ──────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mobileOpen && mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  // ── Lock body scroll when mobile open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const ham = getHamburgerAnimation(mobileOpen, reducedMotion ?? false);

  const menuItems = mobileMenuItems(0.055);

  return (
    <header ref={mobileRef}>
      {/* ── Skip nav: WCAG 2.2 §2.4.1 ─────────────────────────────── */}
      <a href="#main-content" className="skip-nav">
        Skip to content
      </a>

      <nav
        className="glass-nav"
        data-scrolled={scrolled ? 'true' : 'false'}
        aria-label="Primary navigation"
      >
        <div className="container flex h-full items-center justify-between">
          {/* ── Logo / wordmark ──────────────────────────────────────── */}
          <Link href="/" className="flex flex-col leading-none group" aria-label="Oscar Ndugbu — home">
            <span
              className="font-display text-sm font-bold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Oscar Ndugbu
            </span>
            <span
              className="font-mono text-[9px] tracking-[0.12em] uppercase transition-colors duration-150 group-hover:text-white/60"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Backend · Infra · ML
            </span>
          </Link>

          {/* ── Desktop nav links ────────────────────────────────────── */}
          <div className="nav-links hidden items-center gap-1 md:flex" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === href;
              return (
                <a
                  key={href}
                  href={resolveSectionHref(pathname, href)}
                  role="listitem"
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/80'
                  )}
                  style={{ minHeight: '36px', display: 'inline-flex', alignItems: 'center' }}
                >
                  {isActive && (
                    <m.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-md"
                      style={{ background: 'oklch(100% 0 0 / 0.06)' }}
                      transition={springs.layout}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </a>
              );
            })}
          </div>

          {/* ── Desktop: availability + controls ────────────────────── */}
          <div className="hidden items-center gap-3 md:flex">
            <SystemStatus />
            <ThemeToggle />
            <button
              type="button"
              onClick={openCommandPalette}
              className="glass-light rounded-md px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase text-white/45 transition hover:text-white/70"
              aria-label="Open command palette (⌘K)"
              style={{ minHeight: '32px' }}
            >
              ⌘K
            </button>
            <a
              href="mailto:scardubu@gmail.com"
              className="cta-primary"
              style={{ minHeight: '36px', padding: '0.375rem 1.125rem', fontSize: '0.8125rem' }}
            >
              Book a Call
            </a>
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────────── */}
          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-md md:hidden"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_NAV_ID}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {/* Spring-animated hamburger bars */}
            {(['top', 'mid', 'btm'] as const).map((key) => (
              <m.span
                key={key}
                className="block h-[1.5px] w-5 rounded-full"
                style={{ background: 'var(--color-text-secondary)', transformOrigin: 'center' }}
                animate={ham[key]}
                transition={springs.snappy}
              />
            ))}
          </button>
        </div>

        {/* ── Mobile dropdown ───────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <m.div
              id={MOBILE_NAV_ID}
              variants={reducedMotion ? undefined : mobileMenu}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute left-0 right-0 top-[var(--nav-height)]"
              style={{
                background: 'oklch(10% 0.009 264 / 0.97)',
                backdropFilter: 'blur(24px)',
                borderBottom: '1px solid var(--glass-border)',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <m.ul
                variants={reducedMotion ? undefined : menuItems}
                initial="hidden"
                animate="visible"
                className="container flex flex-col py-6 gap-1"
                role="list"
              >
                {NAV_LINKS.map(({ label, href }) => (
                  <m.li key={href} variants={reducedMotion ? undefined : mobileMenuItem} role="listitem">
                    <a
                      href={resolveSectionHref(pathname, href)}
                      className="flex min-h-11 items-center text-base font-medium text-white/70 transition-colors hover:text-white"
                      onClick={() => setMobileOpen(false)}
                      aria-current={activeSection === href ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  </m.li>
                ))}

                <m.li variants={reducedMotion ? undefined : mobileMenuItem} className="pt-4 border-t"
                  style={{ borderColor: 'var(--glass-border)' }}>
                  <a
                    href="mailto:scardubu@gmail.com"
                    className="cta-primary w-full justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Book a Call
                  </a>
                </m.li>
              </m.ul>
            </m.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
