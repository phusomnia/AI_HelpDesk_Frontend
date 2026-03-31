// Transform ticket data by status
export function transformTicketStatus(tickets: any) {
  if (!tickets?.data?.content) return [];

  const counts: Record<string, number> = {};
  tickets.data.content.forEach((ticket: any) => {
    counts[ticket.status] = (counts[ticket.status] || 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

// Transform ticket data by priority
export function transformTicketPriority(tickets: any) {
  if (!tickets?.data?.content) return [];

  const counts: Record<string, number> = {};
  tickets.data.content.forEach((ticket: any) => {
    counts[ticket.priority] = (counts[ticket.priority] || 0) + 1;
  });

  return Object.entries(counts).map(([priority, count]) => ({ priority, count }));
}

// Transform file uploads by month
export function transformFileUploads(attachments: any) {
  if (!attachments?.data?.content) return [];

  const monthlyCounts: Record<string, number> = {};
  attachments.data.content.forEach((file: any) => {
    const date = new Date(file.created_at || file.created_at).toISOString().slice(0, 7);
    monthlyCounts[date] = (monthlyCounts[date] || 0) + 1;
  });

  return Object.entries(monthlyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

// Transform chat activity by hour
export function transformChatActivity(conversations: any) {
  if (!conversations?.length) return [];

  const hourlyCounts = Array(24).fill(0);
  conversations.forEach((conv: any) => {
    const hour = new Date(conv.timestamp).getHours();
    hourlyCounts[hour]++;
  });

  return hourlyCounts.map((count, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    count,
  }));
}