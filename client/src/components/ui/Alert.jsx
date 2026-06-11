import { mergeClassNames } from '../../lib/classNames.js';

const VARIANTS = {
  error: 'border-danger/45 bg-danger/10 text-danger',
  info: 'border-info/35 bg-info/10 text-info',
  success: 'border-success/35 bg-success/10 text-success',
  warning: 'border-warning/35 bg-warning/10 text-warning',
};

export function Alert({ children, className, role, variant = 'info', ...props }) {
  const fallbackRole = variant === 'error' ? 'alert' : 'status';

  return (
    <div
      className={mergeClassNames(
        'rounded-ui border px-3.5 py-3 text-sm font-semibold',
        VARIANTS[variant],
        className,
      )}
      role={role || fallbackRole}
      {...props}
    >
      {children}
    </div>
  );
}
