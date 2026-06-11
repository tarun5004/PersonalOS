import { Check, Minus } from 'lucide-react';
import { mergeClassNames } from '../../../lib/classNames.js';

export function HabitCheckCell({ dateKey, day, isCompleted, isFuture, isToday }) {
  const Icon = isCompleted ? Check : Minus;
  const label = isCompleted
    ? `${dateKey} completed`
    : isFuture
      ? `${dateKey} future day`
      : `${dateKey} not completed`;

  return (
    <span
      aria-label={label}
      className={mergeClassNames(
        'grid size-7 shrink-0 place-items-center rounded-[6px] border text-[11px] transition',
        isCompleted && 'border-success bg-success/15 text-success',
        !isCompleted && !isFuture && 'border-border bg-surface-muted text-muted',
        isFuture && 'border-border bg-surface text-muted/40',
        isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
      )}
      title={label}
    >
      <Icon aria-hidden="true" size={13} strokeWidth={2.5} />
      <span className="sr-only">Day {day}</span>
    </span>
  );
}
