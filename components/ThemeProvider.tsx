'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(selectedTheme: Theme, prefersLight: boolean): ResolvedTheme {
  if (selectedTheme === 'system') {
    return prefersLight ? 'light' : 'dark';
  }

  return selectedTheme;
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    const stored = globalThis.localStorage.getItem('theme');
    const initialTheme: Theme =
      stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system';

    setThemeState(initialTheme);
  }, []);

  useEffect(() => {
    const media = globalThis.matchMedia('(prefers-color-scheme: light)');
    const applyTheme = (nextTheme: Theme) => {
      const resolved = resolveTheme(nextTheme, media.matches);

      setResolvedTheme(resolved);
      document.documentElement.dataset.theme = resolved;
    };

    applyTheme(theme);

    if (theme !== 'system') {
      return;
    }

    const onChange = () => applyTheme('system');

    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    globalThis.localStorage.setItem('theme', nextTheme);
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme]
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
