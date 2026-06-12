import { lazy, Suspense, useEffect, useState } from 'react';
import { CheckCircle2, Pause, Play, SkipForward, Square, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { mergeClassNames } from '../../../lib/classNames.js';
import { POMODORO_RING, POMODORO_STATUS } from '../../../utils/constants.js';
import { usePomodoro } from '../usePomodoro.js';

const FocusProgressScene = lazy(() => import('./FocusProgressScene.jsx'));

const sessionLabels = {
  [POMODORO_STATUS.IDLE]: 'FOCUS SESSION',
  [POMODORO_STATUS.FOCUS]: 'FOCUS SESSION',
  [POMODORO_STATUS.SHORT_BREAK]: 'SHORT BREAK',
  [POMODORO_STATUS.LONG_BREAK]: 'LONG BREAK',
};

function getSessionTone(status) {
  if (status === POMODORO_STATUS.FOCUS) {
    return {
      text: 'var(--pomo-focus)',
      subtle: 'var(--pomo-focus-subtle)',
    };
  }

  if (status === POMODORO_STATUS.SHORT_BREAK || status === POMODORO_STATUS.LONG_BREAK) {
    return {
      text: 'var(--pomo-break)',
      subtle: 'var(--pomo-break-subtle)',
    };
  }

  return {
    text: 'var(--accent)',
    subtle: 'var(--accent-subtle)',
  };
}

function isLowPowerDevice() {
  if (typeof navigator === 'undefined') {
    return true;
  }

  const coreCount = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  return coreCount <= 4 || memory <= 2;
}

function useCanRenderFocusScene(isModalOpen) {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!isModalOpen || typeof window === 'undefined') {
      setCanRender(false);
      return undefined;
    }

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setCanRender(!motionQuery?.matches && !isLowPowerDevice());
    };

    updatePreference();
    motionQuery?.addEventListener?.('change', updatePreference);

    return () => motionQuery?.removeEventListener?.('change', updatePreference);
  }, [isModalOpen]);

  return canRender;
}

function ProgressRing({ circumference, dashOffset, tone }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90"
      height={POMODORO_RING.size}
      viewBox={`0 0 ${POMODORO_RING.size} ${POMODORO_RING.size}`}
      width={POMODORO_RING.size}
    >
      <circle
        cx={POMODORO_RING.size / 2}
        cy={POMODORO_RING.size / 2}
        fill="none"
        r={POMODORO_RING.radius}
        stroke="var(--bg-surface-3)"
        strokeWidth={POMODORO_RING.strokeWidth}
      />
      <circle
        cx={POMODORO_RING.size / 2}
        cy={POMODORO_RING.size / 2}
        fill="none"
        r={POMODORO_RING.radius}
        stroke={tone.text}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={POMODORO_RING.strokeWidth}
      />
    </svg>
  );
}

/** Renders the full-screen focus session modal for the global Pomodoro timer. */
export function PomodoroModal() {
  const {
    closeModal,
    completedMessage,
    duration,
    elapsedSeconds,
    focusSessionsInCycle,
    formattedTime,
    isModalOpen,
    isRunning,
    linkedTaskTitle,
    settings,
    skipSession,
    status,
    stopSession,
    togglePause,
  } = usePomodoro();
  const canRenderFocusScene = useCanRenderFocusScene(isModalOpen);

  if (!isModalOpen) {
    return null;
  }

  const tone = getSessionTone(status);
  const circumference = 2 * Math.PI * POMODORO_RING.radius;
  const progress = duration > 0 ? Math.min(elapsedSeconds / duration, 1) : 0;
  const dashOffset = circumference - progress * circumference;
  const shouldRenderScene = canRenderFocusScene && status !== POMODORO_STATUS.IDLE;

  return (
    <div className="focus-modal-backdrop fixed inset-0 z-50 grid place-items-center p-4">
      <section
        aria-label="Focus timer"
        aria-modal="true"
        className="relative grid w-full max-w-[480px] gap-6 rounded-panel border border-border bg-surface p-8 text-center shadow-panel sm:p-10"
        role="dialog"
      >
        <button
          aria-label="Close focus timer"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-card text-muted transition hover:bg-surface-elevated hover:text-body focus-visible:outline-none focus-visible:shadow-focus"
          onClick={closeModal}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>

        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.05em] text-muted">
            {sessionLabels[status]}
          </p>
          {completedMessage ? (
            <div
              className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
              style={{ background: 'var(--success-subtle)', color: 'var(--success-text)' }}
            >
              <CheckCircle2 aria-hidden="true" size={16} />
              {completedMessage}
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto size-[220px]">
          {shouldRenderScene ? (
            <Suspense
              fallback={
                <ProgressRing
                  circumference={circumference}
                  dashOffset={dashOffset}
                  tone={tone}
                />
              }
            >
              <FocusProgressScene
                isPaused={!isRunning}
                progress={progress}
                status={status}
              />
            </Suspense>
          ) : (
            <ProgressRing circumference={circumference} dashOffset={dashOffset} tone={tone} />
          )}
          <time className="pointer-events-none absolute inset-0 z-10 grid place-items-center font-mono text-[72px] font-bold leading-none text-body">
            {formattedTime}
          </time>
        </div>

        {linkedTaskTitle ? (
          <p className="m-0 text-base font-semibold text-muted">{linkedTaskTitle}</p>
        ) : null}

        <div className="flex justify-center gap-2" aria-label="Focus sessions before long break">
          {Array.from({ length: settings.longBreakAfter }).map((_, index) => (
            <span
              aria-hidden="true"
              className={mergeClassNames(
                'size-2.5 rounded-full transition',
                index < focusSessionsInCycle ? 'bg-accent' : 'bg-surface-elevated',
              )}
              key={index}
            />
          ))}
        </div>

        <div
          className="rounded-card border border-border px-4 py-3 text-sm text-muted"
          style={{ background: tone.subtle, color: tone.text }}
        >
          {status === POMODORO_STATUS.IDLE
            ? 'Choose start when you are ready to protect this focus block.'
            : isRunning
              ? 'Session is active. Stay with the next action.'
              : 'Session is paused. Resume when your attention is back.'}
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Button onClick={togglePause} variant="primary">
            {isRunning ? (
              <Pause aria-hidden="true" size={17} />
            ) : (
              <Play aria-hidden="true" size={17} />
            )}
            {status === POMODORO_STATUS.IDLE ? 'Start' : isRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button
            disabled={status === POMODORO_STATUS.IDLE}
            onClick={skipSession}
            variant="secondary"
          >
            <SkipForward aria-hidden="true" size={17} />
            Skip
          </Button>
          <Button onClick={stopSession} variant="danger">
            <Square aria-hidden="true" size={16} />
            Stop
          </Button>
        </div>
      </section>
    </div>
  );
}
