import { useState } from 'react';
import {
  Activity,
  CheckSquare,
  Clock,
  Flame,
} from 'lucide-react';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { StatCard } from '../../../components/shared/StatCard.jsx';
import { mapWeeklyAnalyticsToChartData } from '../../analytics/analyticsApi.js';
import { useWeeklyAnalytics } from '../../analytics/useWeeklyAnalytics.js';
import { useAuth } from '../../auth/useAuth.js';
import { useHabits } from '../../habits/useHabits.js';
import { PomodoroTimer } from '../../pomodoro/components/PomodoroTimer.jsx';
import { usePomodoro } from '../../pomodoro/usePomodoro.js';
import { useTasks } from '../../tasks/useTasks.js';
import {
  SummaryLine,
  UrgentAlert,
  WeekCalendar,
} from '../components/DashboardMissionComponents.jsx';
import { DashboardHero } from '../components/DashboardHero.jsx';
import {
  NextActions,
  QuickActions,
  WeeklyScoreCard,
  buildAlerts,
} from '../components/DashboardSections.jsx';
import { getDashboardErrorMessage } from '../dashboardApi.js';
import {
  DASHBOARD_QUERY_LIMIT,
  buildWeekDays,
  formatScore,
  getAtRiskHabits,
  getMostUrgentTask,
  getOverdueTasks,
  getScoreTone,
  getTodayKey,
  readDismissedAlerts,
  writeDismissedAlerts,
} from '../dashboardUtils.js';
import { useDashboardSummary } from '../useDashboardSummary.js';

/** Renders the data-driven PersonalOS mission-control dashboard. */
export default function DashboardPage() {
  const { user } = useAuth();
  const {
    dailyCount,
    prepareFocus,
    settings,
    status: pomodoroStatus,
  } = usePomodoro();
  const summaryQuery = useDashboardSummary();
  const summary = summaryQuery.data;
  const weeklyQuery = useWeeklyAnalytics({ enabled: Boolean(summary) });
  const tasksQuery = useTasks({ limit: DASHBOARD_QUERY_LIMIT, offset: 0 });
  const habitsQuery = useHabits({ limit: DASHBOARD_QUERY_LIMIT, offset: 0 });
  const [dismissedAlerts, setDismissedAlerts] = useState(readDismissedAlerts);
  const tasks = tasksQuery.data?.tasks || [];
  const habits = habitsQuery.data?.habits || [];
  const weeklyDays = weeklyQuery.data?.days || [];
  const overdueTasks = getOverdueTasks(tasks);
  const atRiskHabits = getAtRiskHabits(habits);
  const todayKey = getTodayKey();
  const hour = new Date().getHours();

  if (summaryQuery.isLoading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (summaryQuery.isError) {
    return (
      <ErrorState
        message={getDashboardErrorMessage(summaryQuery.error)}
        onRetry={summaryQuery.refetch}
        title="Could not load dashboard"
      />
    );
  }

  if (!summary) {
    return null;
  }

  const alerts = buildAlerts({
    atRiskHabits,
    dailyCount,
    dismissedAlerts,
    hour,
    overdueTasks,
    prepareFocus,
    todayKey,
  });
  const mostUrgentTask = getMostUrgentTask(tasks);
  const mostAtRiskHabit = atRiskHabits[0] || habits[0];
  const weeklyChartData = mapWeeklyAnalyticsToChartData(weeklyDays);
  const weekCalendarDays = buildWeekDays(habits);

  function dismissAlert(alertId) {
    const nextDismissed = { ...dismissedAlerts, [alertId]: todayKey };
    setDismissedAlerts(nextDismissed);
    writeDismissedAlerts(nextDismissed);
  }

  return (
    <section className="grid gap-4">
      <DashboardHero
        dailyFocusCount={dailyCount}
        focusSettings={settings}
        habits={habits}
        onStartFocus={prepareFocus}
        pomodoroStatus={pomodoroStatus}
        summary={summary}
        tasks={tasks}
        user={user}
      />

      {alerts.length > 0 ? (
        <div className="grid gap-3">
          {alerts.map((alert) => (
            <UrgentAlert alert={alert} key={alert.id} onDismiss={dismissAlert} />
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper={`${summary.tasks.completed} completed - ${summary.tasks.incomplete} remaining`}
          icon={CheckSquare}
          label="Tasks today"
          value={summary.tasks.total}
        />
        <StatCard
          helper={summary.currentStreak === 0 ? 'Start your streak' : 'Current active run'}
          icon={Flame}
          label="Habit streak"
          tone={summary.currentStreak >= 7 ? 'success' : summary.currentStreak === 0 ? 'danger' : 'warning'}
          value={`${summary.currentStreak}d`}
        />
        <StatCard
          helper={summary.productivityScore === null ? 'No activity tracked today' : 'Today productivity'}
          icon={Activity}
          label="Score"
          tone={getScoreTone(summary.productivityScore)}
          value={formatScore(summary.productivityScore)}
        />
        <StatCard
          helper={`~${dailyCount * settings.focusDuration} min deep work`}
          icon={Clock}
          label="Focus today"
          value={`${dailyCount} sessions`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <NextActions
          mostAtRiskHabit={mostAtRiskHabit}
          mostUrgentTask={mostUrgentTask}
          weeklyDays={weeklyDays}
        />
        <QuickActions onStartFocus={prepareFocus} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <WeeklyScoreCard chartData={weeklyChartData} weeklyQuery={weeklyQuery} />
        <DashboardCard title="This week">
          <WeekCalendar days={weekCalendarDays} />
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr]">
        <PomodoroTimer />
        <DashboardCard title="Today summary">
          <div className="grid gap-3">
            <SummaryLine label="Tasks" value={`${summary.tasks.completed}/${summary.tasks.total} due-today complete`} />
            <SummaryLine label="Habits" value={`${summary.habits.completedToday}/${summary.habits.total} checked in`} />
            <SummaryLine label="Focus" value={`${dailyCount} sessions logged today`} />
          </div>
        </DashboardCard>
      </div>
    </section>
  );
}
