import { mergeClassNames } from '../../lib/classNames.js';

export function Loader({ className, label = 'Loading...' }) {
  return (
    <div
      className={mergeClassNames('flex items-center gap-3 text-sm font-semibold text-muted', className)}
      role="status"
    >
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-accent/25 border-t-accent"
      />
      <span>{label}</span>
    </div>
  );
}
