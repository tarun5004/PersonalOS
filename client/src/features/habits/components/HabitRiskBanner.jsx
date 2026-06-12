import { useMemo, useState } from 'react';
import { AlarmClock, X } from 'lucide-react';
import { HABIT_STREAK_DISMISS_KEY } from '../habitConstants.js';
import { getLocalDateKey } from '../habitFormUtils.js';

function getDismissedDate() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.sessionStorage.getItem(HABIT_STREAK_DISMISS_KEY) || '';
}

export function HabitRiskBanner({ habits }) {
  const todayKey = getLocalDateKey();
  const [dismissedDate, setDismissedDate] = useState(getDismissedDate);
  const uncheckedHabits = useMemo(
    () => habits.filter((habit) => !habit.todayCompleted),
    [habits],
  );
  const hour = new Date().getHours();
  const isDismissed = dismissedDate === todayKey;

  if (hour < 18 || uncheckedHabits.length === 0 || isDismissed) {
    return null;
  }

  const visibleNames = uncheckedHabits.slice(0, 3).map((habit) => habit.name);
  const remainingCount = uncheckedHabits.length - visibleNames.length;
  const namesText = `${visibleNames.join(', ')}${remainingCount > 0 ? `, + ${remainingCount} more` : ''}`;

  function handleDismiss() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(HABIT_STREAK_DISMISS_KEY, todayKey);
    }

    setDismissedDate(todayKey);
  }

  return (
    <div className="rounded-card border border-warning/30 border-t-[3px] border-t-warning bg-[var(--warning-subtle)] p-4 text-[var(--warning-text)] shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-card bg-surface text-warning">
            <AlarmClock aria-hidden="true" size={18} />
          </span>
          <div>
            <h2 className="m-0 text-base font-semibold text-[var(--warning-text)]">
              {uncheckedHabits.length} habits not checked in today
            </h2>
            <p className="mt-1 text-sm text-[var(--warning-text)]">{namesText}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--warning-text)]">
              Your streak ends at midnight
            </p>
          </div>
        </div>
        <button
          aria-label="Dismiss streak warning"
          className="rounded-card p-2 text-[var(--warning-text)] transition hover:bg-surface focus-visible:outline-none focus-visible:shadow-focus"
          onClick={handleDismiss}
          type="button"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  );
}
