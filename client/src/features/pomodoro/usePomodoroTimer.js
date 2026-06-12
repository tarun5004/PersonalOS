import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'personal-os-pomodoro';
const MODE_DURATIONS = {
  focus: 25 * 60,
  break: 5 * 60,
};

function isPomodoroMode(value) {
  return value === 'focus' || value === 'break';
}

function clampRemainingSeconds(value, mode) {
  const duration = MODE_DURATIONS[mode];
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return duration;
  }

  return Math.min(Math.max(Math.round(parsedValue), 0), duration);
}

function readStoredState() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const parsedState = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    const mode = isPomodoroMode(parsedState?.mode) ? parsedState.mode : 'focus';

    return {
      mode,
      remainingSeconds: clampRemainingSeconds(parsedState?.remainingSeconds, mode),
      isRunning: Boolean(parsedState?.isRunning),
    };
  } catch {
    return null;
  }
}

function getInitialState() {
  return (
    readStoredState() || {
      mode: 'focus',
      remainingSeconds: MODE_DURATIONS.focus,
      isRunning: false,
    }
  );
}

export function formatPomodoroTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function usePomodoroTimer() {
  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setState((currentState) => {
        if (!currentState.isRunning) {
          return currentState;
        }

        const nextRemainingSeconds = Math.max(currentState.remainingSeconds - 1, 0);

        return {
          ...currentState,
          remainingSeconds: nextRemainingSeconds,
          isRunning: nextRemainingSeconds > 0,
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.isRunning]);

  const setMode = useCallback((nextMode) => {
    if (!isPomodoroMode(nextMode)) {
      return;
    }

    setState({
      mode: nextMode,
      remainingSeconds: MODE_DURATIONS[nextMode],
      isRunning: false,
    });
  }, []);

  const reset = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      remainingSeconds: MODE_DURATIONS[currentState.mode],
      isRunning: false,
    }));
  }, []);

  const toggleRunning = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      isRunning:
        currentState.remainingSeconds > 0 ? !currentState.isRunning : true,
      remainingSeconds:
        currentState.remainingSeconds > 0
          ? currentState.remainingSeconds
          : MODE_DURATIONS[currentState.mode],
    }));
  }, []);

  return useMemo(() => {
    const duration = MODE_DURATIONS[state.mode];
    const elapsedSeconds = duration - state.remainingSeconds;

    return {
      duration,
      elapsedSeconds,
      formattedTime: formatPomodoroTime(state.remainingSeconds),
      isRunning: state.isRunning,
      mode: state.mode,
      progress: Math.round((elapsedSeconds / duration) * 100),
      remainingSeconds: state.remainingSeconds,
      reset,
      setMode,
      toggleRunning,
    };
  }, [reset, setMode, state, toggleRunning]);
}
