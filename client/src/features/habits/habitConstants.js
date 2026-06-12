export const HABIT_LIST_LIMIT = 50;
export const HABIT_NAME_MAX_LENGTH = 50;
export const HABIT_DESCRIPTION_MAX_LENGTH = 120;
export const HABIT_STREAK_DISMISS_KEY = 'pos-streak-dismissed';
export const DEFAULT_HABIT_COLOR = '#1D9E75';
export const HABIT_COLOR_CHOICES = [
  { label: 'Teal', value: DEFAULT_HABIT_COLOR },
  { label: 'Amber', value: '#D68910' },
  { label: 'Red', value: '#C0392B' },
  { label: 'Blue', value: '#378ADD' },
  { label: 'Violet', value: '#7F77DD' },
  { label: 'Rose', value: '#D4537E' },
  { label: 'Olive', value: '#639922' },
  { label: 'Graphite', value: '#888780' },
];
export const HABIT_COLOR_OPTIONS = HABIT_COLOR_CHOICES.map(({ value }) => value);

export const habitQueryKeys = {
  all: ['habits'],
  list: (params = {}) => ['habits', 'list', params],
};
