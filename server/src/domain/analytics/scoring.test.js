import {
  calculateCompletionRate,
  calculateProductivityScore,
  roundPercentage,
} from './scoring.js';

describe('analytics scoring', () => {
  test('rounds percentages to two decimal places', () => {
    expect(roundPercentage(33.3333)).toBe(33.33);
    expect(roundPercentage(66.6666)).toBe(66.67);
  });

  test('calculates completion rates', () => {
    expect(calculateCompletionRate(1, 3)).toBe(33.33);
    expect(calculateCompletionRate(0, 0)).toBe(0);
  });

  test('returns null when neither tasks nor habits exist', () => {
    expect(
      calculateProductivityScore({
        taskCompletionRate: 0,
        taskTotal: 0,
        habitCompletionRate: 0,
        habitTotal: 0,
      }),
    ).toBeNull();
  });

  test('uses task rate when only tasks exist', () => {
    expect(
      calculateProductivityScore({
        taskCompletionRate: 75,
        taskTotal: 4,
        habitCompletionRate: 0,
        habitTotal: 0,
      }),
    ).toBe(75);
  });

  test('uses habit rate when only habits exist', () => {
    expect(
      calculateProductivityScore({
        taskCompletionRate: 0,
        taskTotal: 0,
        habitCompletionRate: 50,
        habitTotal: 2,
      }),
    ).toBe(50);
  });

  test('uses weighted average when both tasks and habits exist', () => {
    expect(
      calculateProductivityScore({
        taskCompletionRate: 66.67,
        taskTotal: 3,
        habitCompletionRate: 50,
        habitTotal: 2,
      }),
    ).toBe(58.34);
  });
});
