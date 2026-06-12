import { mergeClassNames } from '../../lib/classNames.js';

const VARIANTS = {
  primary: 'bg-accent-soft text-accent-strong',
  muted: 'bg-surface-elevated text-muted',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

export function Badge({ children, className, variant = 'primary', ...props }) {
  return (
    <span
      className={mergeClassNames(
        'inline-flex min-h-6 items-center rounded-full px-2.5 text-xs font-semibold tracking-normal',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
