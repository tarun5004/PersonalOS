import { Check, ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { DeferredScoreChart } from '../../../components/shared/DeferredScoreChart.jsx';
import { mergeClassNames } from '../../../lib/classNames.js';

const habits = [
  { name: 'Chanting', marks: ['done', 'done', 'done', 'done', 'missed', 'done', 'done'] },
  { name: 'DSA question', marks: ['done', 'done', 'missed', 'done', 'done', 'done', 'done'] },
  { name: 'College study', marks: ['done', 'missed', 'done', 'done', 'done', 'missed', 'done'] },
  { name: 'Coding', marks: ['done', 'done', 'done', 'done', 'done', 'done', 'done'] },
  { name: 'Book reading', marks: ['missed', 'done', 'done', 'missed', 'done', 'done', 'done'] },
  { name: 'Daily planning', marks: ['done', 'done', 'done', 'done', 'done', 'done', 'missed'] },
  { name: 'Healthy food', marks: ['done', 'done', 'missed', 'done', 'done', 'done', 'done'] },
];

const scorePreview = [
  { label: '1', score: 71 },
  { label: '2', score: 86 },
  { label: '3', score: 71 },
  { label: '4', score: 86 },
  { label: '5', score: 86 },
  { label: '6', score: 71 },
  { label: '7', score: 86 },
];

const today = new Date();
const monthLabel = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
const days = Array.from({ length: 31 }, (_, index) => index + 1);
const todayDate = today.getDate();

function getCellState(row, day) {
  if (day > todayDate) {
    return 'future';
  }

  return row.marks[(day - 1) % row.marks.length] || 'empty';
}

function HabitCell({ day, state }) {
  const isToday = day === todayDate;
  const Icon = state === 'done' ? Check : state === 'missed' ? X : Minus;

  return (
    <span
      aria-label={`Day ${day} ${state}`}
      className={mergeClassNames(
        'grid size-7 shrink-0 place-items-center rounded-[6px] border text-[11px] transition',
        state === 'done' && 'border-success bg-success text-primary-text',
        state === 'missed' && 'border-danger bg-danger text-primary-text',
        state === 'future' && 'border-border bg-surface text-muted/45',
        state === 'empty' && 'border-border bg-surface-muted text-muted',
        isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
      )}
    >
      <Icon aria-hidden="true" size={13} strokeWidth={2.5} />
    </span>
  );
}

export default function HabitsPage() {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <Badge>Habits</Badge>
          <h1 className="mt-3 text-[clamp(1.65rem,3vw,2.35rem)] font-bold leading-tight text-body">
            Monthly tracker
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            A monthly check-in grid shaped for streaks, completion rate, and daily rhythm.
          </p>
        </div>
        <Button disabled title="Habit creation is not available yet">
          <Plus aria-hidden="true" size={18} />
          Add habit
        </Button>
      </div>

      <DashboardCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button disabled size="icon" variant="secondary">
              <ChevronLeft aria-hidden="true" size={18} />
            </Button>
            <div className="min-h-10 rounded-ui border border-border bg-surface px-4 py-2 text-sm font-bold text-body">
              {monthLabel}
            </div>
            <Button disabled size="icon" variant="secondary">
              <ChevronRight aria-hidden="true" size={18} />
            </Button>
          </div>
          <Badge variant="muted">Preview</Badge>
        </div>
      </DashboardCard>

      <DashboardCard
        className="overflow-hidden bg-surface"
        title="Monthly habit tracker"
        action={<Badge variant="success">Today highlighted</Badge>}
      >
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[1040px]">
            <div className="grid grid-cols-[180px_repeat(31,28px)_72px_72px] gap-2 border-b border-border pb-3 text-center text-xs font-semibold text-muted">
              <span className="text-left">Habit</span>
              {days.map((day) => (
                <span className={day === todayDate ? 'text-primary-strong' : ''} key={day}>
                  {day}
                </span>
              ))}
              <span>Streak</span>
              <span>Rate</span>
            </div>

            <div className="grid gap-2 pt-3">
              {habits.map((habit) => {
                const doneCount = days.filter((day) => getCellState(habit, day) === 'done').length;
                const trackedDays = Math.min(todayDate, days.length);
                const rate = Math.round((doneCount / trackedDays) * 100);

                return (
                  <div
                    className="grid grid-cols-[180px_repeat(31,28px)_72px_72px] items-center gap-2 rounded-ui bg-surface/80 px-2 py-2"
                    key={habit.name}
                  >
                    <span className="truncate text-sm font-bold text-body">{habit.name}</span>
                    {days.map((day) => (
                      <HabitCell day={day} key={day} state={getCellState(habit, day)} />
                    ))}
                    <span className="text-center text-sm font-bold text-body">{doneCount}d</span>
                    <span className="text-center text-sm font-bold text-primary-strong">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Daily habits score graph">
        <DeferredScoreChart data={scorePreview} />
      </DashboardCard>
    </section>
  );
}
