import { HABIT_NAME_MAX_LENGTH, Habit } from './habit.model.js';
import { HabitCheckIn } from './habitCheckIn.model.js';

describe('habit models', () => {
  test('Habit uses the approved collection and owner index', () => {
    expect(Habit.collection.collectionName).toBe('habits');
    expect(Habit.schema.path('userId').options.index).toBe(true);
    expect(Habit.schema.path('name').options.maxLength).toBe(HABIT_NAME_MAX_LENGTH);
  });

  test('HabitCheckIn uses the approved collection and check-in indexes', () => {
    expect(HabitCheckIn.collection.collectionName).toBe('habit_check_ins');
    expect(HabitCheckIn.schema.indexes()).toEqual(
      expect.arrayContaining([
        [{ userId: 1, habitId: 1, date: 1 }, { unique: true }],
        [{ userId: 1, month: 1 }, {}],
      ]),
    );
  });
});
