'use client';
// components/PageWrapper.tsx
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// Mobile-native page shell with reduced-motion-safe, CSS-only route entry.
// The first server render is always fully visible; Framer Motion is not part
// of this critical layout boundary.
//
// v2026.7: wrapper overflow `overflow-x-hidden` → `overflow-x-clip`.
//   `hidden` creates a new Block Formatting Context which, on iOS Safari,
//   can intercept vertical page scroll and cause absolutely-positioned
//   descendants (Next.js `fill` images) to render incorrectly. `clip` clips
//   horizontal overflow without creating a BFC or scroll container — native
//   and Lenis scroll remain unaffected. Aligns with the pattern already used
//   by ProjectsSection, OpenSourceSection, and TestimonialsSection.

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface PageWrapperProps {
  readonly children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    if (pathname === previousPath.current) return;

    previousPath.current = pathname;
    setIsEntering(true);

    const timer = window.setTimeout(() => setIsEntering(false), 300);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      id="page-wrapper"
      className="relative flex min-h-[100dvh] flex-col overflow-x-clip"
      data-page-transitioning={isEntering ? 'true' : 'false'}
    >
      <div
        className="page-route-content relative z-[2] flex-1"
        data-page-entering={isEntering ? 'true' : 'false'}
      >
        {children}
      </div>
    </div>
  );
}
