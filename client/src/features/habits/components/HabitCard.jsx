import { CalendarCheck, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Card } from '../../../components/ui/Card.jsx';

export function HabitCard({
  habit,
  isMutating,
  onCheckInHabit,
  onDeleteHabit,
  onEditHabit,
}) {
  return (
    <Card className="grid gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="m-0 truncate text-base font-bold text-body">{habit.name}</h3>
          <p className="mt-1 text-sm text-muted">
            {habit.todayCompleted ? 'Checked in for today' : 'Ready for today'}
          </p>
        </div>
        <Badge variant={habit.todayCompleted ? 'success' : 'muted'}>
          {habit.todayCompleted ? 'Done' : 'Today'}
        </Badge>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-ui bg-surface-muted p-3">
          <dt className="text-xs font-semibold text-muted">Current</dt>
          <dd className="m-0 mt-1 text-lg font-bold text-body">{habit.currentStreak}d</dd>
        </div>
        <div className="rounded-ui bg-surface-muted p-3">
          <dt className="text-xs font-semibold text-muted">Best</dt>
          <dd className="m-0 mt-1 text-lg font-bold text-body">{habit.longestStreak}d</dd>
        </div>
        <div className="rounded-ui bg-surface-muted p-3">
          <dt className="text-xs font-semibold text-muted">Month</dt>
          <dd className="m-0 mt-1 text-lg font-bold text-primary-strong">
            {Math.round(habit.completionPercentage)}%
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={isMutating || habit.todayCompleted}
          onClick={() => onCheckInHabit(habit)}
          variant={habit.todayCompleted ? 'secondary' : 'primary'}
        >
          <CalendarCheck aria-hidden="true" size={16} />
          {habit.todayCompleted ? 'Completed' : 'Check in'}
        </Button>
        <Button disabled={isMutating} onClick={() => onEditHabit(habit)} variant="secondary">
          <Pencil aria-hidden="true" size={16} />
          Edit
        </Button>
        <Button disabled={isMutating} onClick={() => onDeleteHabit(habit)} variant="danger">
          <Trash2 aria-hidden="true" size={16} />
          Delete
        </Button>
      </div>
    </Card>
  );
}
