'use client';

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
  hidden: { y: -32, opacity: 0 },
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
  const reducedMotion = useReducedMotion();
  const { activeChapter } = useScrollCinema();

  const navItems = useMemo(() => NAV_ITEMS, []);
  const activeSectionId = getActiveIdFromChapter(activeChapter);

  useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <m.header
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={[
          'fixed inset-x-0 top-0 z-50 transform-gpu',
          'transition-[background-color,border-color,backdrop-filter] duration-300',
          'border-b border-white/8 bg-black/20 backdrop-blur-xl',
        ].join(' ')}
        // eslint-disable-next-line no-restricted-syntax
        style={{ translateZ: 0 }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group relative flex items-center gap-3 rounded-[13px] focus-visible:ring-2 focus-visible:ring-[oklch(70%_0.21_188)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
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

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = activeSectionId === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'rounded-full px-3 py-2 text-sm transition',
                    'focus-visible:ring-2 focus-visible:ring-[oklch(70%_0.21_188)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </m.header>

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
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition',
                        active
                          ? 'border-white/15 bg-white/10 text-white'
                          : 'border-white/8 bg-white/5 text-white/80',
                      ].join(' ')}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                        {item.id}
                      </span>
                    </Link>
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
