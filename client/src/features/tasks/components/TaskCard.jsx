import { Check, CheckCircle2, Pencil, Square, TimerReset, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { usePomodoro } from '../../pomodoro/usePomodoro.js';
import { formatTaskDueDate } from '../taskFormUtils.js';
import { getNextTaskStatus } from '../taskStatusUtils.js';
import { mergeClassNames } from '../../../lib/classNames.js';

const priorityVariants = {
  Low: 'muted',
  Medium: 'warning',
  High: 'danger',
};

const statusTone = {
  Todo: 'border-muted bg-transparent',
  'In Progress': 'border-warning bg-warning',
  Completed: 'border-success bg-success',
};

function isOverdue(task) {
  if (!task.dueDate || task.status === 'Completed') {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);

  return Number.isFinite(dueDate.getTime()) && dueDate.getTime() < today.getTime();
}

export function TaskCard({ isBusy, onComplete, onCycleStatus, onDelete, onEdit, task }) {
  const isCompleted = task.status === 'Completed';
  const nextStatus = getNextTaskStatus(task.status);
  const overdue = isOverdue(task);
  const {
    linkedTaskId,
    startSession,
    status: pomodoroStatus,
    stopSession,
  } = usePomodoro();
  const taskId = task._id || task.id;
  const isFocusedTask = linkedTaskId === taskId && pomodoroStatus !== 'idle';

  function handleFocusClick() {
    if (isFocusedTask) {
      stopSession();
      return;
    }

    startSession({ taskId, taskTitle: task.title });
  }

  return (
    <article className="grid gap-3 rounded-card border border-border bg-surface px-4 py-3 transition hover:border-accent hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <button
              aria-label={`Move ${task.title} to ${nextStatus}`}
              className={mergeClassNames(
                'grid size-5 shrink-0 place-items-center rounded-full border text-[10px] text-[var(--text-inverse)] transition hover:scale-105 focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-60',
                statusTone[task.status],
              )}
              disabled={isBusy}
              onClick={() => onCycleStatus(task)}
              type="button"
            >
              {isCompleted ? <Check aria-hidden="true" size={13} strokeWidth={3} /> : null}
            </button>
            <h3 className="truncate text-sm font-bold text-body">{task.title}</h3>
          </div>
          <p className={mergeClassNames('mt-1 text-xs font-semibold', overdue ? 'text-danger' : 'text-muted')}>
            {overdue ? `Overdue - ${formatTaskDueDate(task.dueDate)}` : formatTaskDueDate(task.dueDate)}
          </p>
        </div>
        <Badge variant={priorityVariants[task.priority] || 'primary'}>{task.priority}</Badge>
      </div>

      {task.description ? (
        <p className="m-0 line-clamp-2 text-sm leading-6 text-muted">{task.description}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant={isCompleted ? 'success' : 'muted'}>{task.status}</Badge>
        <div className="flex items-center gap-1">
          <Button
            aria-label={isFocusedTask ? `Stop focusing on ${task.title}` : `Focus on ${task.title}`}
            disabled={isBusy || isCompleted}
            onClick={handleFocusClick}
            size="sm"
            variant={isFocusedTask ? 'danger' : 'secondary'}
          >
            {isFocusedTask ? (
              <Square aria-hidden="true" size={15} />
            ) : (
              <TimerReset aria-hidden="true" size={15} />
            )}
            {isFocusedTask ? 'Stop' : 'Focus'}
          </Button>
          <Button
            aria-label={`Edit ${task.title}`}
            disabled={isBusy}
            onClick={() => onEdit(task)}
            size="icon"
            variant="ghost"
          >
            <Pencil aria-hidden="true" size={16} />
          </Button>
          <Button
            aria-label={`Complete ${task.title}`}
            disabled={isBusy || isCompleted}
            onClick={() => onComplete(task)}
            size="icon"
            variant="ghost"
          >
            <CheckCircle2 aria-hidden="true" size={16} />
          </Button>
          <Button
            aria-label={`Delete ${task.title}`}
            disabled={isBusy}
            onClick={() => onDelete(task)}
            size="icon"
            variant="danger"
          >
            <Trash2 aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>
    </article>
  );
}
