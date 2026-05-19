'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Sun/Moon toggle with spring-physics icon swap.
// Min touch target: 48×48px (WCAG 2.2 §2.5.8).
// Imports: framer-motion directly, no legacy bridge.

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';

import { useTheme } from '@/components/ThemeProvider';

const SPRING = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 24,
  mass: 0.9,
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-color-text-muted inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border border-white/10 transition hover:border-white/20 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none active:scale-[0.96]"
    >
      <AnimatePresence initial={false} mode="wait">
        {isDark ? (
          <m.svg
            key="moon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reducedMotion ? false : { opacity: 0, rotate: -20, scale: 0.85 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reducedMotion ? {} : { opacity: 0, rotate: 20, scale: 0.85 }}
            transition={SPRING}
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </m.svg>
        ) : (
          <m.svg
            key="sun"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reducedMotion ? false : { opacity: 0, rotate: 20, scale: 0.85 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reducedMotion ? {} : { opacity: 0, rotate: -20, scale: 0.85 }}
            transition={SPRING}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </m.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
