import { Check, Minus, X } from 'lucide-react';
import { mergeClassNames } from '../../../lib/classNames.js';

export function HabitCheckCell({
  dateKey,
  day,
  disabled,
  isCompleted,
  isFuture,
  isToday,
  onCheckIn,
}) {
  const isMissed = !isCompleted && !isFuture && !isToday;
  const canCheckIn = Boolean(isToday && !isCompleted && onCheckIn);
  const Icon = isCompleted ? Check : isMissed ? X : Minus;
  const label = isCompleted
    ? `${dateKey} completed`
    : isFuture
      ? `${dateKey} future day`
      : isToday
        ? `${dateKey} check in today`
        : `${dateKey} missed`;
  const Component = canCheckIn ? 'button' : 'span';
  const componentProps =
    Component === 'button'
      ? {
          disabled,
          onClick: onCheckIn,
          type: 'button',
        }
      : {};

  return (
    <Component
      aria-label={label}
      className={mergeClassNames(
        'grid size-7 shrink-0 place-items-center rounded-none border text-[11px] transition duration-150',
        isCompleted &&
          'animate-[habit-check-pop_180ms_ease-out] border-[var(--habit-row-color,var(--habit-done))] bg-[var(--habit-done-bg)] text-[var(--habit-row-color,var(--habit-done))]',
        isMissed &&
          'border-[var(--habit-missed)] bg-[var(--habit-missed-bg)] text-[var(--danger-text)]',
        isFuture && 'border-border bg-[var(--habit-future)] text-[var(--text-tertiary)]',
        canCheckIn &&
          'border-2 border-[var(--habit-today)] bg-surface text-body border-pulse hover:border-accent hover:bg-accent-soft focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-70',
      )}
      title={label}
      {...componentProps}
    >
      <Icon aria-hidden="true" size={isCompleted ? 14 : 13} strokeWidth={isCompleted ? 3 : 2.5} />
      <span className="sr-only">Day {day}</span>
    </Component>
  );
}
