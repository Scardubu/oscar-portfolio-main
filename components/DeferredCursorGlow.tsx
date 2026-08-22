'use client';

import { lazy, Suspense, useEffect, useState } from 'react';

const CursorGlow = lazy(() => import('./CursorGlow'));

export function DeferredCursorGlow() {
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncEligibility = () => setEligible(finePointer.matches && !reducedMotion.matches);

    syncEligibility();
    finePointer.addEventListener('change', syncEligibility);
    reducedMotion.addEventListener('change', syncEligibility);

    return () => {
      finePointer.removeEventListener('change', syncEligibility);
      reducedMotion.removeEventListener('change', syncEligibility);
    };
  }, []);

  if (!eligible) return null;

  return (
    <Suspense fallback={null}>
      <CursorGlow />
    </Suspense>
  );
}
