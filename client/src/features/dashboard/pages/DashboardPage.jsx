import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Gauge,
  RefreshCcwDot,
  Target,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { CalendarSummaryCard } from '../../../components/shared/CalendarSummaryCard.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { DeferredScoreChart } from '../../../components/shared/DeferredScoreChart.jsx';
import { NotificationCard } from '../../../components/shared/NotificationCard.jsx';
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

const focusItems = [
  {
    title: 'Create your first task',
    detail: 'Turn today into one visible next action.',
    action: 'Review tasks',
    to: '/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Add a habit to begin tracking',
    detail: 'Choose a daily rhythm before the week fills up.',
    action: 'Open habits',
    to: '/habits',
    icon: RefreshCcwDot,
  },
  {
    title: 'Check weekly progress',
    detail: 'Keep the signal visible without over-planning.',
    action: 'View analytics',
    to: '/analytics',
    icon: BarChart3,
  },
];

function getFirstName(name) {
  return name?.split(' ')[0] || 'there';
}

export default function DashboardPage() {
  const { user } = useAuth();

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
                  <span className="mt-0.5 block text-xs leading-5 text-muted">{item.detail}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary-strong">
                  {item.action}
                  <ArrowRight aria-hidden="true" className="transition group-hover:translate-x-0.5" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </DashboardCard>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
          <StatCard helper="Nothing due yet" icon={CheckSquare} label="Tasks today" value="0" />
          <StatCard helper="No weekly tasks yet" icon={CalendarDays} label="This week" value="0" />
          <StatCard helper="Start from Habits" icon={RefreshCcwDot} label="Habit streak" tone="success" value="0d" />
          <StatCard helper="Build activity first" icon={Gauge} label="Score" tone="warning" value="--" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr_1.1fr]">
        <DashboardCard
          action={<Badge variant="muted">Calm</Badge>}
          className="bg-surface"
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

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
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
                  className="grid aspect-square place-items-center rounded-ui border border-border bg-surface-muted text-xs font-semibold text-muted"
                  key={index}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <EmptyState
              className="min-h-32 border border-dashed border-border bg-surface-muted/70 p-5"
              description="Add a habit to begin tracking daily check-ins."
              framed={false}
              icon={Target}
              title="No habit activity yet"
            />
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardCard title="Recent tasks">
          <EmptyState
            className="min-h-48 border border-dashed border-border bg-surface-muted/70"
            description="Create your first task to make recent movement visible."
            framed={false}
            icon={ClipboardList}
            title="No recent task movement"
          />
        </DashboardCard>

        <DashboardCard title="Weekly score">
          <DeferredScoreChart emptyTitle="No weekly score yet" />
        </DashboardCard>
      </div>
    </section>
  );
}
