import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'pos-theme';
const THEME_VALUES = ['light', 'dark'];

export const ThemeContext = createContext(null);

function isTheme(value) {
  return THEME_VALUES.includes(value);
}

function readStoredTheme() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

function getPreferredTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  const storedTheme = readStoredTheme();
  return storedTheme ?? systemTheme;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getPreferredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme persistence should never block the app from rendering.
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    if (isTheme(nextTheme)) {
      setThemeState(nextTheme);
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      themes: THEME_VALUES,
      setTheme,
    }),
    [setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
