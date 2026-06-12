import { useEffect, useMemo, useState } from 'react';
import { GripHorizontal, Maximize2, Minimize2, Pause, Play, RotateCcw, TimerReset } from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { mergeClassNames } from '../../../lib/classNames.js';
import { POMODORO_STORAGE_KEYS, POMODORO_STATUS } from '../../../utils/constants.js';
import { usePomodoro } from '../usePomodoro.js';

const DEFAULT_WIDTH = 288;
const DEFAULT_HEIGHT = 148;
const EDGE_PADDING = 18;

function readWidgetState() {
  if (typeof window === 'undefined') {
    return { minimized: false, x: null, y: null };
  }

  try {
    const storedState = JSON.parse(window.localStorage.getItem(POMODORO_STORAGE_KEYS.FLOATING_WIDGET));
    return {
      minimized: Boolean(storedState?.minimized),
      x: Number.isFinite(storedState?.x) ? storedState.x : null,
      y: Number.isFinite(storedState?.y) ? storedState.y : null,
    };
  } catch {
    return { minimized: false, x: null, y: null };
  }
}

function getBoundedPosition({ x, y, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }) {
  if (typeof window === 'undefined') {
    return { x, y };
  }

  return {
    x: Math.min(Math.max(EDGE_PADDING, x), Math.max(EDGE_PADDING, window.innerWidth - width - EDGE_PADDING)),
    y: Math.min(Math.max(EDGE_PADDING, y), Math.max(EDGE_PADDING, window.innerHeight - height - EDGE_PADDING)),
  };
}

/** Shows an active Pomodoro session as a draggable, minimizable cockpit widget. */
export function FloatingPomodoroWidget() {
  const {
    formattedTime,
    isRunning,
    linkedTaskTitle,
    openModal,
    progress,
    status,
    stopSession,
    togglePause,
  } = usePomodoro();
  const [widgetState, setWidgetState] = useState(readWidgetState);
  const [dragState, setDragState] = useState(null);
  const isIdle = status === POMODORO_STATUS.IDLE;
  const isBreak = status === POMODORO_STATUS.SHORT_BREAK || status === POMODORO_STATUS.LONG_BREAK;
  const toneClassName = isBreak
    ? 'border-[var(--pomo-break)] bg-[var(--pomo-break-subtle)] text-[var(--pomo-break)]'
    : 'border-[var(--pomo-focus)] bg-[var(--pomo-focus-subtle)] text-[var(--pomo-focus)]';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setWidgetState((currentState) => {
      if (currentState.x !== null && currentState.y !== null) {
        return currentState;
      }

      return {
        ...currentState,
        ...getBoundedPosition({
          x: window.innerWidth - DEFAULT_WIDTH - 32,
          y: window.innerHeight - DEFAULT_HEIGHT - 32,
        }),
      };
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(POMODORO_STORAGE_KEYS.FLOATING_WIDGET, JSON.stringify(widgetState));
    } catch {
      // Widget placement is a convenience preference and should not block timer UI.
    }
  }, [widgetState]);

  useEffect(() => {
    if (!dragState) {
      return undefined;
    }

    function handlePointerMove(event) {
      setWidgetState((currentState) => ({
        ...currentState,
        ...getBoundedPosition({
          height: currentState.minimized ? 58 : DEFAULT_HEIGHT,
          width: currentState.minimized ? 190 : DEFAULT_WIDTH,
          x: event.clientX - dragState.offsetX,
          y: event.clientY - dragState.offsetY,
        }),
      }));
    }

    function handlePointerUp() {
      setDragState(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState]);

  const positionStyle = useMemo(() => {
    if (widgetState.x === null || widgetState.y === null) {
      return { bottom: EDGE_PADDING, right: EDGE_PADDING };
    }

    return { left: widgetState.x, top: widgetState.y };
  }, [widgetState.x, widgetState.y]);

  function startDrag(event) {
    const rect = event.currentTarget.closest('[data-floating-pomodoro]')?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setDragState({
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    });
  }

  if (isIdle) {
    return null;
  }

  return (
    <aside
      aria-label="Floating focus timer"
      className={mergeClassNames(
        'fixed z-40 rounded-panel border bg-surface shadow-floating transition',
        widgetState.minimized ? 'w-[190px]' : 'w-[288px]',
      )}
      data-floating-pomodoro
      style={positionStyle}
    >
      <div
        className="flex cursor-grab touch-none items-center justify-between gap-2 border-b border-border px-3 py-2 active:cursor-grabbing"
        onPointerDown={startDrag}
      >
        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted">
          <GripHorizontal aria-hidden="true" size={14} />
          Focus
        </span>
        <button
          aria-label={widgetState.minimized ? 'Expand focus widget' : 'Minimize focus widget'}
          className="grid size-7 place-items-center rounded-card text-muted transition hover:bg-surface-elevated hover:text-body focus-visible:outline-none focus-visible:shadow-focus"
          onClick={() =>
            setWidgetState((currentState) => ({
              ...currentState,
              minimized: !currentState.minimized,
            }))
          }
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          {widgetState.minimized ? <Maximize2 aria-hidden="true" size={14} /> : <Minimize2 aria-hidden="true" size={14} />}
        </button>
      </div>

      <button
        className="grid w-full gap-2 p-3 text-left focus-visible:outline-none focus-visible:shadow-focus"
        onClick={openModal}
        type="button"
      >
        <span className={mergeClassNames('inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-black', toneClassName)}>
          <span className={mergeClassNames('size-2 rounded-full', isRunning && 'focus-pulse', isBreak ? 'bg-[var(--pomo-break)]' : 'bg-[var(--pomo-focus)]')} />
          {isBreak ? 'Break' : 'Focus'}
        </span>
        <span className="font-mono text-3xl font-black leading-none text-body">{formattedTime}</span>
        {!widgetState.minimized && linkedTaskTitle ? (
          <span className="truncate text-xs font-semibold text-muted">{linkedTaskTitle}</span>
        ) : null}
        {!widgetState.minimized ? (
          <span className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
            <span className="block h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </span>
        ) : null}
      </button>

      {!widgetState.minimized ? (
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 pb-3">
          <Button onClick={togglePause} size="sm">
            {isRunning ? <Pause aria-hidden="true" size={15} /> : <Play aria-hidden="true" size={15} />}
            {isRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button aria-label="Open focus modal" onClick={openModal} size="icon" variant="secondary">
            <TimerReset aria-hidden="true" size={15} />
          </Button>
          <Button aria-label="Stop focus timer" onClick={stopSession} size="icon" variant="danger">
            <RotateCcw aria-hidden="true" size={15} />
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
