import {
  DEFAULT_POMODORO_SETTINGS,
  POMODORO_OPTIONS,
  POMODORO_STORAGE_KEYS,
  POMODORO_STATUS,
  SECONDS_PER_MINUTE,
} from '../../utils/constants.js';

/** Returns the local calendar key used for daily Pomodoro reset boundaries. */
export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function readJson(key) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}

/** Persists serializable Pomodoro data without blocking app rendering. */
export function writeJson(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local persistence should never block rendering.
  }
}

function isAllowedNumber(value, options) {
  return options.includes(Number(value));
}

/** Reads and sanitizes persisted Pomodoro settings. */
export function readSettings() {
  const storedSettings = readJson(POMODORO_STORAGE_KEYS.SETTINGS) || {};

  return {
    focusDuration: isAllowedNumber(storedSettings.focusDuration, POMODORO_OPTIONS.focusDuration)
      ? Number(storedSettings.focusDuration)
      : DEFAULT_POMODORO_SETTINGS.focusDuration,
    shortBreak: isAllowedNumber(storedSettings.shortBreak, POMODORO_OPTIONS.shortBreak)
      ? Number(storedSettings.shortBreak)
      : DEFAULT_POMODORO_SETTINGS.shortBreak,
    longBreak: isAllowedNumber(storedSettings.longBreak, POMODORO_OPTIONS.longBreak)
      ? Number(storedSettings.longBreak)
      : DEFAULT_POMODORO_SETTINGS.longBreak,
    longBreakAfter: isAllowedNumber(
      storedSettings.longBreakAfter,
      POMODORO_OPTIONS.longBreakAfter,
    )
      ? Number(storedSettings.longBreakAfter)
      : DEFAULT_POMODORO_SETTINGS.longBreakAfter,
    autoStartBreak: Boolean(storedSettings.autoStartBreak),
    autoStartFocus: Boolean(storedSettings.autoStartFocus),
    soundOnComplete:
      typeof storedSettings.soundOnComplete === 'boolean'
        ? storedSettings.soundOnComplete
        : DEFAULT_POMODORO_SETTINGS.soundOnComplete,
  };
}

/** Reads today's persisted Pomodoro session count, resetting on a new local day. */
export function readDailyStats() {
  const today = getLocalDateKey();
  const storedStats = readJson(POMODORO_STORAGE_KEYS.DAILY);

  if (storedStats?.date === today) {
    return {
      date: today,
      dailyCount: Number(storedStats.dailyCount) || 0,
      totalSessionsToday: Number(storedStats.totalSessionsToday) || 0,
    };
  }

  return {
    date: today,
    dailyCount: 0,
    totalSessionsToday: 0,
  };
}

/** Returns the configured duration for a Pomodoro status in seconds. */
export function getDurationSeconds(status, settings) {
  const durationByStatus = {
    [POMODORO_STATUS.FOCUS]: settings.focusDuration,
    [POMODORO_STATUS.SHORT_BREAK]: settings.shortBreak,
    [POMODORO_STATUS.LONG_BREAK]: settings.longBreak,
  };

  return (durationByStatus[status] || settings.focusDuration) * SECONDS_PER_MINUTE;
}

/** Creates a normalized Pomodoro timer session state. */
export function createSession({
  completedMessage = '',
  focusSessionsInCycle = 0,
  isRunning = false,
  linkedTaskId = null,
  linkedTaskTitle = null,
  settings,
  status,
}) {
  const timeLeft = getDurationSeconds(status, settings);

  return {
    completedMessage,
    endAt: isRunning ? Date.now() + timeLeft * 1000 : null,
    focusSessionsInCycle,
    isRunning,
    linkedTaskId,
    linkedTaskTitle,
    status,
    timeLeft,
  };
}

/** Creates the idle Pomodoro state while preserving the configured focus duration. */
export function createIdleState(settings) {
  return {
    ...createSession({
      isRunning: false,
      settings,
      status: POMODORO_STATUS.FOCUS,
    }),
    status: POMODORO_STATUS.IDLE,
  };
}

