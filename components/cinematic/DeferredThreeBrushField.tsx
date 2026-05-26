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
    const lowPowerPath = window.matchMedia(
      '(max-width: 639px), (pointer: coarse), (prefers-reduced-motion: reduce)'
    ).matches;

    if (lowPowerPath) {
      return;
    }

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
