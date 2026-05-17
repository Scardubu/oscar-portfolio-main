'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { anchorUrl } from '@/lib/config';

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
  {
    label: 'Projects',
    href: '#section-projects',
    id: 'section-projects',
  },
  {
    label: 'Testimonials',
    href: '#section-testimonials',
    id: 'section-testimonials',
  },
  {
    label: 'Open Source',
    href: '#open-source',
    id: 'open-source',
  },
  {
    label: 'Skills',
    href: '#skills',
    id: 'skills',
  },
  {
    label: 'About',
    href: '#section-about',
    id: 'section-about',
  },
  {
    label: 'Writing',
    href: '#section-writing',
    id: 'section-writing',
  },
  {
    label: 'Contact',
    href: '#section-contact',
    id: 'section-contact',
  },
];

const navbarVariants = {
  hidden: {
    y: -32,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.18,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      staggerChildren: 0.04,
    },
  },
};

const mobileItemVariants = {
  hidden: {
    opacity: 0,
    x: -12,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<SectionId>('section-projects');

  const [scrolled, setScrolled] = useState(false);

  const tickingRef = useRef(false);
  const visibilityRef = useRef<Map<SectionId, number>>(new Map());

  const navItems = useMemo(() => NAV_ITEMS, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);

      if (tickingRef.current) return;

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        let nextActive: SectionId = activeSection;

        const visibleSections = visibilityRef.current;

        if (visibleSections.size > 0) {
          const sorted = [...visibleSections.entries()].sort(
            (a, b) => b[1] - a[1]
          );

          nextActive = sorted[0][0];
        } else {
          let closestId: (typeof SECTION_IDS)[number] =
            SECTION_IDS[0];

          let closestDistance = Number.POSITIVE_INFINITY;

          SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);

            if (!el) return;

            const distance = Math.abs(
              el.getBoundingClientRect().top
            );

            if (distance < closestDistance) {
              closestDistance = distance;
              closestId = id;
            }
          });

          nextActive = closestId;
        }

        setActiveSection((prev) =>
          prev === nextActive ? prev : nextActive
        );

        tickingRef.current = false;
      });
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

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

  useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <m.header
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={[
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/10 bg-black/70 backdrop-blur-2xl'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group relative flex items-center gap-3"
            aria-label="Homepage"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-purple-500/20 opacity-80" />

              <span className="relative text-sm font-semibold tracking-wide text-white">
                OS
              </span>
            </div>

            <div className="hidden sm:flex sm:flex-col">
              <span className="text-sm font-semibold tracking-wide text-white">
                Oscar
              </span>

              <span className="text-xs text-white/50">
                Systems Engineer
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const active = activeSection === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="relative"
                >
                  <div
                    className={[
                      'relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300',
                      active
                        ? 'text-white'
                        : 'text-white/60 hover:text-white',
                    ].join(' ')}
                  >
                    {active && (
                      <m.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-xl border border-cyan-400/20 bg-white/10 backdrop-blur-xl"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="relative z-10">
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA — P3-C: "Hire Oscar" always visible at ≥1024px */}
          <Link
            href={anchorUrl('section-contact')}
            className="hidden lg:inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(73%_0.18_196)] focus-visible:ring-offset-2 focus-visible:ring-offset-black hover:bg-[oklch(73%_0.18_196_/_0.08)]"
            style={{
              borderColor: 'oklch(73% 0.18 196 / 0.55)',
              color: 'oklch(73% 0.18 196)',
            }}
          >
            Hire Oscar
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </m.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
              onClick={closeMenu}
            />

            <m.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-3xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-2xl lg:hidden"
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
                        onClick={closeMenu}
                        className={[
                          'flex items-center justify-between rounded-2xl px-4 py-4 text-sm font-medium transition-all duration-300',
                          active
                            ? 'bg-white/10 text-white'
                            : 'text-white/65 hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                      >
                        <span>{item.label}</span>

                        {active && (
                          <div className="h-2 w-2 rounded-full bg-cyan-400" />
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