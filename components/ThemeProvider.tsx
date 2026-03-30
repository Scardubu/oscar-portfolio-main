'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(theme: Theme, prefersLight: boolean): ResolvedTheme {
  if (theme === 'system') {
    return prefersLight ? 'light' : 'dark';
  }

  return theme;
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const stored = localStorage.getItem('theme');
    const initialTheme: Theme =
      stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system';

    const applyTheme = (nextTheme: Theme) => {
      const resolved = resolveTheme(nextTheme, media.matches);
      setThemeState(nextTheme);
      setResolvedTheme(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    };

    applyTheme(initialTheme);

    const onChange = () => applyTheme(initialTheme === 'system' ? 'system' : initialTheme);
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const resolved = resolveTheme(theme, media.matches);

    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme: setThemeState }),
    [resolvedTheme, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
