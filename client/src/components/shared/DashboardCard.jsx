import { mergeClassNames } from '../../lib/classNames.js';

export function DashboardCard({
  action,
  children,
  className,
  eyebrow,
  title,
  ...props
}) {
  return (
    <section
      className={mergeClassNames(
        'rounded-ui border border-border bg-surface p-5 shadow-card',
        className,
      )}
      {...props}
    >
      {(eyebrow || title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="m-0 text-xs font-bold uppercase text-muted">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2 className="mt-1 text-lg font-extrabold text-body">{title}</h2>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
