import { Coffee, Play, TimerReset } from 'lucide-react';
import { mergeClassNames } from '../../../lib/classNames.js';
import {
  POMODORO_LINKED_TASK_MAX_LENGTH,
  POMODORO_STATUS,
} from '../../../utils/constants.js';
import { usePomodoro } from '../usePomodoro.js';

function truncateTaskTitle(title) {
  if (!title || title.length <= POMODORO_LINKED_TASK_MAX_LENGTH) {
    return title;
  }

  return `${title.slice(0, POMODORO_LINKED_TASK_MAX_LENGTH - 3)}...`;
}

/** Shows the compact always-visible Pomodoro control in the app topbar. */
export function PomodoroWidget() {
  const {
    formattedTime,
    isRunning,
    linkedTaskTitle,
    prepareFocus,
    status,
  } = usePomodoro();
  const isFocus = status === POMODORO_STATUS.FOCUS;
  const isBreak =
    status === POMODORO_STATUS.SHORT_BREAK || status === POMODORO_STATUS.LONG_BREAK;
  const isIdle = status === POMODORO_STATUS.IDLE;
  const Icon = isBreak ? Coffee : isIdle ? Play : TimerReset;

  return (
    <button
      className={mergeClassNames(
        'inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border px-3 text-sm font-semibold transition hover:-translate-y-px focus-visible:outline-none focus-visible:shadow-focus',
        isFocus &&
          'border-transparent bg-[var(--pomo-focus-subtle)] text-[var(--pomo-focus)]',
        isBreak &&
          'border-transparent bg-[var(--pomo-break-subtle)] text-[var(--pomo-break)]',
        isIdle && 'border-border bg-surface text-accent hover:border-accent hover:bg-accent-soft',
      )}
      onClick={prepareFocus}
      type="button"
    >
      {isRunning ? (
        <span
          aria-hidden="true"
          className={mergeClassNames(
            'size-2.5 rounded-full',
            isFocus ? 'focus-pulse bg-[var(--pomo-focus)]' : 'bg-[var(--pomo-break)]',
          )}
        />
      ) : (
        <Icon aria-hidden="true" size={16} />
      )}
      <span>{isIdle ? 'Focus' : formattedTime}</span>
      {linkedTaskTitle && !isIdle ? (
        <span className="hidden max-w-28 truncate text-xs opacity-80 sm:inline">
          {truncateTaskTitle(linkedTaskTitle)}
        </span>
      ) : null}
    </button>
  );
}
