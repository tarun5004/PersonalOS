import { useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Pencil, Trash2 } from 'lucide-react';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { DEFAULT_HABIT_COLOR } from '../habitConstants.js';
import { getCurrentUtcDateKey, getDaysForMonth } from '../habitFormUtils.js';
import { HabitCheckCell } from './HabitCheckCell.jsx';

function getStreakClassName(streak) {
  if (streak >= 30) {
    return 'font-bold text-danger';
  }

  if (streak >= 7) {
    return 'font-bold text-warning';
  }

  if (streak >= 1) {
    return 'text-muted';
  }

  return 'text-[var(--text-tertiary)]';
}

export function HabitGrid({
  habits,
  isMutating,
  month,
  onCheckInHabit,
  onDeleteHabit,
  onEditHabit,
}) {
  const [rowsParent] = useAutoAnimate({ duration: 180, easing: 'ease-out' });
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const days = getDaysForMonth(month.key, month.totalDays);
  const todayKey = getCurrentUtcDateKey();
  const gridTemplateColumns = `minmax(220px, 260px) repeat(${days.length}, 28px) 72px 72px 80px`;
  const selectedHabit = habits.find((habit) => habit._id === selectedHabitId);

  useEffect(() => {
    setSelectedHabitId((currentId) =>
      habits.some((habit) => habit._id === currentId) ? currentId : null,
    );
  }, [habits]);

  function handleHabitSelect(habitId) {
    setSelectedHabitId(habitId);
  }

  function handleHabitKeyDown(event) {
    if (event.key === 'Escape') {
      setSelectedHabitId(null);
    }
  }

  return (
    <DashboardCard
      action={<Badge variant="success">UTC days</Badge>}
      className="overflow-hidden bg-surface"
      title="Monthly habit tracker"
    >
      <div className="mb-3 rounded-card border border-border bg-surface-elevated p-3">
        {selectedHabit ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.05em] text-muted">
                Selected habit
              </p>
              <p className="mt-1 truncate text-sm font-bold text-body">{selectedHabit.name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={isMutating}
                onClick={() => onEditHabit(selectedHabit)}
                size="sm"
                variant="secondary"
              >
                <Pencil aria-hidden="true" size={15} />
                Edit
              </Button>
              <Button
                disabled={isMutating}
                onClick={() => onDeleteHabit(selectedHabit)}
                size="sm"
                variant="danger"
              >
                <Trash2 aria-hidden="true" size={15} />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <p className="m-0 text-sm font-semibold text-muted">
            Select a habit name to reveal edit and delete actions.
          </p>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-max gap-2" ref={rowsParent}>
          <div className="grid gap-2" style={{ gridTemplateColumns }}>
            <span className="border-b border-border pb-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-muted">
              Habit
            </span>
            {days.map(({ day, dateKey }) => (
              <span
                className="border-b border-border pb-3 text-center text-xs font-semibold text-muted"
                key={dateKey}
              >
                {day}
              </span>
            ))}
            <span className="border-b border-border pb-3 text-center text-xs font-semibold uppercase tracking-[0.05em] text-muted">
              Streak
            </span>
            <span
              className="border-b border-border pb-3 text-center text-xs font-semibold uppercase tracking-[0.05em] text-muted"
            >
              Month
            </span>
            <span className="border-b border-border pb-3 text-right text-xs font-semibold uppercase tracking-[0.05em] text-muted">
              Actions
            </span>
          </div>

          <AnimatePresence initial={false}>
            {habits.map((habit) => {
              const completedDates = new Set(habit.completedDates || []);
              const streak = habit.currentStreak || 0;
              const habitColor = habit.color || DEFAULT_HABIT_COLOR;
              const isSelected = selectedHabitId === habit._id;

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  aria-expanded={isSelected}
                  aria-label={`${habit.name} habit row. ${isSelected ? 'Actions visible' : 'Select to show edit and delete actions'}`}
                  className="group grid gap-2 rounded-card transition hover:bg-surface-elevated focus-within:bg-surface-elevated"
                  exit={{ opacity: 0, y: 8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={habit._id}
                  layout
                  onKeyDown={handleHabitKeyDown}
                  role="group"
                  style={{
                    '--habit-row-color': habitColor,
                    gridTemplateColumns,
                  }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <button
                    aria-controls={`habit-actions-${habit._id}`}
                    aria-expanded={isSelected}
                    className="min-w-0 rounded-l-card px-3 py-2 text-left transition hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus"
                    onClick={() => handleHabitSelect(habit._id)}
                    onPointerDown={() => handleHabitSelect(habit._id)}
                    type="button"
                  >
                    <p className="m-0 truncate text-sm font-semibold text-body">{habit.name}</p>
                    {habit.description ? (
                      <p className="m-0 mt-0.5 truncate text-xs text-muted">
                        {habit.description}
                      </p>
                    ) : null}
                    <span className="sr-only">
                      {isSelected ? 'Hide habit actions' : 'Show habit actions'}
                    </span>
                  </button>
                  {days.map(({ day, dateKey }) => (
                    <span className="py-2" key={`${habit._id}-${dateKey}`}>
                      <HabitCheckCell
                        dateKey={dateKey}
                        day={day}
                        disabled={isMutating}
                        habitName={habit.name}
                        isCompleted={completedDates.has(dateKey)}
                        isFuture={dateKey > todayKey}
                        isToday={dateKey === todayKey}
                        onCheckIn={() => onCheckInHabit(habit)}
                      />
                    </span>
                  ))}
                  <span
                    className={`flex items-center justify-center gap-1 px-2 py-2 text-center text-sm ${getStreakClassName(streak)}`}
                  >
                    {streak > 0 ? (
                      <Flame
                        aria-hidden="true"
                        className="text-[var(--habit-row-color)]"
                        size={14}
                      />
                    ) : null}
                    {streak}
                  </span>
                  <span className="px-2 py-2 text-center text-sm font-semibold text-accent">
                    {Math.round(habit.completionPercentage)}%
                  </span>
                  <span
                    className="flex justify-end gap-1 rounded-r-card px-2 py-2"
                    id={`habit-actions-${habit._id}`}
                  >
                    {isSelected ? (
                      <>
                        <button
                          aria-label={`Edit ${habit.name}`}
                          className="grid size-8 place-items-center rounded-card text-muted transition hover:bg-accent-soft hover:text-body focus-visible:outline-none focus-visible:shadow-focus"
                          disabled={isMutating}
                          onClick={() => onEditHabit(habit)}
                          type="button"
                        >
                          <Pencil aria-hidden="true" size={15} />
                        </button>
                        <button
                          aria-label={`Delete ${habit.name}`}
                          className="grid size-8 place-items-center rounded-card text-muted transition hover:bg-[var(--danger-subtle)] hover:text-danger focus-visible:outline-none focus-visible:shadow-focus"
                          disabled={isMutating}
                          onClick={() => onDeleteHabit(habit)}
                          type="button"
                        >
                          <Trash2 aria-hidden="true" size={15} />
                        </button>
                      </>
                    ) : (
                      <span className="self-center text-xs font-semibold text-muted">Select</span>
                    )}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </DashboardCard>
  );
}
