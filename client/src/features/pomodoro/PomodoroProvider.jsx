import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { POMODORO_STORAGE_KEYS, POMODORO_STATUS } from '../../utils/constants.js';
import { PomodoroModal } from './components/PomodoroModal.jsx';
import {
  createIdleState,
  createSession,
  formatPomodoroTime,
  getCompletedSessionState,
  getDurationSeconds,
  getLocalDateKey,
  getNextDailyStats,
  playCompletionTone,
  readDailyStats,
  readSettings,
  readTimerState,
  writeJson,
} from './pomodoroState.js';

export const PomodoroContext = createContext(null);

/** Provides app-wide Pomodoro state, persistence, controls, and modal rendering. */
export function PomodoroProvider({ children }) {
  const [settings, setSettingsState] = useState(readSettings);
  const [dailyStats, setDailyStats] = useState(readDailyStats);
  const [timer, setTimer] = useState(() => readTimerState(settings));
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => writeJson(POMODORO_STORAGE_KEYS.SETTINGS, settings), [settings]);
  useEffect(() => writeJson(POMODORO_STORAGE_KEYS.DAILY, dailyStats), [dailyStats]);
  useEffect(() => writeJson(POMODORO_STORAGE_KEYS.STATE, timer), [timer]);

  useEffect(() => {
    document.title =
      timer.status === POMODORO_STATUS.FOCUS && timer.isRunning
        ? `${formatPomodoroTime(timer.timeLeft)} - Personal OS`
        : 'Personal OS';
  }, [timer.isRunning, timer.status, timer.timeLeft]);

  useEffect(() => {
    if (dailyStats.date !== getLocalDateKey()) {
      setDailyStats(readDailyStats());
    }
  }, [dailyStats.date]);

  const completeCurrentSession = useCallback(
    ({ recordFocus = true } = {}) => {
      setTimer((currentTimer) => {
        if (currentTimer.status === POMODORO_STATUS.IDLE) {
          return currentTimer;
        }

        if (currentTimer.status === POMODORO_STATUS.FOCUS && recordFocus) {
          setDailyStats(getNextDailyStats);

          if (settings.soundOnComplete) {
            playCompletionTone();
          }
        }

        return getCompletedSessionState(currentTimer, settings);
      });
    },
    [settings],
  );

  const syncRemainingTime = useCallback(() => {
    setTimer((currentTimer) => {
      if (!currentTimer.isRunning || !currentTimer.endAt) {
        return currentTimer;
      }

      return {
        ...currentTimer,
        timeLeft: Math.max(Math.ceil((currentTimer.endAt - Date.now()) / 1000), 0),
      };
    });
  }, []);

  useEffect(() => {
    if (!timer.isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(syncRemainingTime, 1000);
    return () => window.clearInterval(intervalId);
  }, [syncRemainingTime, timer.isRunning]);

  useEffect(() => {
    if (timer.isRunning && timer.timeLeft === 0) {
      completeCurrentSession();
    }
  }, [completeCurrentSession, timer.isRunning, timer.timeLeft]);

  useEffect(() => {
    document.addEventListener('visibilitychange', syncRemainingTime);
    return () => document.removeEventListener('visibilitychange', syncRemainingTime);
  }, [syncRemainingTime]);

  const startSession = useCallback(
    ({ taskId = null, taskTitle = null } = {}) => {
      setTimer((currentTimer) =>
        createSession({
          focusSessionsInCycle: currentTimer.focusSessionsInCycle,
          isRunning: true,
          linkedTaskId: taskId,
          linkedTaskTitle: taskTitle,
          settings,
          status: POMODORO_STATUS.FOCUS,
        }),
      );
      setIsModalOpen(true);
    },
    [settings],
  );

  const prepareFocus = useCallback(() => {
    setTimer((currentTimer) =>
      currentTimer.status === POMODORO_STATUS.IDLE
        ? createSession({
            focusSessionsInCycle: currentTimer.focusSessionsInCycle,
            isRunning: false,
            linkedTaskId: currentTimer.linkedTaskId,
            linkedTaskTitle: currentTimer.linkedTaskTitle,
            settings,
            status: POMODORO_STATUS.FOCUS,
          })
        : currentTimer,
    );
    setIsModalOpen(true);
  }, [settings]);

  const togglePause = useCallback(() => {
    setTimer((currentTimer) => {
      if (currentTimer.status === POMODORO_STATUS.IDLE) {
        return createSession({ isRunning: true, settings, status: POMODORO_STATUS.FOCUS });
      }

      if (currentTimer.isRunning) {
        return { ...currentTimer, endAt: null, isRunning: false };
      }

      return {
        ...currentTimer,
        completedMessage: '',
        endAt: Date.now() + currentTimer.timeLeft * 1000,
        isRunning: currentTimer.timeLeft > 0,
      };
    });
    setIsModalOpen(true);
  }, [settings]);

  const updateSettings = useCallback((updates) => {
    setSettingsState((currentSettings) => ({ ...currentSettings, ...updates }));
  }, []);

  const value = useMemo(() => {
    const activeStatus =
      timer.status === POMODORO_STATUS.IDLE ? POMODORO_STATUS.FOCUS : timer.status;
    const duration = getDurationSeconds(activeStatus, settings);
    const elapsedSeconds = Math.max(duration - timer.timeLeft, 0);

    return {
      closeModal: () => setIsModalOpen(false),
      completedMessage: timer.completedMessage,
      dailyCount: dailyStats.dailyCount,
      duration,
      elapsedSeconds,
      focusSessionsInCycle: timer.focusSessionsInCycle,
      formattedTime: formatPomodoroTime(timer.timeLeft),
      isModalOpen,
      isRunning: timer.isRunning,
      linkedTaskId: timer.linkedTaskId,
      linkedTaskTitle: timer.linkedTaskTitle,
      openModal: () => setIsModalOpen(true),
      prepareFocus,
      progress: duration > 0 ? Math.round((elapsedSeconds / duration) * 100) : 0,
      sessionType: timer.status,
      settings,
      skipSession: () => completeCurrentSession({ recordFocus: false }),
      startSession,
      status: timer.status,
      stopSession: () => setTimer(createIdleState(settings)),
      timeLeft: timer.timeLeft,
      togglePause,
      totalSessionsToday: dailyStats.totalSessionsToday,
      updateSettings,
    };
  }, [completeCurrentSession, dailyStats, isModalOpen, prepareFocus, settings, startSession, timer, togglePause, updateSettings]);

  return (
    <PomodoroContext.Provider value={value}>
      {children}
      <PomodoroModal />
    </PomodoroContext.Provider>
  );
}
