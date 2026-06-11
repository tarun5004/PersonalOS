import { mergeClassNames } from '../../lib/classNames.js';

const VARIANTS = {
  primary:
    'border-primary bg-primary text-primary-text shadow-card hover:border-primary-strong hover:bg-primary-strong',
  secondary:
    'border-border bg-surface text-body shadow-card hover:border-focus hover:bg-primary-soft',
  dark: 'border-border bg-surface-muted text-body shadow-card hover:border-focus hover:bg-surface',
  ghost:
    'border-transparent bg-transparent text-muted hover:bg-surface-muted hover:text-body',
  danger:
    'border-danger/40 bg-danger/10 text-danger hover:border-danger hover:bg-danger/15',
};

const SIZES = {
  sm: 'min-h-9 px-3 py-1.5 text-sm',
  md: 'min-h-10 px-4 py-2 text-sm',
  lg: 'min-h-12 px-5 py-3 text-base',
  icon: 'size-10 p-0',
};

export function Button({
  as: Component = 'button',
  children,
  className,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const componentProps = Component === 'button' ? { type } : {};

  return (
    <Component
      className={mergeClassNames(
        'inline-flex items-center justify-center gap-2 rounded-ui border font-semibold transition duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  );
}
