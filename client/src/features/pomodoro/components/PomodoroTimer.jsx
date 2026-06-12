import { Pause, Play, RotateCcw, TimerReset } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { POMODORO_STATUS } from '../../../utils/constants.js';
import { usePomodoro } from '../usePomodoro.js';

/** Renders the dashboard focus timer card backed by the global Pomodoro context. */
export function PomodoroTimer() {
  const {
    dailyCount,
    formattedTime,
    isRunning,
    linkedTaskTitle,
    openModal,
    prepareFocus,
    progress,
    status,
    stopSession,
    togglePause,
  } = usePomodoro();
  const isIdle = status === POMODORO_STATUS.IDLE;

  return (
    <DashboardCard
      action={<Badge variant={isRunning ? 'success' : 'muted'}>{isRunning ? 'Running' : 'Ready'}</Badge>}
      title="Focus timer"
    >
      <div className="grid gap-4">
        <div className="rounded-card border border-border bg-surface-elevated p-5">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.05em] text-muted">
            {isIdle ? 'Focus session' : status.replace('_', ' ')}
          </p>
          <time className="mt-2 block text-5xl font-bold leading-none text-body">
            {formattedTime}
          </time>
          {linkedTaskTitle ? (
            <p className="mt-2 truncate text-sm text-muted">{linkedTaskTitle}</p>
          ) : null}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface">
            <span
              className="block h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-card border border-border bg-surface p-3 text-sm text-muted">
          <span>Focus today</span>
          <strong className="text-right text-body">{dailyCount} sessions</strong>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <Button onClick={isIdle ? prepareFocus : togglePause} variant="primary">
            {isRunning ? (
              <Pause aria-hidden="true" size={17} />
            ) : (
              <Play aria-hidden="true" size={17} />
            )}
            {isIdle ? 'Start focus' : isRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button aria-label="Open focus timer" onClick={openModal} size="icon" variant="secondary">
            <TimerReset aria-hidden="true" size={17} />
          </Button>
          <Button
            aria-label="Stop focus timer"
            disabled={isIdle}
            onClick={stopSession}
            size="icon"
            variant="danger"
          >
            <RotateCcw aria-hidden="true" size={17} />
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
