import { useContext } from 'react';
import { PomodoroContext } from './PomodoroProvider.jsx';

/** Reads the app-wide Pomodoro context and guards against missing provider wiring. */
export function usePomodoro() {
  const context = useContext(PomodoroContext);

  if (!context) {
    throw new Error('usePomodoro must be used inside PomodoroProvider');
  }

  return context;
}
