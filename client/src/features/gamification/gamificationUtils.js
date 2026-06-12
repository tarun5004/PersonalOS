const LEVELS = [
  { level: 1, minXp: 0, nextXp: 100 },
  { level: 2, minXp: 100, nextXp: 250 },
  { level: 3, minXp: 250, nextXp: 500 },
  { level: 4, minXp: 500, nextXp: 850 },
  { level: 5, minXp: 850, nextXp: 1300 },
  { level: 6, minXp: 1300, nextXp: 1900 },
];

export const XP_RULES = {
  taskCompleted: 20,
  habitCompleted: 15,
  focusSession: 25,
  streakDay: 5,
};

export function calculateTodayXp({ dailyFocusCount = 0, summary }) {
  if (!summary) {
    return 0;
  }

  return (
    (summary.tasks?.completed || 0) * XP_RULES.taskCompleted +
    (summary.habits?.completedToday || 0) * XP_RULES.habitCompleted +
    dailyFocusCount * XP_RULES.focusSession +
    (summary.currentStreak || 0) * XP_RULES.streakDay
  );
}

export function getLevelProgress(xp = 0) {
  const current = [...LEVELS].reverse().find((level) => xp >= level.minXp) || LEVELS[0];
  const nextXp = current.nextXp || current.minXp + 750;
  const progress = Math.min(100, Math.round(((xp - current.minXp) / (nextXp - current.minXp)) * 100));

  return {
    level: current.level,
    currentXp: xp,
    nextXp,
    progress,
    remainingXp: Math.max(0, nextXp - xp),
  };
}

export function calculateFocusScore({ dailyFocusCount = 0, productivityScore }) {
  const productivityPart = productivityScore === null || productivityScore === undefined ? 35 : productivityScore * 0.6;
  const focusPart = Math.min(40, dailyFocusCount * 14);

  return Math.round(Math.min(100, productivityPart + focusPart));
}

export function getAchievements({ dailyFocusCount = 0, summary, tasks = [], habits = [] }) {
  const completedTasks = tasks.filter((task) => task.status === 'completed').length + (summary?.tasks?.completed || 0);
  const completedHabits = summary?.habits?.completedToday || 0;
  const streak = summary?.currentStreak || 0;
  const achievements = [
    {
      id: 'first-focus',
      title: 'First Focus Session',
      description: 'Start one focused work block.',
      unlocked: dailyFocusCount > 0,
    },
    {
      id: 'task-closer',
      title: 'Task Closer',
      description: 'Complete your first task.',
      unlocked: completedTasks > 0,
    },
    {
      id: 'habit-spark',
      title: 'Habit Spark',
      description: 'Check in at least one habit today.',
      unlocked: completedHabits > 0,
    },
    {
      id: 'seven-day-streak',
      title: '7 Day Streak',
      description: 'Hold a habit streak for a week.',
      unlocked: streak >= 7,
    },
    {
      id: 'habit-master',
      title: 'Habit Master',
      description: 'Track five active habits.',
      unlocked: habits.length >= 5,
    },
  ];

  return achievements;
}
