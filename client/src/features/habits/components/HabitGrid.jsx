import { Badge } from '../../../components/ui/Badge.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { getCurrentUtcDateKey, getDaysForMonth } from '../habitFormUtils.js';
import { HabitCheckCell } from './HabitCheckCell.jsx';

export function HabitGrid({ habits, month }) {
  const days = getDaysForMonth(month.key, month.totalDays);
  const todayKey = getCurrentUtcDateKey();

  return (
    <DashboardCard
      action={<Badge variant="success">UTC days</Badge>}
      className="overflow-hidden bg-surface"
      title="Monthly habit tracker"
    >
      <div className="overflow-x-auto pb-2">
        <div
          className="grid min-w-max gap-2"
          style={{
            gridTemplateColumns: `180px repeat(${days.length}, 28px) 72px 72px`,
          }}
        >
          <span className="border-b border-border pb-3 text-left text-xs font-semibold text-muted">
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
          <span className="border-b border-border pb-3 text-center text-xs font-semibold text-muted">
            Streak
          </span>
          <span className="border-b border-border pb-3 text-center text-xs font-semibold text-muted">
            Rate
          </span>

          {habits.map((habit) => {
            const completedDates = new Set(habit.completedDates || []);

            return (
              <div className="contents" key={habit._id}>
                <span className="truncate rounded-l-ui bg-surface/80 px-2 py-2 text-sm font-bold text-body">
                  {habit.name}
                </span>
                {days.map(({ day, dateKey }) => (
                  <span className="bg-surface/80 py-2" key={`${habit._id}-${dateKey}`}>
                    <HabitCheckCell
                      dateKey={dateKey}
                      day={day}
                      isCompleted={completedDates.has(dateKey)}
                      isFuture={dateKey > todayKey}
                      isToday={dateKey === todayKey}
                    />
                  </span>
                ))}
                <span className="bg-surface/80 px-2 py-2 text-center text-sm font-bold text-body">
                  {habit.currentStreak}d
                </span>
                <span className="rounded-r-ui bg-surface/80 px-2 py-2 text-center text-sm font-bold text-accent-strong">
                  {Math.round(habit.completionPercentage)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
}
