export const TASK_STATUSES = ['Todo', 'In Progress', 'Completed'];
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];
export const TASK_LIST_LIMIT = 50;
export const TASK_VIEW_MODES = {
  BOARD: 'board',
  LIST: 'list',
};

export const TASK_FILTERS = ['All', ...TASK_STATUSES];

export const taskQueryKeys = {
  all: ['tasks'],
  lists: () => [...taskQueryKeys.all, 'list'],
  list: (params) => [...taskQueryKeys.lists(), params],
};
