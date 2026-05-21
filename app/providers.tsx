'use client';

import type { ReactNode } from 'react';

import { MotionProvider } from '@/components/MotionProvider';
import { ScrollCinemaProvider } from '@/components/cinematic/ScrollCinemaProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export { useTheme } from '@/components/ThemeProvider';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <ScrollCinemaProvider>{children}</ScrollCinemaProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
