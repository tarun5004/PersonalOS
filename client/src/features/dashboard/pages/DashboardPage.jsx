import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  RefreshCcwDot,
  Sparkles,
  Target,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { CalendarSummaryCard } from '../../../components/shared/CalendarSummaryCard.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { NotificationCard } from '../../../components/shared/NotificationCard.jsx';
import { ScoreChart } from '../../../components/shared/ScoreChart.jsx';
import { StatCard } from '../../../components/shared/StatCard.jsx';
import { TaskCard } from '../../../components/shared/TaskCard.jsx';
import { useAuth } from '../../auth/useAuth.js';

const quickActions = [
  { label: 'Review tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Open habits', to: '/habits', icon: RefreshCcwDot },
  { label: 'View analytics', to: '/analytics', icon: BarChart3 },
];

const previewTasks = [
  {
    title: 'Plan the first focused task',
    due: 'Ready for task setup',
    progress: 0,
    tag: 'Todo',
    status: 'todo',
  },
  {
    title: 'Choose habits to track',
    due: 'Ready for habit setup',
    progress: 0,
    tag: 'Habit',
    status: 'todo',
  },
];

function getFirstName(name) {
  return name?.split(' ')[0] || 'there';
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <div className="grid content-between gap-6 rounded-ui bg-[linear-gradient(135deg,var(--color-card-soft),var(--color-canvas))] p-6 shadow-card sm:p-7">
          <div>
            <Badge>Dashboard</Badge>
            <h1 className="mt-4 max-w-2xl text-[clamp(2.35rem,4vw,3.8rem)] font-extrabold leading-[1.04] tracking-normal text-body">
              Hi, {getFirstName(user?.name)}! What are your plans for today?
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted">
              A calm workspace for tasks, habits, weekly rhythm, and quick review.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                className="group flex min-h-20 items-center justify-between gap-3 rounded-ui border border-border bg-surface p-4 text-sm font-extrabold text-body shadow-card transition hover:-translate-y-0.5 hover:border-focus"
                key={action.to}
                to={action.to}
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-ui bg-primary-soft text-primary-strong">
                    <action.icon aria-hidden="true" size={18} />
                  </span>
                  {action.label}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="text-muted transition group-hover:translate-x-0.5 group-hover:text-body"
                  size={17}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard helper="Nothing due yet" icon={CheckSquare} label="Tasks today" value="0" />
          <StatCard helper="No weekly tasks yet" icon={CalendarDays} label="This week" value="0" />
          <StatCard helper="Start from Habits" icon={RefreshCcwDot} label="Habit streak" tone="success" value="0d" />
          <StatCard helper="Build activity first" icon={Sparkles} label="Score" tone="warning" value="--" />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_0.95fr_1.1fr]">
        <DashboardCard
          action={<Badge variant="muted">Calm</Badge>}
          className="bg-[linear-gradient(180deg,var(--color-canvas),var(--color-card-soft))]"
          title="Notifications"
        >
          <div className="grid gap-3">
            <NotificationCard
              badge="Ready"
              detail="Your dashboard shell is ready for connected task and habit data."
              title="Workspace prepared"
            />
            <NotificationCard
              badge="Next"
              detail="Task and habit activity will appear as your workspace fills in."
              title="Activity area ready"
            />
          </div>
        </DashboardCard>

        <DashboardCard title="Quick actions">
          <div className="grid gap-3">
            {quickActions.map((action) => (
              <Button as={Link} className="justify-between" key={action.to} to={action.to} variant="secondary">
                <span className="inline-flex items-center gap-2">
                  <action.icon aria-hidden="true" size={17} />
                  {action.label}
                </span>
                <ArrowRight aria-hidden="true" size={16} />
              </Button>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="This week">
          <CalendarSummaryCard />
        </DashboardCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard title="Upcoming tasks">
          <div className="grid gap-3">
            {previewTasks.map((task) => (
              <TaskCard key={task.title} {...task} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Habit summary">
          <div className="grid gap-4">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, index) => (
                <span
                  className="grid aspect-square place-items-center rounded-ui border border-border bg-surface-muted text-xs font-extrabold text-muted"
                  key={index}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <EmptyState
              className="min-h-32 border-dashed bg-surface-muted/70 p-5 shadow-none"
              description="Daily check-ins will appear once habits are connected."
              icon={Target}
              title="No habit activity yet"
            />
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardCard title="Recent tasks">
          <EmptyState
            className="min-h-56 border-dashed bg-surface-muted/70 shadow-none"
            description="Completed and recently updated tasks will collect here."
            icon={ClipboardList}
            title="No recent task movement"
          />
        </DashboardCard>

        <DashboardCard title="Weekly score">
          <ScoreChart emptyTitle="No weekly score yet" />
        </DashboardCard>
      </div>
    </section>
  );
}
