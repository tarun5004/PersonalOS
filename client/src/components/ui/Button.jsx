import { mergeClassNames } from '../../lib/classNames.js';

const VARIANTS = {
  primary:
    'border-transparent bg-gradient-to-r from-primary to-focus text-primary-text shadow-card hover:brightness-105',
  secondary:
    'border-border bg-surface text-body shadow-card hover:border-focus hover:bg-surface-muted',
  dark: 'border-body bg-body text-primary-text shadow-card hover:border-body hover:bg-body/90',
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
        'inline-flex items-center justify-center gap-2 rounded-ui border font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/30 disabled:cursor-not-allowed disabled:opacity-60',
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
