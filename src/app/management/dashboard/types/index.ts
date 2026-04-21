export interface TicketStatusStats {
  status: string;
  count: number;
  percentage: number;
}

export interface TicketPriorityStats {
  priority: string;
  count: number;
  percentage: number;
}

export interface TicketTimeStats {
  month: string;
  total_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  processed_tickets: number;
  processed_percentage: number;
}

export interface DashboardApiResponse<T> {
  message: string;
  status_code: number;
  data: T;
}
