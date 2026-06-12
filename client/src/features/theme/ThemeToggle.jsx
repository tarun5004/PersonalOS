import { Switch } from '@headlessui/react';
import { useTheme } from './useTheme.js';
import { mergeClassNames } from '../../lib/classNames.js';

const LABELS = {
  light: 'Light',
  dark: 'Dark',
};

export function ThemeToggle({ compact = false }) {
  const { setTheme, theme, themes } = useTheme();
  const isDark = theme === 'dark';

  function handleChange(nextIsDark) {
    setTheme(nextIsDark ? 'dark' : 'light');
  }

  return (
    <div
      aria-label="Theme"
      className={mergeClassNames(
        'inline-flex items-center gap-1 rounded-card border border-border bg-surface-elevated p-1 shadow-card',
        compact ? 'w-auto' : 'min-w-40',
      )}
      role="group"
    >
      <span className={mergeClassNames('px-2 text-sm font-bold', !isDark ? 'text-body' : 'text-muted')}>
        {LABELS[themes[0]]}
      </span>
      <Switch
        checked={isDark}
        className="relative inline-flex h-8 w-14 items-center rounded-full bg-surface shadow-card transition focus-visible:outline-none focus-visible:shadow-focus"
        onChange={handleChange}
      >
        <span className="sr-only">Toggle dark theme</span>
        <span
          className={mergeClassNames(
            'inline-block size-6 rounded-full bg-accent shadow-card transition',
            isDark ? 'translate-x-7' : 'translate-x-1',
          )}
        />
      </Switch>
      <span className={mergeClassNames('px-2 text-sm font-bold', isDark ? 'text-body' : 'text-muted')}>
        {LABELS[themes[1]]}
      </span>
    </div>
  );
}
