import { forwardRef, useId } from 'react';
import { mergeClassNames } from '../../lib/classNames.js';

export const Select = forwardRef(function Select({
  children,
  className,
  error,
  id,
  label,
  selectClassName,
  ...props
}, ref) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className={mergeClassNames('grid gap-2', className)}>
      {label ? (
        <label className="text-sm font-bold text-body" htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <select
        aria-describedby={errorId}
        aria-invalid={Boolean(error) || undefined}
        className={mergeClassNames(
          'min-h-12 w-full rounded-card border border-border bg-surface-elevated px-3.5 py-3 text-body outline-none transition duration-200 focus:border-accent focus:bg-surface focus:shadow-focus aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-65',
          selectClassName,
        )}
        id={selectId}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p className="m-0 text-sm text-danger" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
});
