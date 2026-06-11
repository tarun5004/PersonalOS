import { useTheme } from './useTheme.js';
import './ThemeToggle.css';

const LABELS = {
  light: 'Light',
  dark: 'Dark',
};

export function ThemeToggle({ compact = false }) {
  const { setTheme, theme, themes } = useTheme();

  return (
    <div
      aria-label="Theme"
      className={compact ? 'theme-toggle theme-toggle-compact' : 'theme-toggle'}
      role="group"
    >
      {themes.map((themeValue) => (
        <button
          aria-pressed={theme === themeValue}
          className={theme === themeValue ? 'theme-option theme-option-active' : 'theme-option'}
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

