import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { getCurrentUtcDateKey, getDaysForMonth } from '../habitFormUtils.js';

function buildChartData(habits, month) {
  const todayKey = getCurrentUtcDateKey();
  const totalHabits = habits.length;

  return getDaysForMonth(month.key, month.totalDays).map(({ day, dateKey }) => {
    const checkedCount = habits.filter((habit) =>
      (habit.completedDates || []).includes(dateKey),
    ).length;
    const isFuture = dateKey > todayKey;
    const score =
      totalHabits === 0 || isFuture ? null : Math.round((checkedCount / totalHabits) * 100);

    return {
      day,
      checkedCount,
      dateKey,
      isToday: dateKey === todayKey,
      score,
      totalHabits,
    };
  });
}

function HabitChartTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;
  const scoreText = data.score === null ? 'No score yet' : `${data.score}% consistency`;

  return (
    <div className="rounded-card border border-border bg-surface px-3 py-2 shadow-card">
      <p className="m-0 text-sm font-semibold text-body">Day {data.day}</p>
      <p className="m-0 mt-1 text-sm text-muted">
        {scoreText} ({data.checkedCount} of {data.totalHabits} habits)
      </p>
    </div>
  );
}

function renderTodayDot(props) {
  const { cx, cy, payload } = props;

  if (!payload?.isToday || payload.score === null) {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      fill="var(--accent)"
      r={5}
      stroke="var(--bg-surface)"
      strokeWidth={2}
    />
  );
}

export function HabitConsistencyChart({ habits, month }) {
  const chartData = buildChartData(habits, month);

  return (
    <DashboardCard title="Daily habit consistency">
      <div className="h-72 min-w-[320px] w-full">
        <ResponsiveContainer height={288} minWidth={320} width="100%">
          <AreaChart data={chartData} margin={{ bottom: 0, left: -16, right: 8, top: 8 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="day"
              minTickGap={8}
              stroke="var(--text-tertiary)"
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke="var(--text-tertiary)"
              tickLine={false}
            />
            <Tooltip content={<HabitChartTooltip />} />
            <Area
              connectNulls={false}
              dataKey="score"
              dot={renderTodayDot}
              fill="var(--accent-subtle)"
              fillOpacity={0.35}
              stroke="var(--accent)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
