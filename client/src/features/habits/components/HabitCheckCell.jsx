import { motion } from 'framer-motion';
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
  const Component = canCheckIn ? motion.button : motion.span;
  const componentProps = canCheckIn
    ? {
        disabled,
        onClick: onCheckIn,
        type: 'button',
      }
    : {};

  return (
    <Component
      animate={isCompleted && isToday ? { scale: [0.88, 1.08, 1] } : { scale: 1 }}
      aria-label={label}
      className={mergeClassNames(
        'grid size-7 shrink-0 place-items-center rounded-none border text-[11px] transition duration-150',
        isCompleted &&
          'animate-[habit-check-pop_180ms_ease-out] border-[var(--habit-row-color,var(--habit-done))] bg-[var(--habit-done-bg)] text-[var(--habit-row-color,var(--habit-done))]',
        isMissed &&
          'border-[var(--habit-missed)] bg-[var(--habit-missed-bg)] text-[var(--danger-text)] shadow-[inset_0_0_0_1px_var(--habit-missed)]',
        isFuture && 'border-border bg-[var(--habit-future)] text-[var(--text-tertiary)]',
        canCheckIn &&
          'border-2 border-[var(--habit-today)] bg-surface text-body border-pulse hover:border-accent hover:bg-accent-soft focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-70',
      )}
      layout
      title={label}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      whileHover={canCheckIn ? { scale: 1.06 } : undefined}
      {...componentProps}
    >
      <Icon aria-hidden="true" size={isCompleted ? 14 : 13} strokeWidth={isCompleted ? 3 : 2.5} />
      <span className="sr-only">Day {day}</span>
    </Component>
  );
}
