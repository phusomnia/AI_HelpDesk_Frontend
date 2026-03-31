import { PUBLIC_API_BASE_URL } from '@/constants/constant';
import type { TicketStatusStats, TicketPriorityStats, TicketTimeStats, DashboardApiResponse } from '@/app/management/dashboard/dashboard';
import { logger } from '@/utils/logger';

const API_BASE_URL = PUBLIC_API_BASE_URL || '/api';

export const fetchTicketStatusStats = async (): Promise<TicketStatusStats[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/dashboard/status`);
    if (!response.ok) throw new Error('Failed to fetch ticket status stats');
    const result: DashboardApiResponse<TicketStatusStats[]> = await response.json();
    return result.data;
  } catch (error) {
    // Return mock data if API is not available
    logger.warn('API not available, using mock status data');
    return [
      { status: 'OPEN', count: 15, percentage: 30.0 },
      { status: 'RESOLVED', count: 25, percentage: 50.0 },
      { status: 'IN_PROGRESS', count: 7, percentage: 14.0 },
      { status: 'CLOSED', count: 3, percentage: 6.0 },
    ];
  }
};

export const fetchTicketPriorityStats = async (): Promise<TicketPriorityStats[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/dashboard/priority`);
    if (!response.ok) throw new Error('Failed to fetch ticket priority stats');
    let result = await response.json();

    logger.info(result)

    return result.data
  } catch (error) {
    logger.warn('API not available, using mock priority data');
    return [
      { priority: 'HIGH', count: 12, percentage: 24.0 },
      { priority: 'MEDIUM', count: 25, percentage: 50.0 },
      { priority: 'LOW', count: 8, percentage: 16.0 },
      { priority: 'URGENT', count: 5, percentage: 10.0 },
    ];
  }
};

export const fetchTicketTimeStats = async (
  year?: number,
  month?: number
): Promise<TicketTimeStats[]> => {
  try {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    const url = `${API_BASE_URL}/tickets/dashboard/time${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch ticket time stats');

    let result = await response.json();

    logger.info(result)

    return result.data
  } catch (error) {
    logger.warn('API not available, using mock time data');
    return [
      {
        month: '2025-03',
        total_tickets: 45,
        resolved_tickets: 20,
        closed_tickets: 8,
        processed_tickets: 28,
        processed_percentage: 62.22,
      },
      {
        month: '2025-02',
        total_tickets: 38,
        resolved_tickets: 15,
        closed_tickets: 10,
        processed_tickets: 25,
        processed_percentage: 65.79,
      },
    ];
  }
};
