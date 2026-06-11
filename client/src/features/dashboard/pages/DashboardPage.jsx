import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckSquare,
  Gauge,
  RefreshCcwDot,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { DeferredScoreChart } from '../../../components/shared/DeferredScoreChart.jsx';
import { NotificationCard } from '../../../components/shared/NotificationCard.jsx';
import { StatCard } from '../../../components/shared/StatCard.jsx';
import { TaskCard } from '../../../components/shared/TaskCard.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { getDashboardErrorMessage } from '../dashboardApi.js';
import { useDashboardSummary } from '../useDashboardSummary.js';

const quickActions = [
  { label: 'Review tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Open habits', to: '/habits', icon: RefreshCcwDot },
  { label: 'View analytics', to: '/analytics', icon: BarChart3 },
];

function getFirstName(name) {
  return name?.split(' ')[0] || 'there';
}

function formatScore(score) {
  return score === null || score === undefined ? '--' : `${Math.round(score)}%`;
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getFocusItems(summary) {
  if (!summary) {
    return [];
  }

  const taskDetail =
    summary.tasks.total === 0
      ? 'Turn today into one visible next action.'
      : `${pluralize(summary.tasks.incomplete, 'task')} still open today.`;
  const habitDetail =
    summary.habits.total === 0
      ? 'Choose a daily rhythm before the day fills up.'
      : `${summary.habits.completedToday}/${summary.habits.total} habits checked in.`;
  const scoreDetail =
    summary.productivityScore === null
      ? 'Create activity before weekly analytics unlocks.'
      : `Today's signal is ${Math.round(summary.productivityScore)}%.`;

  return [
    {
      title: summary.tasks.total === 0 ? 'Create your first task' : 'Review today tasks',
      detail: taskDetail,
      action: 'Review tasks',
      to: '/tasks',
      icon: CheckSquare,
    },
    {
      title: summary.habits.total === 0 ? 'Add a habit to begin tracking' : 'Check habit rhythm',
      detail: habitDetail,
      action: 'Open habits',
      to: '/habits',
      icon: RefreshCcwDot,
    },
    {
      title: 'Check weekly progress',
      detail: scoreDetail,
      action: 'View analytics',
      to: '/analytics',
      icon: BarChart3,
    },
  ];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const summaryQuery = useDashboardSummary();
  const summary = summaryQuery.data;
  const focusItems = getFocusItems(summary);

  return (
    <section className="grid gap-4">
      <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-end">
        <div>
          <Badge>Life command center</Badge>
          <h1 className="mt-3 text-[clamp(1.65rem,3vw,2.35rem)] font-bold leading-tight text-body">
            What needs attention next?
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Hi, {getFirstName(user?.name)}. Tasks, habits, and weekly signals are organized for quick scanning.
          </p>
        </div>
        <Button as={Link} to="/tasks" variant="secondary">
          <CheckSquare aria-hidden="true" size={17} />
          Open task list
        </Button>
      </div>

      {summaryQuery.isLoading ? (
        <LoadingState label="Loading dashboard..." />
      ) : summaryQuery.isError ? (
        <ErrorState
          message={getDashboardErrorMessage(summaryQuery.error)}
          onRetry={summaryQuery.refetch}
          title="Could not load dashboard"
        />
      ) : null}

      {summary ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
              <StatCard
                helper={`${summary.tasks.completed} complete · ${summary.tasks.incomplete} open`}
                icon={CheckSquare}
                label="Tasks today"
                value={summary.tasks.total}
              />
              <StatCard
                helper={`${summary.habits.completedToday} checked in today`}
                icon={CalendarDays}
                label="Habits today"
                value={`${summary.habits.completedToday}/${summary.habits.total}`}
              />
              <StatCard
                helper={
                  summary.productivityScore === null
                    ? 'No activity tracked today'
                    : 'Today productivity'
                }
                icon={Gauge}
                label="Score"
                tone="warning"
                value={formatScore(summary.productivityScore)}
              />
              <StatCard
                helper="Best active habit run"
                icon={RefreshCcwDot}
                label="Habit streak"
                tone="success"
                value={`${summary.currentStreak}d`}
              />
            </div>

            <DashboardCard title="Weekly score">
              <DeferredScoreChart emptyTitle="Weekly score is not available yet" />
            </DashboardCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <DashboardCard title="Next actions" action={<Badge variant="muted">Start here</Badge>}>
              <div className="grid gap-3">
                {focusItems.map((item) => (
                  <Link
                    className="group grid gap-3 rounded-ui border border-border bg-surface px-4 py-3 transition hover:-translate-y-px hover:border-focus hover:bg-primary-soft sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                    key={item.title}
                    to={item.to}
                  >
                    <span className="grid size-10 place-items-center rounded-ui bg-primary-soft text-primary-strong">
                      <item.icon aria-hidden="true" size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-body">{item.title}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted">
                        {item.detail}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary-strong">
                      {item.action}
                      <ArrowRight
                        aria-hidden="true"
                        className="transition group-hover:translate-x-0.5"
                        size={15}
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </DashboardCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr]">
            <DashboardCard
              action={<Badge variant="muted">Today</Badge>}
              className="bg-surface"
              title="Daily signals"
            >
              <div className="grid gap-3">
                <NotificationCard
                  badge={`${summary.tasks.completionRate}%`}
                  detail={`${summary.tasks.completed} of ${summary.tasks.total} due-today tasks are complete.`}
                  title="Today task signal"
                />
                <NotificationCard
                  badge={`${summary.habits.completionRate}%`}
                  detail={`${summary.habits.completedToday} of ${summary.habits.total} habits checked in for the UTC day.`}
                  title="Habit rhythm"
                />
              </div>
            </DashboardCard>

            <DashboardCard title="Quick actions">
              <div className="grid gap-3">
                {quickActions.map((action) => (
                  <Button
                    as={Link}
                    className="justify-between"
                    key={action.to}
                    to={action.to}
                    variant="secondary"
                  >
                    <span className="inline-flex items-center gap-2">
                      <action.icon aria-hidden="true" size={17} />
                      {action.label}
                    </span>
                    <ArrowRight aria-hidden="true" size={16} />
                  </Button>
                ))}
              </div>
            </DashboardCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <DashboardCard title="Today's task status">
              {summary.tasks.total === 0 ? (
                <EmptyState
                  className="min-h-48 border border-dashed border-border bg-surface-muted/70"
                  description="Create a due-today task to make the dashboard actionable."
                  framed={false}
                  icon={CheckSquare}
                  title="No due-today tasks"
                />
              ) : (
                <TaskCard
                  due={`${summary.tasks.incomplete} still open`}
                  progress={summary.tasks.completionRate}
                  status={summary.tasks.incomplete === 0 ? 'done' : 'todo'}
                  tag={summary.tasks.incomplete === 0 ? 'Clear' : 'Today'}
                  title={`${summary.tasks.completed} of ${summary.tasks.total} tasks complete`}
                />
              )}
            </DashboardCard>

            <DashboardCard title="Habit summary">
              {summary.habits.total === 0 ? (
                <EmptyState
                  className="min-h-32 border border-dashed border-border bg-surface-muted/70 p-5"
                  description="Add a habit to begin tracking daily check-ins."
                  framed={false}
                  icon={RefreshCcwDot}
                  title="No habit activity yet"
                />
              ) : (
                <div className="rounded-ui border border-border bg-surface-muted/70 p-5">
                  <p className="m-0 text-sm font-bold text-body">
                    {summary.habits.completedToday}/{summary.habits.total} habits complete today
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Current active streak signal: {summary.currentStreak} days.
                  </p>
                </div>
              )}
            </DashboardCard>
          </div>
        </>
      ) : null}
    </section>
  );
}
