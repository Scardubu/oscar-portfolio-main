// CONVICTION ENGINE v19.5 — Navbar
//
// Unified & Polished Version
// Best of v18 + v19 + v20 + targeted improvements:
//
// • Ratio-based active section detection (smoothest UX)
// • Correct reading-order navigation
// • Added support for section-testimonials
// • Stronger, high-conviction CTA ("Tell me your constraints")
// • Robust anchorUrl usage + pathname handling
// • Excellent accessibility & reduced motion support
// • Clean, compact, thumb-friendly bottom nav

'use client';

import { m, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SystemStatus } from '@/components/SystemStatus';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CONTACT_EMAIL, anchorUrl } from '@/lib/config';
import { springs } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

const SECTION_IDS = [
  'section-projects',
  'section-testimonials',
  'open-source',
  'skills',
  'section-about',
  'section-writing',
  'section-contact',
] as const;

const NAV_LINKS = [
  { label: 'Projects', href: 'section-projects' },
  { label: 'Testimonials', href: 'section-testimonials' },
  { label: 'Open Source', href: 'open-source' },
  { label: 'Skills', href: 'skills' },
  { label: 'About', href: 'section-about' },
  { label: 'Writing', href: 'section-writing' },
  { label: 'Contact', href: 'section-contact' },
] as const;

const BOTTOM_NAV_ITEMS = [
  {
    label: 'Projects',
    href: 'section-projects',
    sectionId: 'section-projects',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    label: 'Testimonials',
    href: 'section-testimonials',
    sectionId: 'section-testimonials',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
        <path d="M8 8h8M8 12h5" />
      </svg>
    ),
  },
  {
    label: 'Skills',
    href: 'skills',
    sectionId: 'skills',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
  },
  {
    label: 'Writing',
    href: 'section-writing',
    sectionId: 'section-writing',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    href: 'section-contact',
    sectionId: 'section-contact',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
] as const;

function openCommandPalette() {
  globalThis.dispatchEvent(new Event('command-palette:open'));
}

function resolveSectionHref(pathname: string, section: string) {
  return pathname === '/' ? `#${section}` : anchorUrl(section);
}

function BottomNav({
  activeSection,
  pathname,
}: {
  activeSection: string;
  pathname: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {BOTTOM_NAV_ITEMS.map(({ label, href, sectionId, icon }) => {
        const isActive = activeSection === sectionId;
        const resolvedHref = resolveSectionHref(pathname, href);

        return (
          <a
            key={href}
            href={resolvedHref}
            className={cn('bottom-nav-item', isActive && 'active')}
            aria-current={isActive ? 'location' : undefined}
            aria-label={`Jump to ${label} section`}
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

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const visibilityRef = useRef<Map<string, number>>(new Map());

  const updateActiveSection = useCallback(() => {
    let nextActive = '';
    let bestRatio = 0;

    SECTION_IDS.forEach((id) => {
      const ratio = visibilityRef.current.get(id) ?? 0;
      if (ratio > bestRatio || (ratio === bestRatio && ratio > 0)) {
        bestRatio = ratio;
        nextActive = id;
      }
    });

    if (!nextActive) {
      // Fallback: choose the section closest to the top of the viewport
      // so the nav never feels "stuck" between intersections.
      let closestId = SECTION_IDS[0];
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

    setActiveSection(nextActive);
  }, []);

  // Scroll detection for glass effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Active section detection using intersection ratios
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    visibilityRef.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityRef.current.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        });

        updateActiveSection();
      },
      {
        rootMargin: '-14% 0px -58% 0px',
        threshold: [0.15, 0.25, 0.4, 0.55, 0.7, 0.85],
      }
    );

    els.forEach((el) => observer.observe(el));

    // Seed the active section immediately so the nav reads correctly on load.
    updateActiveSection();

    return () => {
      observer.disconnect();
      visibilityRef.current.clear();
    };
  }, [updateActiveSection]);

  return (
    <>
      <header>
        <a href="#main-content" className="skip-nav">
          Skip to content
        </a>

        <nav className="glass-nav" data-scrolled={scrolled ? 'true' : 'false'} aria-label="Site navigation">
          <div className="container flex h-full items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group" aria-label="Oscar Ndugbu — home">
              <span
                className="font-display text-sm font-extrabold tracking-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Oscar Ndugbu
              </span>
              <span
                className="nav-tagline font-mono text-[9px] tracking-[0.12em] uppercase transition-colors duration-150 group-hover:text-white/60"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Full-Stack · AI · Fintech
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="desktop-nav-links nav-links hidden items-center gap-1 md:flex" role="list">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeSection === href;

                return (
                  <li key={href} role="listitem">
                    <a
                      href={resolveSectionHref(pathname, href)}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'relative inline-flex min-h-9 items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-film-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                        isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                      )}
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
                  </li>
                );
              })}
            </ul>

            {/* Desktop Controls */}
            <div className="desktop-nav-controls hidden items-center gap-3 md:flex">
              <SystemStatus />
              <ThemeToggle />
              <button
                type="button"
                onClick={openCommandPalette}
                className={cn(
                  'glass-light rounded-md px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase text-white/45 transition hover:text-white/70',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-film-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
                )}
                aria-label="Open command palette"
                title="Open command palette"
                style={{ minHeight: '32px' }}
              >
                ⌘K
              </button>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="cta-primary"
                style={{
                  minHeight: '36px',
                  padding: '0.375rem 1.125rem',
                  fontSize: '0.8125rem',
                  width: 'auto',
                }}
                aria-label="Tell me your constraints"
              >
                Tell me your constraints
              </a>
            </div>

            {/* Mobile CTA */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={cn(
                'flex md:hidden items-center justify-center rounded-md border border-white/20 px-3 py-2 text-xs font-semibold transition active:scale-95 hover:border-white/35 hover:bg-white/6',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-film-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
              )}
              style={{
                minHeight: '36px',
                minWidth: '44px',
                color: 'var(--color-film-teal)',
                background: 'oklch(70% 0.21 188 / 0.08)',
              }}
              aria-label="Tell me your constraints"
            >
              Tell me your constraints
            </a>
          </div>
        </nav>
      </header>

      <BottomNav activeSection={activeSection} pathname={pathname} />
    </>
  );
}