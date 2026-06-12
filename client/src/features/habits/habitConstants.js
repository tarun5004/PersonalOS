import { rgbToHex } from '../../utils/colorValues.js';

export const HABIT_LIST_LIMIT = 50;
export const HABIT_NAME_MAX_LENGTH = 50;
export const HABIT_DESCRIPTION_MAX_LENGTH = 120;
export const HABIT_STREAK_DISMISS_KEY = 'pos-streak-dismissed';
export const DEFAULT_HABIT_COLOR = rgbToHex(29, 158, 117);
export const HABIT_COLOR_CHOICES = [
  { label: 'Teal', value: DEFAULT_HABIT_COLOR },
  { label: 'Amber', value: rgbToHex(214, 137, 16) },
  { label: 'Red', value: rgbToHex(192, 57, 43) },
  { label: 'Blue', value: rgbToHex(55, 138, 221) },
  { label: 'Violet', value: rgbToHex(127, 119, 221) },
  { label: 'Rose', value: rgbToHex(212, 83, 126) },
  { label: 'Olive', value: rgbToHex(99, 153, 34) },
  { label: 'Graphite', value: rgbToHex(136, 135, 128) },
];
export const HABIT_COLOR_OPTIONS = HABIT_COLOR_CHOICES.map(({ value }) => value);

export const habitQueryKeys = {
  all: ['habits'],
  list: (params = {}) => ['habits', 'list', params],
};
