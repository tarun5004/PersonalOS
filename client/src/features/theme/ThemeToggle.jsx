import { useTheme } from './useTheme.js';
import { mergeClassNames } from '../../lib/classNames.js';

const LABELS = {
  light: 'Light',
  dark: 'Dark',
};

export function ThemeToggle({ compact = false }) {
  const { setTheme, theme, themes } = useTheme();

  return (
    <div
      aria-label="Theme"
      className={mergeClassNames(
        'inline-grid grid-cols-2 gap-1 rounded-ui border border-border bg-surface-muted p-1',
        compact ? 'w-auto' : 'min-w-40',
      )}
      role="group"
    >
      {themes.map((themeValue) => (
        <button
          aria-pressed={theme === themeValue}
          className={mergeClassNames(
            'min-h-9 rounded-[6px] px-3 text-sm font-bold text-muted transition hover:text-body focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/25',
            theme === themeValue && 'bg-surface text-body shadow-card',
          )}
          key={themeValue}
          onClick={() => setTheme(themeValue)}
          type="button"
        >
          {LABELS[themeValue]}
        </button>
      ))}
    </div>
  );
}
