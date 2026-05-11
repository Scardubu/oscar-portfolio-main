'use client';
// components/PageWrapper.tsx
// CONVICTION ENGINE v22.0
// Mobile-native page shell: bottom-nav padding, scroll-reveal init,
// reduced-motion safety. Page transitions removed from mobile path —
// they add ~120ms perceived latency on Android mid-range.

import { useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

interface PageWrapperProps {
  readonly children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const reducedMotion = useReducedMotion();

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

  return (
    <div
      id="page-wrapper"
      className="relative flex min-h-[100svh] flex-col"
      style={{
        // Ensure content never overflows viewport on mobile
        overflowX: 'hidden',
        // Isolate stacking context — prevents z-index bleed from fixed Navbar
        isolation: 'isolate',
      }}
    >
      {children}
    </div>
  );
}