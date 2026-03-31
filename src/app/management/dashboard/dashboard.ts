// export interface TicketStats {
//   total: number;
//   open: number;
//   inProgress: number;
//   resolved: number;
//   closed: number;
//   avgResponseTime: number;
// }

// export interface TicketTrend {
//   date: string;
//   created: number;
//   resolved: number;
// }

// export interface ResponseTimeData {
//   range: string;
//   count: number;
// }

// export interface DashboardStats {
//   ticketStats: TicketStats;
//   ticketTrends: TicketTrend[];
//   responseTimeDistribution: ResponseTimeData[];
//   lastUpdated: string;
// }

// API Response Types for Dashboard Integration
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
