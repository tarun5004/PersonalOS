export const ANALYTICS_UNLOCK_DAYS = 7;
export const ANALYTICS_TWO_WEEK_DAYS = 14;
export const SCORE_TARGET = 70;

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function roundPercent(value) {
  return Math.round(value);
}

function getRate(completed, total) {
  return total > 0 ? Math.round((completed / total) * 100) : null;
}

function average(values) {
  const validValues = values.filter((value) => typeof value === 'number' && Number.isFinite(value));

  if (validValues.length === 0) {
    return null;
  }

  return validValues.reduce((total, value) => total + value, 0) / validValues.length;
}

function getWeekday(dateKey) {
  const date = new Date(`${dateKey}T00:00:00Z`);

  return date.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long' });
}

function getShortWeekday(dateKey) {
  const date = new Date(`${dateKey}T00:00:00Z`);

  return date.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short' });
}

function groupAverageByWeekday(days, key, predicate) {
  const groups = new Map();

  days.filter(predicate).forEach((day) => {
    const weekday = getWeekday(day.date);
    const values = groups.get(weekday) || [];

    values.push(day[key]);
    groups.set(weekday, values);
  });

  return [...groups.entries()].map(([weekday, values]) => ({
    average: average(values),
    weekday,
  }));
}

function getTaskCompletionStreak(days) {
  let streak = 0;

  for (const day of [...days].reverse()) {
    if (day.taskCompleted < 1) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function getRecoveryInsight(days) {
  if (days.length < 4) {
    return null;
  }

  const recentDays = days.slice(-4);
  const missedBlock = recentDays.slice(0, 2);
  const recoveredBlock = recentDays.slice(2);
  const missedDays = missedBlock.filter((day) => day.habitTotal > 0 && day.habitCompleted === 0);
  const recoveredDays = recoveredBlock.filter(
    (day) => day.habitTotal > 0 && day.habitCompleted > 0,
  );

  if (missedDays.length === 2 && recoveredDays.length === 2) {
    return {
      detail: 'Two recent habit misses were followed by two active days.',
      headline: 'Recovery pattern detected',
      tone: 'success',
      type: 'recovery',
    };
  }

  return null;
}

export function getScoredDays(days) {
  return days.filter((day) => day.productivityScore !== null);
}

export function countTrackedDays(days) {
  return days.filter((day) => day.taskTotal > 0 || day.habitCompleted > 0).length;
}

export function summarizeWeek(days) {
  const taskCompleted = sum(days.map((day) => day.taskCompleted));
  const taskTotal = sum(days.map((day) => day.taskTotal));
  const habitCompleted = sum(days.map((day) => day.habitCompleted));
  const habitTotal = sum(days.map((day) => day.habitTotal));
  const scoredDays = getScoredDays(days);

  return {
    habitCompleted,
    habitRate: getRate(habitCompleted, habitTotal),
    habitTotal,
    score: scoredDays.length > 0 ? roundPercent(average(scoredDays.map((day) => day.productivityScore))) : null,
    taskCompleted,
    taskRate: getRate(taskCompleted, taskTotal),
    taskTotal,
  };
}

export function getTrend(currentValue, previousValue) {
  if (currentValue === null || previousValue === null) {
    return null;
  }

  return Math.round(currentValue - previousValue);
}

export function buildChartDays(days) {
  return days.map((day) => ({
    ...day,
    weekday: getShortWeekday(day.date),
  }));
}

export function buildAnalyticsInsights({ days, focusSessions, habitInsights, previousDays }) {
  const combinedDays = [...previousDays, ...days];
  const trackedDays = countTrackedDays(combinedDays);

  if (trackedDays < ANALYTICS_UNLOCK_DAYS) {
    return {
      insights: [],
      unlockProgress: trackedDays,
    };
  }

  const insights = [];
  const hasTwoWeeks = combinedDays.length >= ANALYTICS_TWO_WEEK_DAYS;

  if (hasTwoWeeks) {
    const taskWeekdays = groupAverageByWeekday(
      combinedDays,
      'taskCompletionRate',
      (day) => day.taskTotal > 0,
    ).filter((item) => item.average !== null);
    const bestTaskDay = taskWeekdays.sort((left, right) => right.average - left.average)[0];

    if (bestTaskDay) {
      insights.push({
        detail: `You average ${roundPercent(bestTaskDay.average)}% task completion on ${bestTaskDay.weekday}.`,
        headline: `Your strongest task day is ${bestTaskDay.weekday}.`,
        tone: 'success',
        type: 'strong-day',
      });
    }

    const habitWeekdays = groupAverageByWeekday(
      combinedDays,
      'habitCompletionRate',
      (day) => day.habitTotal > 0,
    ).filter((item) => item.average !== null);
    const weakestHabitDay = habitWeekdays.sort((left, right) => left.average - right.average)[0];

    if (weakestHabitDay) {
      insights.push({
        detail: `${weakestHabitDay.weekday} is your lowest consistency day at ${roundPercent(weakestHabitDay.average)}%.`,
        headline: 'Weak spot in the week',
        tone: 'warning',
        type: 'weak-day',
      });
    }
  }

  const taskStreak = getTaskCompletionStreak(combinedDays);

  if (taskStreak > 0) {
    insights.push({
      detail: `You have completed tasks ${taskStreak} day${taskStreak === 1 ? '' : 's'} in a row.`,
      headline: 'Task momentum is active',
      tone: 'success',
      type: 'momentum',
    });
  }

  const habitAtRisk = [...habitInsights]
    .filter((habit) => habit.missedDaysInARow >= 3)
    .sort((left, right) => right.missedDaysInARow - left.missedDaysInARow)[0];

  if (habitAtRisk) {
    insights.push({
      detail: `${habitAtRisk.name} has been missed ${habitAtRisk.missedDaysInARow} days in a row.`,
      headline: 'Habit at risk',
      tone: 'danger',
      type: 'habit-risk',
    });
  }

  const recoveryInsight = getRecoveryInsight(combinedDays);

  if (recoveryInsight) {
    insights.push(recoveryInsight);
  }

  const milestone = habitInsights.find(
    (habit) => habit.currentStreak === habit.longestStreak && habit.currentStreak > 7,
  );

  if (milestone) {
    insights.push({
      detail: `${milestone.name} is on a ${milestone.currentStreak}-day run, your longest for that habit.`,
      headline: 'Longest run in progress',
      tone: 'success',
      type: 'milestone',
    });
  }

  if (focusSessions > 0) {
    insights.push({
      detail: `${focusSessions} focus session${focusSessions === 1 ? '' : 's'} logged today through the timer.`,
      headline: 'Focused work is visible',
      tone: 'success',
      type: 'focus',
    });
  }

  return {
    insights: insights.slice(0, 5),
    unlockProgress: trackedDays,
  };
}
