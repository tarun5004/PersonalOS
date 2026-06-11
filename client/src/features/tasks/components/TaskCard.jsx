import { CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { formatTaskDueDate } from '../taskFormUtils.js';
import { mergeClassNames } from '../../../lib/classNames.js';

const priorityVariants = {
  Low: 'muted',
  Medium: 'warning',
  High: 'danger',
};

const statusTone = {
  Todo: 'bg-muted',
  'In Progress': 'bg-warning',
  Completed: 'bg-success',
};

export function TaskCard({ isBusy, onComplete, onDelete, onEdit, task }) {
  const isCompleted = task.status === 'Completed';

  return (
    <article className="grid gap-3 rounded-ui border border-border bg-surface px-4 py-3 transition hover:border-focus hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={mergeClassNames('size-2 shrink-0 rounded-full', statusTone[task.status])}
            />
            <h3 className="truncate text-sm font-bold text-body">{task.title}</h3>
          </div>
          <p className="mt-1 text-xs text-muted">{formatTaskDueDate(task.dueDate)}</p>
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
