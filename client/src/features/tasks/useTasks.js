import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeTask,
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from './taskApi.js';
import { taskQueryKeys } from './taskConstants.js';

function invalidateTaskDependents(queryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: taskQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['analytics'] }),
  ]);
}

export function useTasks(params) {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => listTasks(params),
    placeholderData: keepPreviousData,
  });
}

export function useTaskMutations() {
  const queryClient = useQueryClient();
  const onSuccess = () => invalidateTaskDependents(queryClient);

  return {
    createTask: useMutation({
      mutationFn: createTask,
      onSuccess,
    }),
    updateTask: useMutation({
      mutationFn: ({ taskId, values }) => updateTask(taskId, values),
      onSuccess,
    }),
    completeTask: useMutation({
      mutationFn: completeTask,
      onSuccess,
    }),
    deleteTask: useMutation({
      mutationFn: deleteTask,
      onSuccess,
    }),
  };
}
