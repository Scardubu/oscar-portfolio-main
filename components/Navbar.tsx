// CONVICTION ENGINE v15.0 — Navbar
//
// v15.0 MOBILE-NATIVE REBUILD:
//
//   ARCH: Dual-plane navigation system.
//     Mobile (≤768px): Minimal top identity bar (logo + emergency CTA) +
//       fixed bottom navigation in thumb comfort zone.
//     Desktop (>768px): Full original top nav (unchanged hierarchy).
//
//   ADD:  BottomNav component — thumb ergonomic, 48×48px targets.
//         5 items: Work · Writing · Skills · About · Contact
//         Active section tracking via IntersectionObserver (shared state).
//
//   ADD:  Mobile top bar condensed to 52px height — reclaims vertical px.
//         Shows only: Logo wordmark + Book a Call CTA.
//         No hamburger menu — bottom nav replaces it entirely.
//
//   REF:  AnimatePresence mobile dropdown removed — replaced by bottom nav.
//
//   KEEP: IntersectionObserver active section tracking — shared between top + bottom.
//   KEEP: Spring physics on desktop nav indicator (layoutId).
//   KEEP: Scroll-activated glass: 0px → blur(20px) at 8px scroll.
//   KEEP: SystemStatus, ThemeToggle, ⌘K on desktop.
//   KEEP: All WCAG 2.2 compliance — focus rings, Escape handling, aria-current.
//
'use client';

import { SystemStatus } from '@/components/SystemStatus';
import { ThemeToggle } from '@/components/ThemeToggle';
import { springs } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { m, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// ── Section IDs — shared between top and bottom nav ──────────────────────────
const SECTION_IDS = [
  'section-projects',
  'open-source',
  'skills',
  'section-about',
  'section-writing',
  'section-contact',
] as const;

// ── Desktop nav links (unchanged from v14) ────────────────────────────────────
const NAV_LINKS = [
  { label: 'Projects',  href: 'section-projects' },
  { label: 'Writing',   href: 'section-writing' },
  { label: 'Skills',    href: 'skills' },
  { label: 'About',     href: 'section-about' },
  { label: 'Contact',   href: 'section-contact' },
] as const;

// ── Bottom nav items — 5 thumb-reachable destinations ────────────────────────
// Ordered by conversion priority: Work first (proof), Contact last (CTA).
const BOTTOM_NAV_ITEMS = [
  {
    label: 'Work',
    href: 'section-projects',
    sectionId: 'section-projects',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    label: 'Writing',
    href: 'section-writing',
    sectionId: 'section-writing',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
      </svg>
    ),
  },
  {
    label: 'Skills',
    href: 'skills',
    sectionId: 'skills',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
  },
  {
    label: 'About',
    href: 'section-about',
    sectionId: 'section-about',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Contact',
    href: 'section-contact',
    sectionId: 'section-contact',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
] as const;

function openCommandPalette() {
  globalThis.dispatchEvent(new Event('command-palette:open'));
}

function resolveSectionHref(pathname: string, section: string) {
  return pathname === '/' ? `#${section}` : `/#${section}`;
}

// ── Bottom Navigation — mobile thumb ergonomics ───────────────────────────────
function BottomNav({
  activeSection,
  pathname,
}: {
  activeSection: string;
  pathname: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <nav
      className="bottom-nav"
      aria-label="Primary navigation"
      role="navigation"
    >
      {BOTTOM_NAV_ITEMS.map(({ label, href, sectionId, icon }) => {
        const isActive = activeSection === sectionId;
        const resolvedHref = resolveSectionHref(pathname, href);

        return (
          <a
            key={href}
            href={resolvedHref}
            className={cn('bottom-nav-item', isActive && 'active')}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
          >
            <m.div
              className="bottom-nav-item-icon"
              animate={
                reducedMotion
                  ? {}
                  : {
                      scale: isActive ? 1.12 : 1,
                      y: isActive ? -1 : 0,
                    }
              }
              transition={springs.snappy}
            >
              {icon(isActive)}
            </m.div>
            <span className="bottom-nav-item-label">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}

// ── Main NavBar ───────────────────────────────────────────────────────────────
export function NavBar() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // ── Scroll: glass activation at 8px ─────────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── IntersectionObserver: active section tracking ────────────────────────
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

  return (
    <>
      {/* ── Top header ─────────────────────────────────────────────────────── */}
      <header>
        {/* Skip nav — WCAG 2.2 §2.4.1 */}
        <a href="#main-content" className="skip-nav">
          Skip to content
        </a>

        <nav
          className="glass-nav"
          data-scrolled={scrolled ? 'true' : 'false'}
          aria-label="Site navigation"
        >
          <div className="container flex h-full items-center justify-between">
            {/* ── Logo / wordmark ─────────────────────────────────────── */}
            <Link href="/" className="flex flex-col leading-none group" aria-label="Oscar Ndugbu — home">
              <span
                className="font-display text-sm font-extrabold tracking-tight"
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

            {/* ── Desktop nav links ─────────────────────────────────── */}
            {/* Hidden on mobile via CSS — bottom nav handles mobile wayfinding */}
            <div className="desktop-nav-links nav-links hidden items-center gap-1 md:flex" role="list">
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
                      isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
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

            {/* ── Desktop: availability + controls ─────────────────── */}
            <div className="desktop-nav-controls hidden items-center gap-3 md:flex">
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
                style={{ minHeight: '36px', padding: '0.375rem 1.125rem', fontSize: '0.8125rem', width: 'auto' }}
              >
                Book a Call
              </a>
            </div>

            {/* ── Mobile: emergency CTA only — bottom nav handles navigation ─ */}
            {/* Placed in top-right as secondary reinforcement, not primary action */}
            <a
              href="mailto:scardubu@gmail.com"
              className="flex md:hidden items-center justify-center rounded-md px-3 py-2 text-xs font-semibold text-white/80 border border-white/12 bg-white/5 transition hover:bg-white/10"
              style={{ minHeight: '36px', minWidth: '44px' }}
              aria-label="Email Oscar"
            >
              Hire me
            </a>
          </div>
        </nav>
      </header>

      {/* ── Bottom navigation — mobile thumb-comfort zone ─────────────────── */}
      <BottomNav activeSection={activeSection} pathname={pathname} />
    </>
  );
}