export const SECONDS_PER_MINUTE = 60;

export const POMODORO_STATUS = {
  IDLE: 'idle',
  FOCUS: 'focus',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break',
};

export const POMODORO_STORAGE_KEYS = {
  SETTINGS: 'pos-pomo-settings',
  STATE: 'pos-pomo-state',
  DAILY: 'pos-pomo-daily',
};

export const POMODORO_OPTIONS = {
  focusDuration: [15, 20, 25, 30, 45, 60],
  shortBreak: [5, 10, 15],
  longBreak: [15, 20, 30],
  longBreakAfter: [3, 4, 5],
};

export const DEFAULT_POMODORO_SETTINGS = {
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakAfter: 4,
  autoStartBreak: false,
  autoStartFocus: false,
  soundOnComplete: true,
};

export const POMODORO_RING = {
  radius: 94,
  size: 200,
  strokeWidth: 6,
};

export const POMODORO_LINKED_TASK_MAX_LENGTH = 20;
