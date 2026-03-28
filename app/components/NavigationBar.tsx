'use client';

import { useEffect, useMemo, useState } from 'react';

import { homeNavigation } from '@/app/lib/homepage';
import { cn } from '@/lib/utils';

function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.45, 0.65],
        rootMargin: '-18% 0px -52% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}

export function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const sectionIds = useMemo(() => homeNavigation.map((item) => item.id), []);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-4 z-50">
      <div
        className={cn(
          'glass-surface glass-surface-heavy focus-ring-branded flex items-center justify-between gap-4 rounded-[1.5rem] px-4 py-3 transition-all duration-200 md:px-5',
          scrolled
            ? 'border-white/20 bg-[rgba(10,10,15,0.72)] shadow-[0_20px_70px_rgba(0,0,0,0.32)]'
            : 'bg-[rgba(10,10,15,0.52)]'
        )}
      >
        <a href="#top" className="focus-ring-branded min-w-0 rounded-full px-2 py-1">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-sm font-semibold text-[var(--text-primary)]">
              OD
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                Oscar Dubu
              </p>
              <p className="truncate text-xs text-[var(--text-secondary)]">
                Production AI systems · Full-stack execution
              </p>
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {homeNavigation.map((item) => {
            const isActive = item.id === activeSection;
            return (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  'focus-ring-branded rounded-full px-4 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-white/10 text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--text-secondary)] md:inline-flex">
            <span className="live-dot" aria-hidden="true" />
            Open to the right build
          </span>
          <a
            href="#contact"
            className="focus-ring-branded inline-flex min-h-11 items-center rounded-full bg-[var(--accent-primary)] px-5 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5"
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </header>
  );
}
