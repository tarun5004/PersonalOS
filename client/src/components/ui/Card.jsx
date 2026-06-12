import { mergeClassNames } from '../../lib/classNames.js';

export function Card({ as: Component = 'div', children, className, ...props }) {
  return (
    <Component
      className={mergeClassNames(
        'rounded-card border border-border bg-surface shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={mergeClassNames('space-y-1', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ as: Component = 'h2', children, className, ...props }) {
  return (
    <Component
      className={mergeClassNames('m-0 text-xl font-bold text-body', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={mergeClassNames('m-0 text-sm leading-6 text-muted', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={mergeClassNames('mt-5', className)} {...props}>
      {children}
    </div>
  );
}