/** Reads persisted Pomodoro timer state and normalizes stale countdown values. */
export function readTimerState(settings) {
  const storedState = readJson(POMODORO_STORAGE_KEYS.STATE);
  const allowedStatuses = Object.values(POMODORO_STATUS);

  if (!allowedStatuses.includes(storedState?.status)) {
    return createIdleState(settings);
  }

  const activeStatus =
    storedState.status === POMODORO_STATUS.IDLE ? POMODORO_STATUS.FOCUS : storedState.status;
  const duration = getDurationSeconds(activeStatus, settings);
  const timeLeft = storedState?.isRunning
    ? Math.max(Math.ceil((Number(storedState.endAt) - Date.now()) / 1000), 0)
    : Math.min(Math.max(Number(storedState?.timeLeft) || duration, 0), duration);

  return {
    completedMessage: storedState.completedMessage || '',
    endAt: storedState.isRunning && timeLeft > 0 ? Number(storedState.endAt) : null,
    focusSessionsInCycle: Number(storedState.focusSessionsInCycle) || 0,
    isRunning: Boolean(storedState.isRunning && timeLeft > 0),
    linkedTaskId: storedState.linkedTaskId || null,
    linkedTaskTitle: storedState.linkedTaskTitle || null,
    status: storedState.status,
    timeLeft,
  };
}

/** Increments today's completed focus-session counters. */
export function getNextDailyStats(currentStats) {
  const today = getLocalDateKey();
  const baseStats =
    currentStats.date === today
      ? currentStats
      : { date: today, dailyCount: 0, totalSessionsToday: 0 };

  return {
    ...baseStats,
    dailyCount: baseStats.dailyCount + 1,
    totalSessionsToday: baseStats.totalSessionsToday + 1,
  };
}

/** Applies the Pomodoro state-machine transition after a session ends. */
export function getCompletedSessionState(currentTimer, settings) {
  if (currentTimer.status === POMODORO_STATUS.FOCUS) {
    const nextFocusCycle = currentTimer.focusSessionsInCycle + 1;

    if (nextFocusCycle >= settings.longBreakAfter) {
      return createSession({
        completedMessage: 'Session complete. Take a longer break.',
        focusSessionsInCycle: 0,
        isRunning: settings.autoStartBreak,
        linkedTaskId: currentTimer.linkedTaskId,
        linkedTaskTitle: currentTimer.linkedTaskTitle,
        settings,
        status: POMODORO_STATUS.LONG_BREAK,
      });
    }

    return createSession({
      completedMessage: 'Session complete. Take a break.',
      focusSessionsInCycle: nextFocusCycle,
      isRunning: settings.autoStartBreak,
      linkedTaskId: currentTimer.linkedTaskId,
      linkedTaskTitle: currentTimer.linkedTaskTitle,
      settings,
      status: POMODORO_STATUS.SHORT_BREAK,
    });
  }

  if (currentTimer.status === POMODORO_STATUS.SHORT_BREAK) {
    return createSession({
      focusSessionsInCycle: currentTimer.focusSessionsInCycle,
      isRunning: settings.autoStartFocus,
      linkedTaskId: currentTimer.linkedTaskId,
      linkedTaskTitle: currentTimer.linkedTaskTitle,
      settings,
      status: POMODORO_STATUS.FOCUS,
    });
  }

  return createIdleState(settings);
}

/** Plays the short completion tone when browser audio policy permits it. */
export function playCompletionTone() {
  if (typeof window === 'undefined') {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    gain.gain.value = 0.2;
    oscillator.start();
    oscillator.stop(context.currentTime + 0.35);
  } catch {
    // Browser audio policies can reject playback; the UI still records completion.
  }
}

/** Formats timer seconds as a stable MM:SS label for Pomodoro UI. */
export function formatPomodoroTime(totalSeconds) {
  const safeSeconds = Math.max(Math.round(Number(totalSeconds) || 0), 0);
  const minutes = Math.floor(safeSeconds / SECONDS_PER_MINUTE);
  const seconds = safeSeconds % SECONDS_PER_MINUTE;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
