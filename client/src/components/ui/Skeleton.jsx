import { mergeClassNames } from '../../lib/classNames.js';

export function Skeleton({ className }) {
  return (
    <span
      aria-hidden="true"
      className={mergeClassNames('block animate-pulse rounded-ui bg-surface-muted', className)}
    />
  );
}
