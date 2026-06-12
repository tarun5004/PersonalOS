import { Activity, BarChart3, CheckCircle2, RefreshCcwDot } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { StatCard } from '../../../components/shared/StatCard.jsx';
import { usePomodoro } from '../../pomodoro/usePomodoro.js';
import { getAnalyticsErrorMessage } from '../analyticsApi.js';
import {
  buildAnalyticsInsights,
  getScoredDays,
  getTrend,
  summarizeWeek,
} from '../analyticsUtils.js';
import {
  HabitConsistencyBars,
  ScoreTrendChart,
  TaskCompletionBars,
} from '../components/AnalyticsCharts.jsx';
import { InsightFeed } from '../components/InsightFeed.jsx';
import { WeekComparison } from '../components/WeekComparison.jsx';
import { useWeeklyAnalytics } from '../useWeeklyAnalytics.js';

function formatPercent(value) {
  return value === null || value === undefined ? '--' : `${Math.round(value)}%`;
}

function formatScore(value) {
  return value === null || value === undefined ? '--' : String(Math.round(value));
}

function formatTrendText(trend) {
  if (trend === null) {
    return 'No last-week baseline';
  }

  if (trend > 0) {
    return `Up ${trend}% vs last week`;
  }

  if (trend < 0) {
    return `Down ${Math.abs(trend)}% vs last week`;
  }

  return 'No change vs last week';
}

function formatCountRate(completed, total, rate, noun) {
  if (total === 0) {
    return `No ${noun} tracked`;
  }

  return `${completed} of ${total} ${noun} (${formatPercent(rate)})`;
}

export default function AnalyticsPage() {
  const weeklyQuery = useWeeklyAnalytics();
  const { totalSessionsToday } = usePomodoro();
  const days = weeklyQuery.data?.days || [];
  const previousDays = weeklyQuery.data?.previousDays || [];
  const habitInsights = weeklyQuery.data?.habitInsights || [];
  const currentSummary = summarizeWeek(days);
  const previousSummary = summarizeWeek(previousDays);
  const scoredDays = getScoredDays(days);
  const taskTrend = getTrend(currentSummary.taskRate, previousSummary.taskRate);
  const habitTrend = getTrend(currentSummary.habitRate, previousSummary.habitRate);
  const scoreTrend = getTrend(currentSummary.score, previousSummary.score);
  const insightState = buildAnalyticsInsights({
    days,
    focusSessions: totalSessionsToday,
    habitInsights,
    previousDays,
  });

  return (
    <section className="grid gap-4">
      <div>
        <Badge>Analytics</Badge>
        <h1 className="mt-3 text-[clamp(1.65rem,3vw,2.35rem)] font-bold leading-tight text-body">
          Weekly insight engine
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Plain-English signals from your task completion, habit consistency, and focus rhythm.
        </p>
      </div>

      {weeklyQuery.isLoading ? <LoadingState label="Loading analytics..." /> : null}

      {weeklyQuery.isError ? (
        <ErrorState
          message={getAnalyticsErrorMessage(weeklyQuery.error)}
          onRetry={weeklyQuery.refetch}
          title="Could not load analytics"
        />
      ) : null}

      {!weeklyQuery.isLoading && !weeklyQuery.isError ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              helper={formatCountRate(
                currentSummary.taskCompleted,
                currentSummary.taskTotal,
                currentSummary.taskRate,
                'tasks',
              )}
              icon={CheckCircle2}
              label="Task completion"
              value={formatPercent(currentSummary.taskRate)}
            />
            <StatCard
              helper={`${currentSummary.habitCompleted} of ${currentSummary.habitTotal} check-ins`}
              icon={RefreshCcwDot}
              label="Habit consistency"
              tone="success"
              value={formatPercent(currentSummary.habitRate)}
            />
            <StatCard
              helper={formatTrendText(scoreTrend)}
              icon={Activity}
              label="Productivity score"
              tone="warning"
              value={formatScore(currentSummary.score)}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <DashboardCard
              action={<Badge variant={scoredDays.length > 0 ? 'success' : 'muted'}>{scoredDays.length}/7 days</Badge>}
              title="Weekly snapshot"
            >
              <div className="grid gap-3">
                <p className="m-0 text-sm text-muted">{formatTrendText(taskTrend)}</p>
                <p className="m-0 text-sm text-muted">{formatTrendText(habitTrend)}</p>
                <p className="m-0 text-sm text-muted">
                  Score gaps mark days with no task or habit activity. They are not treated as zero.
                </p>
              </div>
            </DashboardCard>

            <DashboardCard title="Insight feed">
              <InsightFeed
                insights={insightState.insights}
                unlockProgress={insightState.unlockProgress}
              />
            </DashboardCard>
          </div>

          <DashboardCard title="Score trend">
            <ScoreTrendChart days={days} />
          </DashboardCard>

          <div className="grid gap-4 xl:grid-cols-2">
            <DashboardCard
              action={<Badge variant="muted">Completed</Badge>}
              title="Tasks per day"
            >
              <TaskCompletionBars days={days} />
            </DashboardCard>
            <DashboardCard
              action={<Badge variant="success">Consistency</Badge>}
              title="Habit consistency per day"
            >
              <HabitConsistencyBars days={days} />
            </DashboardCard>
          </div>

          <DashboardCard title="Week-over-week comparison">
            <WeekComparison habitTrend={habitTrend} taskTrend={taskTrend} />
          </DashboardCard>
        </>
      ) : null}
    </section>
  );
}
