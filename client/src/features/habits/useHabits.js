import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  checkInHabit,
  createHabit,
  deleteHabit,
  listHabits,
  updateHabit,
} from './habitApi.js';
import { habitQueryKeys } from './habitConstants.js';

function invalidateHabitDependents(queryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: habitQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['analytics'] }),
  ]);
}

export function useHabits(params) {
  return useQuery({
    queryKey: habitQueryKeys.list(params),
    queryFn: () => listHabits(params),
    placeholderData: keepPreviousData,
  });
}

export function useHabitMutations() {
  const queryClient = useQueryClient();
  const onSuccess = () => invalidateHabitDependents(queryClient);

  return {
    createHabit: useMutation({
      mutationFn: createHabit,
      onSuccess,
    }),
    updateHabit: useMutation({
      mutationFn: ({ habitId, values }) => updateHabit(habitId, values),
      onSuccess,
    }),
    checkInHabit: useMutation({
      mutationFn: checkInHabit,
      onSuccess,
    }),
    deleteHabit: useMutation({
      mutationFn: deleteHabit,
      onSuccess,
    }),
  };
}
