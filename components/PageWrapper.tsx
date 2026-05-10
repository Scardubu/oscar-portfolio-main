'use client';
// components/PageWrapper.tsx
// CONVICTION ENGINE v19.0
// Page transitions removed from mobile path — they add ~120ms perceived latency
// on Android mid-range. Scroll-reveal IntersectionObserver retained.

import { useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

export default function PageWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (reducedMotion) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, reducedMotion]);

  return <>{children}</>;
}