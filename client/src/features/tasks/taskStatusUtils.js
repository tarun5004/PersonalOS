import { TASK_STATUSES } from './taskConstants.js';

export function getNextTaskStatus(status) {
  const currentIndex = TASK_STATUSES.indexOf(status);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % TASK_STATUSES.length;

  return TASK_STATUSES[nextIndex];
}
