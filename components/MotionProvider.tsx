'use client';

/**
 * CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
 * Major Reset • Lagos → Global • Production Conviction Architecture
 *
 * MotionProvider — LazyMotion wrapper.

 * Global MotionConfig is applied in app/providers.tsx so transition and
 * reduced-motion behavior are managed from a single top-level entrypoint.
 */

import { LazyMotion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

type MotionFeatures = typeof import('./motion-features').default;

const staticFeatures = {} as MotionFeatures;

let featurePromise: Promise<MotionFeatures> | null = null;

const loadFeatures = () => {
  featurePromise ??= import('./motion-features').then((module) => module.default);
  return featurePromise;
};

export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [features, setFeatures] = useState<MotionFeatures>(staticFeatures);

  useEffect(() => {
    let active = true;

    void loadFeatures().then(
      (loadedFeatures) => {
        if (active) setFeatures(loadedFeatures);
      },
      () => {
        // Static content is already rendered; animation features are optional.
      }
    );

    return () => {
      active = false;
    };
  }, []);

  return (
    <LazyMotion features={features} strict>
      {children}
    </LazyMotion>
  );
}
