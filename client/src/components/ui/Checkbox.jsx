import { useId } from 'react';
import { mergeClassNames } from '../../lib/classNames.js';

export function Checkbox({ className, description, id, label, ...props }) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label
      className={mergeClassNames(
        'flex cursor-pointer items-start gap-3 rounded-ui border border-border bg-surface px-3.5 py-3 text-sm text-body transition hover:bg-surface-muted',
        className,
      )}
      htmlFor={checkboxId}
    >
      <input
        className="mt-1 size-4 rounded border-border text-primary focus:ring-[3px] focus:ring-focus/25"
        id={checkboxId}
        type="checkbox"
        {...props}
      />
      <span>
        <span className="block font-bold">{label}</span>
        {description ? <span className="mt-1 block text-muted">{description}</span> : null}
      </span>
    </label>
  );
}
