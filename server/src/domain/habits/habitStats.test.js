import {
  buildHabitStats,
  calculateCompletionPercentage,
  calculateCurrentStreak,
  calculateLongestStreak,
  getCompletedDatesForMonth,
  getUtcMonthRange,
  startOfUtcDay,
  toUtcDateKey,
  toUtcMonthKey,
} from './habitStats.js';

describe('habit stats domain helpers', () => {
  test('normalizes dates to UTC day boundaries', () => {
    const date = new Date('2026-06-12T23:45:00.000Z');

    expect(startOfUtcDay(date).toISOString()).toBe('2026-06-12T00:00:00.000Z');
    expect(toUtcDateKey(date)).toBe('2026-06-12');
    expect(toUtcMonthKey(date)).toBe('2026-06');
  });

  test('calculates leap-year month length', () => {
    const range = getUtcMonthRange('2024-02');

    expect(range.start.toISOString()).toBe('2024-02-01T00:00:00.000Z');
    expect(range.end.toISOString()).toBe('2024-03-01T00:00:00.000Z');
    expect(range.totalDays).toBe(29);
  });

  test('preserves explicit years below 100 in UTC month ranges', () => {
    const range = getUtcMonthRange('0001-01');

    expect(range.start.getUTCFullYear()).toBe(1);
    expect(range.end.getUTCFullYear()).toBe(1);
    expect(range.totalDays).toBe(31);
  });

  test('current streak counts backward from the current UTC day', () => {
    const today = new Date('2026-06-12T14:00:00.000Z');
    const checkIns = [
      new Date('2026-06-10T00:00:00.000Z'),
      new Date('2026-06-11T00:00:00.000Z'),
      new Date('2026-06-12T00:00:00.000Z'),
    ];

    expect(calculateCurrentStreak(checkIns, today)).toBe(3);
  });

  test('current streak resets when today is missed', () => {
    const today = new Date('2026-06-12T14:00:00.000Z');
    const checkIns = [
      new Date('2026-06-10T00:00:00.000Z'),
      new Date('2026-06-11T00:00:00.000Z'),
    ];

    expect(calculateCurrentStreak(checkIns, today)).toBe(0);
  });

  test('longest streak finds the longest historical consecutive run', () => {
    const checkIns = [
      new Date('2026-06-01T00:00:00.000Z'),
      new Date('2026-06-02T00:00:00.000Z'),
      new Date('2026-06-04T00:00:00.000Z'),
      new Date('2026-06-05T00:00:00.000Z'),
      new Date('2026-06-06T00:00:00.000Z'),
    ];

    expect(calculateLongestStreak(checkIns)).toBe(3);
  });

  test('completion percentage uses total days in selected month', () => {
    const range = getUtcMonthRange('2026-06');
    const checkIns = [
      new Date('2026-06-11T00:00:00.000Z'),
      new Date('2026-06-12T00:00:00.000Z'),
      new Date('2026-07-01T00:00:00.000Z'),
    ];

    expect(getCompletedDatesForMonth(checkIns, range)).toEqual(['2026-06-11', '2026-06-12']);
    expect(calculateCompletionPercentage(checkIns, range)).toBe(6.67);
  });

  test('habit stats keep the V1 mid-month creation denominator limitation', () => {
    const stats = buildHabitStats([new Date('2026-06-20T00:00:00.000Z')], {
      monthKey: '2026-06',
      today: new Date('2026-06-20T10:00:00.000Z'),
    });

    expect(stats).toEqual({
      todayCompleted: true,
      currentStreak: 1,
      longestStreak: 1,
      completionPercentage: 3.33,
      completedDates: ['2026-06-20'],
      month: {
        key: '2026-06',
        totalDays: 30,
      },
    });
  });
});
