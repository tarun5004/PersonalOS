import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AnimatePresence } from 'framer-motion';
import { CalendarClock, CircleDot, ListTodo, TimerReset } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { TASK_STATUSES, TASK_VIEW_MODES } from '../taskConstants.js';
import { TaskCard } from './TaskCard.jsx';

const columnMeta = {
  Todo: {
    icon: ListTodo,
    helper: 'Fresh work lands here.',
  },
  'In Progress': {
    icon: TimerReset,
    helper: 'Active work stays visible.',
  },
  Completed: {
    icon: CircleDot,
    helper: 'Done work closes the loop.',
  },
};

export function TaskList({
  activeStatus,
  isMutating,
  onCompleteTask,
  onCycleStatus,
  onDeleteTask,
  onEditTask,
  tasks,
  viewMode = TASK_VIEW_MODES.LIST,
}) {
  const [listParent] = useAutoAnimate({ duration: 180, easing: 'ease-out' });
  const statuses = activeStatus === 'All' ? TASK_STATUSES : [activeStatus];

  if (viewMode === TASK_VIEW_MODES.LIST) {
    return (
      <DashboardCard
        action={<Badge variant="muted">{tasks.length}</Badge>}
        className="bg-surface"
        title="Task queue"
      >
        <div className="grid gap-3" ref={listParent}>
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskCard
                isBusy={isMutating}
                key={task._id}
                onComplete={onCompleteTask}
                onCycleStatus={onCycleStatus}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
                task={task}
              />
            ))}
          </AnimatePresence>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {statuses.map((status) => {
        return (
          <TaskColumn
            isMutating={isMutating}
            key={status}
            onCompleteTask={onCompleteTask}
            onCycleStatus={onCycleStatus}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
          />
        );
      })}
    </div>
  );
}

function TaskColumn({
  isMutating,
  onCompleteTask,
  onCycleStatus,
  onDeleteTask,
  onEditTask,
  status,
  tasks,
}) {
  const [columnParent] = useAutoAnimate({ duration: 180, easing: 'ease-out' });
  const Icon = columnMeta[status].icon;

  return (
    <DashboardCard
      action={<Badge variant="muted">{tasks.length}</Badge>}
      className="min-h-[380px] bg-surface"
      title={status}
    >
      <div className="mb-4 flex items-center gap-3 rounded-card border border-border bg-surface p-3">
        <span className="grid size-10 place-items-center rounded-card bg-accent-soft text-accent-strong">
          <Icon aria-hidden="true" size={18} />
        </span>
        <p className="m-0 text-sm text-muted">{columnMeta[status].helper}</p>
      </div>

      {tasks.length > 0 ? (
        <div className="grid gap-3" ref={columnParent}>
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskCard
                isBusy={isMutating}
                key={task._id}
                onComplete={onCompleteTask}
                onCycleStatus={onCycleStatus}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
                task={task}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          className="min-h-52 border border-dashed border-border bg-surface-elevated/65"
          description="Tasks will settle here as their status changes."
          framed={false}
          icon={CalendarClock}
          title={`No ${status.toLowerCase()} tasks`}
        />
      )}
    </DashboardCard>
  );
}
