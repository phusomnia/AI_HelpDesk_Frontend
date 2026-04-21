import { useQuery } from '@tanstack/react-query';
import { fetchTicketStatusStats, fetchTicketPriorityStats, fetchTicketTimeStats } from '../services';
import type { TicketStatusStats, TicketPriorityStats, TicketTimeStats } from '../types';
import { queryClient } from '@/lib/ReactQuery';
import { POLLING_INTERVAL } from '../constants/dashboardConstants';

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
