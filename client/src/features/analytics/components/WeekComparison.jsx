import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

function TrendValue({ value }) {
  if (value === null) {
    return (
      <span className="inline-flex items-center gap-1 text-muted">
        <ArrowRight aria-hidden="true" size={17} />
        No baseline
      </span>
    );
  }

  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-success">
        <ArrowUp aria-hidden="true" size={17} />
        +{value}%
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-danger">
        <ArrowDown aria-hidden="true" size={17} />
        {value}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-muted">
      <ArrowRight aria-hidden="true" size={17} />
      0%
    </span>
  );
}

export function WeekComparison({ habitTrend, taskTrend }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-card border border-border bg-surface p-4 shadow-card">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.05em] text-muted">
          Tasks: this week vs last
        </p>
        <p className="mt-3 text-2xl font-semibold">
          <TrendValue value={taskTrend} />
        </p>
        <p className="mt-1 text-sm text-muted">vs last week</p>
      </div>
      <div className="rounded-card border border-border bg-surface p-4 shadow-card">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.05em] text-muted">
          Habits: this week vs last
        </p>
        <p className="mt-3 text-2xl font-semibold">
          <TrendValue value={habitTrend} />
        </p>
        <p className="mt-1 text-sm text-muted">vs last week</p>
      </div>
    </div>
  );
}
