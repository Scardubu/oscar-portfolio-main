'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from '@/components/ThemeProvider';

export { useTheme } from '@/components/ThemeProvider';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
