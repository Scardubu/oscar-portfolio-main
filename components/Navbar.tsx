'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { BrandWordmark } from '@/components/BrandWordmark';
import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import { anchorUrl } from '@/lib/config';
import { PROFILE } from '@/lib/portfolio-data';

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
  const mobileContentReadyRef = useRef(false);
  const lockedScrollYRef = useRef(0);
  const { activeChapter, scrollToSection, lenisRef } = useScrollCinema();
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  useEffect(() => {
    let frame = 0;

    const syncScrolled = () => {
      frame = 0;
      const nextScrolled = window.scrollY > 20;

      // Mobile chapters are contained only for the first paint. Release that
      // containment permanently after the visitor starts scrolling so anchor
      // geometry, menu scroll locking, and interactive content remain stable.
      if (nextScrolled && !mobileContentReadyRef.current) {
        mobileContentReadyRef.current = true;
        document.documentElement.setAttribute('data-mobile-content-ready', 'true');
      }

      if (nextScrolled === scrolledRef.current) return;

      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(syncScrolled);
    };

    syncScrolled();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      document.documentElement.removeAttribute('data-nav-open');
      return;
    }

    const scrollY = window.scrollY;
    lockedScrollYRef.current = scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('nav-open');
    document.documentElement.setAttribute('data-nav-open', 'true');
    const lenis = lenisRef.current;
    lenis?.stop();

    return () => {
      document.body.classList.remove('nav-open');
      document.body.style.top = '';
      document.documentElement.removeAttribute('data-nav-open');
      window.scrollTo(0, lockedScrollYRef.current);
      window.requestAnimationFrame(() => window.scrollTo(0, lockedScrollYRef.current));
      lenis?.start();
    };
  }, [mobileOpen, lenisRef]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    event.preventDefault();
    const nextHash = `#${id}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
    scrollToSection(id);
    closeMenu();
  };

  return (
    <>
      <header
        className="glass-nav hero-nav-shell [transform:translateZ(0)]"
        data-scrolled={scrolled ? 'true' : 'false'}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group relative flex items-center gap-3 rounded-[13px] focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            aria-label="Scardubu — Homepage"
          >
            <span className="brand-wordmark-lockup motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-px motion-safe:group-active:scale-[0.97]">
              <BrandWordmark size="nav" />
              <span className="brand-wordmark-kicker hidden sm:inline">{PROFILE.role}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const active = activeSectionId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'hero-nav-item group relative rounded-full px-3 py-2 text-sm transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                    'focus-visible:ring-[color:var(--chapter-accent)]',
                    active ? 'text-white' : 'text-white/60 hover:text-white/90',
                  ].join(' ')}
                >
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

          <a
            href={anchorUrl('section-contact')}
            onClick={(event) => handleNavClick(event, 'section-contact')}
            className="nav-availability-cta hidden lg:inline-flex"
            data-testid="nav-availability-cta"
            aria-label="Contact Oscar about current availability, Staff roles, and consulting"
          >
            <span className="nav-availability-dot" aria-hidden="true" />
            Available
          </a>

          <button
            type="button"
            className="hero-nav-menu-button inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span
                className={[
                  'absolute flex items-center justify-center transition-[opacity,transform] duration-200',
                  mobileOpen ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100',
                ].join(' ')}
                aria-hidden="true"
              >
                <Menu className="h-5 w-5" />
              </span>
              <span
                className={[
                  'absolute flex items-center justify-center transition-[opacity,transform] duration-200',
                  mobileOpen ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0',
                ].join(' ')}
                aria-hidden="true"
              >
                <X className="h-5 w-5" />
              </span>
            </span>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="hero-mobile-nav-panel fixed inset-x-0 top-16 z-50 px-4 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = activeSectionId === item.id;
              return (
                <div key={item.id}>
                  <a
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item.id)}
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
                </div>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
