import { CalendarClock, CircleDot, ListTodo, Plus, TimerReset } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { TaskCard } from '../../../components/shared/TaskCard.jsx';

const filters = ['All', 'Todo', 'In Progress', 'Completed'];

const columns = [
  {
    title: 'Todo',
    icon: ListTodo,
    helper: 'Fresh work lands here.',
    tasks: [
      {
        title: 'Create your first task',
        due: 'No due date',
        progress: 0,
        tag: 'Normal',
        status: 'todo',
      },
    ],
  },
  {
    title: 'In Progress',
    icon: TimerReset,
    helper: 'Active work stays visible.',
    tasks: [],
  },
  {
    title: 'Completed',
    icon: CircleDot,
    helper: 'Done work closes the loop.',
    tasks: [],
  },
];

export default function TasksPage() {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <Badge>Tasks</Badge>
          <h1 className="mt-3 text-[clamp(1.65rem,3vw,2.35rem)] font-bold leading-tight text-body">
            Personal task list
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            A quiet task board with clear status lanes and room for priority, due dates, and progress.
          </p>
        </div>
        <Button disabled title="Task creation is not available yet">
          <Plus aria-hidden="true" size={18} />
          Add task
        </Button>
      </div>

      <DashboardCard className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter, index) => (
            <button
              className={index === 0
                ? 'min-h-10 rounded-ui bg-primary px-4 text-sm font-semibold text-primary-text shadow-card'
                : 'min-h-10 rounded-ui border border-border bg-surface px-4 text-sm font-semibold text-muted transition hover:border-focus hover:bg-primary-soft hover:text-body'}
              key={filter}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </DashboardCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <DashboardCard
            className="min-h-[380px] bg-surface"
            key={column.title}
            title={column.title}
            action={<Badge variant="muted">{column.tasks.length}</Badge>}
          >
            <div className="mb-4 flex items-center gap-3 rounded-ui border border-border bg-surface p-3">
              <span className="grid size-10 place-items-center rounded-ui bg-primary-soft text-primary-strong">
                <column.icon aria-hidden="true" size={18} />
              </span>
              <p className="m-0 text-sm text-muted">{column.helper}</p>
            </div>

            {column.tasks.length > 0 ? (
              <div className="grid gap-3">
                {column.tasks.map((task) => (
                  <TaskCard key={task.title} {...task} />
                ))}
              </div>
            ) : (
              <EmptyState
                className="min-h-52 border border-dashed border-border bg-surface-muted/65"
                description="Tasks will settle here as their status changes."
                framed={false}
                icon={CalendarClock}
                title={`No ${column.title.toLowerCase()} tasks`}
              />
            )}
          </DashboardCard>
        ))}
      </div>
    </section>
  );
}
