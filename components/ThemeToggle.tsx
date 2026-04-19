'use client';

import { AnimatePresence, m } from 'framer-motion';

import { useTheme } from '@/components/ThemeProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { springConfig } from '@/lib/motion';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-(--color-text-muted) transition hover:border-white/20 hover:text-(--color-text-primary)"
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
            initial={reducedMotion ? false : { opacity: 0, rotate: -20, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reducedMotion ? {} : { opacity: 0, rotate: 20, scale: 0.9 }}
            transition={springConfig}
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
            initial={reducedMotion ? false : { opacity: 0, rotate: 20, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reducedMotion ? {} : { opacity: 0, rotate: -20, scale: 0.9 }}
            transition={springConfig}
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
