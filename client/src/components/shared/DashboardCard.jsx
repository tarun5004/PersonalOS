import { Card } from '../ui/Card.jsx';
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
    <Card
      as="section"
      className={mergeClassNames(
        'min-w-0 p-4 transition duration-200 hover:border-accent/70 sm:p-5',
        className,
      )}
      {...props}
    >
      {(eyebrow || title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="m-0 text-xs font-semibold uppercase text-muted">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2 className="mt-1 text-lg font-bold text-body">{title}</h2>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </Card>
  );
}
