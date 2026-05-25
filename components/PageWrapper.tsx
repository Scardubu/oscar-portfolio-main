'use client';
// components/PageWrapper.tsx
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Mobile-native page shell: bottom-nav padding, scroll-reveal init,
// reduced-motion safety. Page transitions removed from mobile path —
// they add ~120ms perceived latency on Android mid-range.

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';

interface PageWrapperProps {
  readonly children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const reduce  dMotion = useReducedMotion();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    // iOS Safari: prevent elastic overscroll from exposing raw background
    document.documentElement.style.overscrollBehaviorY = 'none';

    // Apply reduced-motion class for CSS fallbacks
    if (reducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    startTransition(() => {
      setActivePath(pathname);
    });
  }, [pathname, startTransition]);

  const pageTransition = useMemo(
    () => ({
      initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 },
      transition: reducedMotion
        ? { duration: 0 }
        : { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    }),
    [reducedMotion]
  );

  return (
    <div
      id="page-wrapper"
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-hidden"
      data-page-transitioning={isPending ? 'true' : 'false'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.div key={activePath} {...pageTransition} className="relative z-[2] flex-1">
          {children}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
