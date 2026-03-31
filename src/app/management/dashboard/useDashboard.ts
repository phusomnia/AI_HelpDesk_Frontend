import { useQuery } from '@tanstack/react-query';
import {
  fetchTicketStatusStats,
  fetchTicketPriorityStats,
  fetchTicketTimeStats,
} from '@/app/management/dashboard/dashboardApi';
import type { TicketStatusStats, TicketPriorityStats, TicketTimeStats } from '@/app/management/dashboard/dashboard';
import { queryClient } from '@/lib/ReactQuery';

const POLLING_INTERVAL = 30000; 

export const useTicketStatusStats = (enabled = true) => {
  return useQuery<TicketStatusStats[], Error>({
    queryKey: ['dashboard', 'statusStats'],
    queryFn: fetchTicketStatusStats,
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    enabled,
  }, queryClient);
};

export const useTicketPriorityStats = (enabled = true) => {
  return useQuery<TicketPriorityStats[], Error>({
    queryKey: ['dashboard', 'priorityStats'],
    queryFn: fetchTicketPriorityStats,
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    enabled,
  }, queryClient);
};

export const useTicketTimeStats = (year?: number, month?: number, enabled = true) => {
  return useQuery<TicketTimeStats[], Error>({
    queryKey: ['dashboard', 'timeStats', year, month],
    queryFn: () => fetchTicketTimeStats(year, month),
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    enabled,
  }, queryClient);
};
