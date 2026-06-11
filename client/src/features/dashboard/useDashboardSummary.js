import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from './dashboardApi.js';

export const dashboardQueryKeys = {
  all: ['dashboard'],
  summary: () => [...dashboardQueryKeys.all, 'summary'],
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardQueryKeys.summary(),
    queryFn: getDashboardSummary,
  });
}
