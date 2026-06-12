import { Coffee, Pause, Play, RotateCcw, TimerReset } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { mergeClassNames } from '../../../lib/classNames.js';
import { usePomodoroTimer } from '../usePomodoroTimer.js';

const MODES = [
  { id: 'focus', label: 'Focus', helper: '25 min', icon: TimerReset },
  { id: 'break', label: 'Break', helper: '5 min', icon: Coffee },
];

export function PomodoroTimer() {
  const {
    formattedTime,
    isRunning,
    mode,
    progress,
    reset,
    setMode,
    toggleRunning,
  } = usePomodoroTimer();

  return (
    <DashboardCard
      action={<Badge variant={isRunning ? 'success' : 'muted'}>{isRunning ? 'Running' : 'Ready'}</Badge>}
      title="Focus timer"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-2 rounded-card border border-border bg-surface-elevated p-1">
          {MODES.map((timerMode) => {
            const Icon = timerMode.icon;
            const isActive = mode === timerMode.id;

            return (
              <button
                aria-pressed={isActive}
                className={mergeClassNames(
                  'grid min-h-16 rounded-card px-3 py-2 text-left transition focus-visible:outline-none focus-visible:shadow-focus',
                  isActive
                    ? 'bg-surface text-body shadow-card'
                    : 'text-muted hover:bg-surface hover:text-body',
                )}
                key={timerMode.id}
                onClick={() => setMode(timerMode.id)}
                type="button"
              >
                <span className="inline-flex items-center gap-2 text-sm font-bold">
                  <Icon aria-hidden="true" size={16} />
                  {timerMode.label}
                </span>
                <span className="mt-1 text-xs font-semibold text-muted">
                  {timerMode.helper}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-card border border-border bg-surface-elevated p-5">
          <p className="m-0 text-xs font-semibold uppercase text-muted">
            {mode === 'focus' ? 'Deep work block' : 'Recovery block'}
          </p>
          <time
            className="mt-2 block text-5xl font-bold leading-none text-body"
            dateTime={`PT${formattedTime.replace(':', 'M')}S`}
          >
            {formattedTime}
          </time>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface">
            <span
              className="block h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button onClick={toggleRunning} variant="primary">
            {isRunning ? (
              <Pause aria-hidden="true" size={17} />
            ) : (
              <Play aria-hidden="true" size={17} />
            )}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button aria-label="Reset focus timer" onClick={reset} size="icon" variant="secondary">
            <RotateCcw aria-hidden="true" size={17} />
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
