import { mergeClassNames } from '../../lib/classNames.js';

export function Table({ children, className, ...props }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className={mergeClassNames('w-full border-collapse text-left text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }) {
  return (
    <thead className={mergeClassNames('bg-surface-elevated text-muted', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableCell({ as: Component = 'td', children, className, ...props }) {
  return (
    <Component className={mergeClassNames('border-b border-border px-4 py-3', className)} {...props}>
      {children}
    </Component>
  );
}
