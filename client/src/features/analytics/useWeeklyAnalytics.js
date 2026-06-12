import { useQuery } from '@tanstack/react-query';
import { getWeeklyAnalytics } from './analyticsApi.js';

export const analyticsQueryKeys = {
  all: ['analytics'],
  weekly: () => [...analyticsQueryKeys.all, 'weekly'],
};

export function useWeeklyAnalytics(options = {}) {
  return useQuery({
    queryKey: analyticsQueryKeys.weekly(),
    queryFn: getWeeklyAnalytics,
    ...options,
  });
}
