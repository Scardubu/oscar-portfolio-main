'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ThreeBrushField = dynamic(
  () => import('@/components/cinematic/ThreeBrushField').then((mod) => mod.ThreeBrushField),
  {
    ssr: false,
    loading: () => null,
  }
);

export function DeferredThreeBrushField() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    // On mobile/touch/reduced-motion, skip WebGL entirely — the static
    // CSS gradient in globals.css provides sufficient atmosphere.
    // `max-width: 639px` covers all phones; `pointer: coarse` covers
    // tablets and stylus devices; reduced-motion skips animation entirely.
    const lowPowerPath = window.matchMedia(
      '(max-width: 768px), (pointer: coarse), (prefers-reduced-motion: reduce)'
    ).matches;

    if (lowPowerPath) {
      return;
    }

    // Defer mount by 900ms to not compete with LCP / first paint
    const timer = window.setTimeout(() => {
      setShouldMount(true);
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!shouldMount) {
    return null;
  }

  return <ThreeBrushField />;
}
