'use client';
// components/PageWrapper.tsx
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Mobile-native page shell: bottom-nav padding, scroll-reveal init,
// reduced-motion safety. Page transitions removed from mobile path —
// they add ~120ms perceived latency on Android mid-range.
//
// v2026.7: wrapper overflow `overflow-x-hidden` → `overflow-x-clip`.
//   `hidden` creates a new Block Formatting Context which, on iOS Safari,
//   can intercept vertical page scroll and cause absolutely-positioned
//   descendants (Next.js `fill` images) to render incorrectly. `clip` clips
//   horizontal overflow without creating a BFC or scroll container — native
//   and Lenis scroll remain unaffected. Aligns with the pattern already used
//   by ProjectsSection, OpenSourceSection, and TestimonialsSection.

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition, type ReactNode } from 'react';

interface PageWrapperProps {
  readonly children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }

    return () => {
      if (!reducedMotion) {
        root.removeAttribute('data-reduced-motion');
      }
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (pathname === activePath) return;

    startTransition(() => {
      setActivePath(pathname);
    });
  }, [activePath, pathname, startTransition]);

  const pageTransition = useMemo(
    () => ({
      initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 },
      transition: reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    }),
    [reducedMotion]
  );

  return (
    <div
      id="page-wrapper"
      className="relative flex min-h-[100dvh] flex-col overflow-x-clip"
      data-page-transitioning={isPending ? 'true' : 'false'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.div key={activePath} {...pageTransition} className="relative z-[2] flex-1">
          {children}
        </m.div>
      </AnimatePresence>
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] bg-black/35"
        animate={{ opacity: isPending && !reducedMotion ? 0.1 : 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
