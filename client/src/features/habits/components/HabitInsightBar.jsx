import { BarChart3, CheckCircle2, Flame, Gauge } from 'lucide-react';
import { AnimatedNumber } from '../../../components/shared/AnimatedNumber.jsx';

function MetricTile({
  animatedValue,
  label,
  progress,
  subtext,
  suffix = '',
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-card border border-border bg-surface-elevated p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.05em] text-muted">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-body">
            {Number.isFinite(animatedValue) ? (
              <AnimatedNumber end={animatedValue} suffix={suffix} />
            ) : (
              value
            )}
          </p>
        </div>
        <span className="grid size-9 place-items-center rounded-card bg-accent-soft text-accent">
          <Icon aria-hidden="true" size={18} />
        </span>
      </div>
      {progress !== undefined ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg-surface-3)]">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
      <p className="mt-2 text-sm text-muted">{subtext}</p>
    </div>
  );
}

export function HabitInsightBar({ habits, summary }) {
  const totalHabits = habits.length;
  const todayProgress = totalHabits === 0 ? 0 : (summary.completedToday / totalHabits) * 100;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetricTile
        animatedValue={summary.completedToday}
        icon={CheckCircle2}
        label="Today's check-ins"
        progress={todayProgress}
        subtext="checked in today"
        suffix={` / ${totalHabits}`}
        value={`${summary.completedToday} / ${totalHabits}`}
      />
      <MetricTile
        animatedValue={summary.bestStreak}
        icon={Flame}
        label="Best streak"
        subtext="your best"
        suffix=" days"
        value={`${summary.bestStreak} days`}
      />
      <MetricTile
        animatedValue={summary.averageCompletion}
        icon={BarChart3}
        label="This month"
        progress={summary.averageCompletion}
        subtext="loaded monthly consistency"
        suffix="%"
        value={`${summary.averageCompletion}%`}
      />
      <MetricTile
        animatedValue={summary.averageCompletion}
        icon={Gauge}
        label="Overall consistency"
        progress={summary.averageCompletion}
        subtext="since tracking began"
        suffix="%"
        value={`${summary.averageCompletion}%`}
      />
    </div>
  );
}
