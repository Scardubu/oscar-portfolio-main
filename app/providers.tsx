'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

import {
  ScrollCinemaProvider,
  ScrollCinemaStaticProvider,
} from '@/components/cinematic/ScrollCinemaProvider';
import { CinematicErrorBoundary } from '@/components/CinematicErrorBoundary';
import { MotionProvider } from '@/components/MotionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export { useTheme } from '@/components/ThemeProvider';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider>
      <MotionConfig
        reducedMotion="user"
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 26,
        }}
      >
        <MotionProvider>
          <CinematicErrorBoundary
            fallback={<ScrollCinemaStaticProvider>{children}</ScrollCinemaStaticProvider>}
          >
            <ScrollCinemaProvider>{children}</ScrollCinemaProvider>
          </CinematicErrorBoundary>
        </MotionProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
