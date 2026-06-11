const DAY_IN_MS = 24 * 60 * 60 * 1000;

function pad(value) {
  return String(value).padStart(2, '0');
}

export function startOfUtcDay(value = new Date()) {
  const date = new Date(value);

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function addUtcDays(value, days) {
  return new Date(startOfUtcDay(value).getTime() + days * DAY_IN_MS);
}

export function toUtcDateKey(value) {
  const date = startOfUtcDay(value);

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function toUtcMonthKey(value = new Date()) {
  const date = new Date(value);

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

export function getUtcMonthRange(monthKey = toUtcMonthKey()) {
  const [yearValue, monthValue] = monthKey.split('-').map(Number);
  const monthIndex = monthValue - 1;
  const start = new Date(Date.UTC(0, monthIndex, 1));
  const end = new Date(Date.UTC(0, monthIndex + 1, 1));

  start.setUTCFullYear(yearValue);
  end.setUTCFullYear(monthIndex === 11 ? yearValue + 1 : yearValue);

  const totalDays = Math.round((end.getTime() - start.getTime()) / DAY_IN_MS);

  return {
    key: monthKey,
    start,
    end,
    totalDays,
  };
}

export function calculateCurrentStreak(checkInDates, today = new Date()) {
  const completedDays = new Set(checkInDates.map(toUtcDateKey));
  let cursor = startOfUtcDay(today);
  let streak = 0;

  while (completedDays.has(toUtcDateKey(cursor))) {
    streak += 1;
    cursor = addUtcDays(cursor, -1);
  }

  return streak;
}

export function calculateLongestStreak(checkInDates) {
  const sortedTimes = [...new Set(checkInDates.map((date) => startOfUtcDay(date).getTime()))].sort(
    (left, right) => left - right,
  );

  let longest = 0;
  let current = 0;
  let previousTime;

  for (const time of sortedTimes) {
    current = previousTime !== undefined && time - previousTime === DAY_IN_MS ? current + 1 : 1;
    longest = Math.max(longest, current);
    previousTime = time;
  }

  return longest;
}

export function getCompletedDatesForMonth(checkInDates, monthRange) {
  return [...new Set(
    checkInDates
      .filter((date) => {
        const day = startOfUtcDay(date);
        return day >= monthRange.start && day < monthRange.end;
      })
      .map(toUtcDateKey),
  )].sort();
}

export function calculateCompletionPercentage(checkInDates, monthRange) {
  const completedDates = getCompletedDatesForMonth(checkInDates, monthRange);

  if (monthRange.totalDays === 0) {
    return 0;
  }

  return Number(((completedDates.length / monthRange.totalDays) * 100).toFixed(2));
}

export function buildHabitStats(
  checkInDates,
  { monthKey, today = new Date(), monthCheckInDates = checkInDates } = {},
) {
  const monthRange = getUtcMonthRange(monthKey || toUtcMonthKey(today));
  const completedDates = getCompletedDatesForMonth(monthCheckInDates, monthRange);

  return {
    todayCompleted: checkInDates.some((date) => toUtcDateKey(date) === toUtcDateKey(today)),
    currentStreak: calculateCurrentStreak(checkInDates, today),
    longestStreak: calculateLongestStreak(checkInDates),
    completionPercentage: calculateCompletionPercentage(monthCheckInDates, monthRange),
    completedDates,
    month: {
      key: monthRange.key,
      totalDays: monthRange.totalDays,
    },
  };
}
