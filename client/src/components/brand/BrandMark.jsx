import { mergeClassNames } from '../../lib/classNames.js';

export function BrandMark({
  className,
  iconClassName,
  label = 'Personal OS',
  showLabel = false,
}) {
  return (
    <span className={mergeClassNames('inline-flex min-w-0 items-center gap-3', className)}>
      <span
        className={mergeClassNames(
          'grid size-10 shrink-0 place-items-center rounded-card border border-border bg-accent text-accent-text shadow-card',
          iconClassName,
        )}
        aria-hidden="true"
      >
        <svg
          className="size-[58%]"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            height="6.5"
            rx="1.8"
            stroke="currentColor"
            strokeWidth="2"
            width="6.5"
            x="4"
            y="4"
          />
          <rect
            height="6.5"
            rx="1.8"
            stroke="currentColor"
            strokeWidth="2"
            width="6.5"
            x="13.5"
            y="4"
          />
          <rect
            height="6.5"
            rx="1.8"
            stroke="currentColor"
            strokeWidth="2"
            width="6.5"
            x="4"
            y="13.5"
          />
          <path
            d="M15 17.2h4.8M17.4 14.8v4.8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </span>
      {showLabel ? (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-body">{label}</span>
          <span className="mt-0.5 block truncate text-xs text-muted">Command center</span>
        </span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
