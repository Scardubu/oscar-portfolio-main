'use client';

import type { ReactNode } from 'react';

import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

export { useTheme };

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return <ThemeProvider>{children}</ThemeProvider>;
}