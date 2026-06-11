export const HABIT_LIST_LIMIT = 50;
export const HABIT_NAME_MAX_LENGTH = 120;

export const habitQueryKeys = {
  all: ['habits'],
  list: (params = {}) => ['habits', 'list', params],
};
