import { PUBLIC_API_BASE_URL } from '@/constants/constant';
import type { TicketStatusStats, TicketPriorityStats, TicketTimeStats, DashboardApiResponse } from '../types';
import { logger } from '@/utils/logger';

const API_BASE_URL = PUBLIC_API_BASE_URL || '/api';

export const fetchTicketStatusStats = async (): Promise<TicketStatusStats[]> => {
  const response = await fetch(`${API_BASE_URL}/tickets/dashboard/status`);
  if (!response.ok) throw new Error('Failed to fetch ticket status stats');
  const result: DashboardApiResponse<TicketStatusStats[]> = await response.json();
  return result.data;
};

export const fetchTicketPriorityStats = async (): Promise<TicketPriorityStats[]> => {
  const response = await fetch(`${API_BASE_URL}/tickets/dashboard/priority`);
  if (!response.ok) throw new Error('Failed to fetch ticket priority stats');
  const result = await response.json();

  logger.info(result);

  return result.data;
};

export const fetchTicketTimeStats = async (year?: number, month?: number): Promise<TicketTimeStats[]> => {
  const params = new URLSearchParams();
  if (year) params.append('year', year.toString());
  if (month) params.append('month', month.toString());

  const url = `${API_BASE_URL}/tickets/dashboard/time${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch ticket time stats');

  const result = await response.json();

  logger.info(result);

  return result.data;
};
