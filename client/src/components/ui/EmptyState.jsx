import { mergeClassNames } from '../../lib/classNames.js';

export function EmptyState({ action, className, description, framed = true, icon: Icon, title }) {
  return (
    <div
      className={mergeClassNames(
        'grid place-items-center rounded-ui p-8 text-center',
        framed && 'border border-border bg-surface shadow-card',
        className,
      )}
    >
      <div className="max-w-sm">
        <div className="mx-auto mb-4 grid size-11 place-items-center rounded-ui bg-primary-soft text-primary-strong">
          {Icon ? <Icon aria-hidden="true" size={19} /> : '+'}
        </div>
        <h2 className="m-0 text-lg font-bold text-body">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
