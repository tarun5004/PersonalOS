import { forwardRef, useId } from 'react';
import { mergeClassNames } from '../../lib/classNames.js';

export const Input = forwardRef(function Input({
  className,
  description,
  error,
  id,
  inputClassName,
  label,
  ...props
}, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [props['aria-describedby'], descriptionId, errorId]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={mergeClassNames('grid gap-2', className)}>
      {label ? (
        <label className="text-sm font-semibold text-body" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error) || props['aria-invalid'] || undefined}
        className={mergeClassNames(
          'min-h-12 w-full rounded-card border border-border bg-surface px-3.5 py-3 text-body outline-none transition duration-200 placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:shadow-focus aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-65',
          inputClassName,
        )}
        id={inputId}
        ref={ref}
        {...props}
      />
      {description ? (
        <p className="m-0 text-sm text-muted" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="m-0 text-sm text-danger" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
});
