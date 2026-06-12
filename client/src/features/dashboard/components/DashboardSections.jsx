import { Link } from 'react-router-dom';
import {
  AlarmClock,
  ArrowRight,
  BarChart3,
  CheckSquare,
  Clock,
  Flame,
  Play,
  RefreshCcwDot,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { DeferredScoreChart } from '../../../components/shared/DeferredScoreChart.jsx';
import {
  HABIT_RISK_HOUR,
  getWeeklyProgressText,
  isFocusOpportunity,
  pluralize,
} from '../dashboardUtils.js';
import { ActionRow, QuickAction } from './DashboardMissionComponents.jsx';

/** Builds the dashboard's dismissible attention alerts from real task and habit state. */
export function buildAlerts({
  atRiskHabits,
  dailyCount,
  dismissedAlerts,
  hour,
  overdueTasks,
  prepareFocus,
  todayKey,
}) {
  return [
    overdueTasks.length > 0 && createOverdueAlert(overdueTasks),
    hour >= HABIT_RISK_HOUR && atRiskHabits.length > 0 && createHabitAlert(atRiskHabits),
    isFocusOpportunity(hour, dailyCount) && createFocusAlert(prepareFocus),
  ]
    .filter(Boolean)
    .filter((alert) => dismissedAlerts[alert.id] !== todayKey)
    .slice(0, 2);
}

/** Renders the dashboard next-action block. */
export function NextActions({ mostAtRiskHabit, mostUrgentTask, weeklyDays }) {
  return (
    <DashboardCard title="Next actions">
      <div className="grid gap-3">
        <ActionRow
          action={mostUrgentTask ? 'Go to task' : 'Add task'}
          detail={mostUrgentTask ? formatTaskDetail(mostUrgentTask) : 'Create one visible next action.'}
          icon={CheckSquare}
          title={mostUrgentTask?.title || 'Add your first task'}
          to="/tasks"
        />
        <ActionRow
          action={mostAtRiskHabit ? 'Check in' : 'Add habit'}
          detail={
            mostAtRiskHabit
              ? `${mostAtRiskHabit.currentStreak || 0}-day streak - check in today`
              : 'Track a repeatable daily behavior.'
          }
          icon={RefreshCcwDot}
          title={mostAtRiskHabit?.name || 'Add a habit to track'}
          to="/habits"
        />
        <ActionRow
          action="View analytics"
          detail={getWeeklyProgressText(weeklyDays)}
          icon={BarChart3}
          title="Weekly progress"
          to="/analytics"
        />
      </div>
    </DashboardCard>
  );
}

/** Renders the dashboard quick-action block. */
export function QuickActions({ onStartFocus }) {
  return (
    <DashboardCard title="Quick actions">
      <div className="grid gap-3">
        <QuickAction icon={CheckSquare} label="Review tasks" to="/tasks" />
        <QuickAction icon={RefreshCcwDot} label="Open habits" to="/habits" />
        <QuickAction icon={BarChart3} label="View analytics" to="/analytics" />
        <Button className="justify-between" onClick={onStartFocus} variant="secondary">
          <span className="inline-flex items-center gap-2">
            <Clock aria-hidden="true" size={17} />
            Start focus
          </span>
          <ArrowRight aria-hidden="true" size={16} />
        </Button>
      </div>
    </DashboardCard>
  );
}

/** Renders the dashboard weekly productivity chart block. */
export function WeeklyScoreCard({ chartData, weeklyQuery }) {
  const hasWeeklySignal = chartData.some((day) => day.score !== null && day.score !== undefined);

  return (
    <DashboardCard title="Weekly score">
      {weeklyQuery.isLoading ? (
        <div className="grid min-h-64 place-items-center rounded-card border border-dashed border-border bg-surface-elevated/60 p-6 text-center text-sm font-semibold text-muted">
          Loading weekly score...
        </div>
      ) : weeklyQuery.isError ? (
        <EmptyState
          className="min-h-64 border border-dashed border-border bg-surface-elevated/70"
          description="Weekly score is unavailable right now."
          framed={false}
          icon={BarChart3}
          title="Weekly score unavailable"
        />
      ) : !hasWeeklySignal ? (
        <EmptyState
          className="min-h-64 border-dashed bg-surface-elevated/70 shadow-none"
          description="Score trends unlock after tasks, habits, or focus sessions create a daily signal."
          framed={false}
          icon={BarChart3}
          title="No score signal yet"
        />
      ) : (
        <DeferredScoreChart
          data={chartData}
          emptyTitle="Weekly score is not available yet"
          valueLabel="Productivity score"
        />
      )}
    </DashboardCard>
  );
}

function createOverdueAlert(overdueTasks) {
  return {
    action: <AlertLink label="Open tasks" to="/tasks" variant="danger" />,
    detail: overdueTasks.slice(0, 3).map((task) => task.title).join(', '),
    icon: AlarmClock,
    id: 'overdue',
    title: `${pluralize(overdueTasks.length, 'task')} overdue`,
    variant: 'danger',
  };
}

function createHabitAlert(atRiskHabits) {
  const extraCount = atRiskHabits.length - 3;

  return {
    action: <AlertLink label="Check in now" to="/habits" variant="secondary" />,
    detail: `${atRiskHabits.slice(0, 3).map((habit) => habit.name).join(', ')}${extraCount > 0 ? ` + ${extraCount} more` : ''}`,
    icon: Flame,
    id: 'habits',
    title: `Streak at risk - ${pluralize(atRiskHabits.length, 'habit')} unchecked`,
    variant: 'warning',
  };
}

function createFocusAlert(prepareFocus) {
  return {
    action: (
      <Button onClick={prepareFocus} size="sm" variant="primary">
        Start focus
        <ArrowRight aria-hidden="true" size={15} />
      </Button>
    ),
    detail: 'Block 25 minutes while your attention window is open.',
    icon: Play,
    id: 'focus',
    title: 'No focus session yet today',
    variant: 'primary',
  };
}

function AlertLink({ label, to, variant }) {
  return (
    <Button as={Link} size="sm" to={to} variant={variant}>
      {label}
      <ArrowRight aria-hidden="true" size={15} />
    </Button>
  );
}

function formatTaskDetail(task) {
  return `${task.dueDate ? new Date(task.dueDate).toLocaleString() : task.priority} - ${task.priority}`;
}
