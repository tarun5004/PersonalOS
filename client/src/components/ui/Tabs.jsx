import { mergeClassNames } from '../../lib/classNames.js';

export function Tabs({ className, children, ...props }) {
  return (
    <div className={mergeClassNames('grid gap-4', className)} {...props}>
      {children}
    </div>
  );
}

export function TabList({ className, children, ...props }) {
  return (
    <div
      className={mergeClassNames(
        'inline-flex rounded-ui border border-border bg-surface-muted p-1',
        className,
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
}

export function TabButton({ active = false, className, children, ...props }) {
  return (
    <button
      aria-selected={active}
      className={mergeClassNames(
        'min-h-9 rounded-[6px] px-3 text-sm font-bold text-muted transition hover:text-body focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/25',
        active && 'bg-surface text-body shadow-card',
        className,
      )}
      role="tab"
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
