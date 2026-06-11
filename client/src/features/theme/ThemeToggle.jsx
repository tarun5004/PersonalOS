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
        'inline-flex items-center gap-1 rounded-ui border border-border bg-surface-muted p-1',
        compact ? 'w-auto' : 'min-w-40',
      )}
      role="group"
    >
      <span className={mergeClassNames('px-2 text-sm font-bold', !isDark ? 'text-body' : 'text-muted')}>
        {LABELS[themes[0]]}
      </span>
      <Switch
        checked={isDark}
        className="relative inline-flex h-8 w-14 items-center rounded-full bg-surface shadow-card transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/25"
        onChange={handleChange}
      >
        <span className="sr-only">Toggle dark theme</span>
        <span
          className={mergeClassNames(
            'inline-block size-6 rounded-full bg-gradient-to-r from-primary to-focus transition',
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
