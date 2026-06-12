import { Activity, BarChart3, CheckCircle2, RefreshCcwDot } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { DeferredScoreChart } from '../../../components/shared/DeferredScoreChart.jsx';
import { NotificationCard } from '../../../components/shared/NotificationCard.jsx';
import { StatCard } from '../../../components/shared/StatCard.jsx';
import {
  averageAnalyticsValue,
  getAnalyticsErrorMessage,
  getLatestAnalyticsDay,
  mapWeeklyAnalyticsToChartData,
} from '../analyticsApi.js';
import { useWeeklyAnalytics } from '../useWeeklyAnalytics.js';

function formatPercent(value) {
  return value === null || value === undefined ? '--' : `${Math.round(value)}%`;
}

function getScoredDays(days) {
  return days.filter((day) => day.productivityScore !== null);
}

export default function AnalyticsPage() {
  const weeklyQuery = useWeeklyAnalytics();
  const days = weeklyQuery.data?.days || [];
  const scoredDays = getScoredDays(days);
  const latestDay = getLatestAnalyticsDay(days);
  const hasActivity = scoredDays.length > 0;
  const taskAverage = hasActivity ? averageAnalyticsValue(days, 'taskCompletionRate') : null;
  const habitAverage = hasActivity ? averageAnalyticsValue(days, 'habitCompletionRate') : null;
  const latestScore = latestDay?.productivityScore ?? null;
  const scoreChartData = mapWeeklyAnalyticsToChartData(days);
  const taskChartData = mapWeeklyAnalyticsToChartData(days, 'taskCompletionRate');
  const habitChartData = mapWeeklyAnalyticsToChartData(days, 'habitCompletionRate');
  const visibleScoreChartData = hasActivity ? scoreChartData : [];
  const visibleTaskChartData = hasActivity ? taskChartData : [];
  const visibleHabitChartData = hasActivity ? habitChartData : [];

  return (
    <section className="grid gap-4">
      <div>
        <Badge>Analytics</Badge>
        <h1 className="mt-3 text-[clamp(1.65rem,3vw,2.35rem)] font-bold leading-tight text-body">
          Weekly productivity trends
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          A focused analytics view for task completion, habit consistency, and weekly score trends.
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

      {!weeklyQuery.isLoading && !weeklyQuery.isError && !hasActivity ? (
        <EmptyState
          className="border border-dashed border-border bg-surface-muted/70"
          description="Create due-dated tasks or check in habits to turn the weekly analytics view on."
          icon={BarChart3}
          title="No weekly activity yet"
        />
      ) : null}

      {!weeklyQuery.isLoading && !weeklyQuery.isError ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              helper={hasActivity ? '7-day task signal' : 'No task activity this week'}
              icon={CheckCircle2}
              label="Task completion"
              value={formatPercent(taskAverage)}
            />
            <StatCard
              helper={hasActivity ? '7-day habit signal' : 'No habit check-ins this week'}
              icon={RefreshCcwDot}
              label="Habit consistency"
              tone="success"
              value={formatPercent(habitAverage)}
            />
            <StatCard
              helper={latestScore === null ? 'No scored activity today' : 'Today productivity score'}
              icon={Activity}
              label="Productivity score"
              tone="warning"
              value={formatPercent(latestScore)}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <DashboardCard
              action={
                <Badge variant={hasActivity ? 'success' : 'muted'}>
                  {scoredDays.length}/7 days
                </Badge>
              }
              title="Score trend"
            >
              <DeferredScoreChart
                data={visibleScoreChartData}
                emptyTitle="No weekly score yet"
                valueLabel="Productivity score"
              />
              <p className="mt-3 text-xs leading-5 text-muted">
                Gaps mark UTC days with no task or habit activity. They are not treated as 0%.
              </p>
            </DashboardCard>

            <DashboardCard title="Recent activity">
              {hasActivity ? (
                <div className="grid gap-3">
                  {scoredDays
                    .slice(-4)
                    .reverse()
                    .map((day) => (
                      <NotificationCard
                        badge={formatPercent(day.productivityScore)}
                        detail={`Tasks ${formatPercent(day.taskCompletionRate)} · Habits ${formatPercent(day.habitCompletionRate)}`}
                        key={day.date}
                        title={day.label || day.date}
                      />
                    ))}
                </div>
              ) : (
                <EmptyState
                  className="min-h-56 border border-dashed border-border bg-surface-muted/70"
                  description="Task completions and habit check-ins will appear here as activity is tracked."
                  framed={false}
                  icon={BarChart3}
                  title="No activity recorded"
                />
              )}
            </DashboardCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <DashboardCard title="Tasks completed per day">
              <DeferredScoreChart
                data={visibleTaskChartData}
                emptyTitle="No task trend yet"
                valueLabel="Task completion"
              />
            </DashboardCard>
            <DashboardCard title="Habit check-ins per day">
              <DeferredScoreChart
                data={visibleHabitChartData}
                emptyTitle="No habit trend yet"
                valueLabel="Habit consistency"
              />
            </DashboardCard>
          </div>
        </>
      ) : null}
    </section>
  );
}
