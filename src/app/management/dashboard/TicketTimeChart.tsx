import { Line } from '@ant-design/charts';
import { Spin } from 'antd';
import type { TicketTimeStats } from '@/app/management/dashboard/dashboard';

interface TicketTimeChartProps {
  data: TicketTimeStats[] | undefined;
  loading: boolean;
}

export function TicketTimeChart({ data, loading }: TicketTimeChartProps) {
  if (loading || !data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Transform data for dual line chart
  const transformedData = data.flatMap((item) => [
    { month: item.month, value: item.total_tickets, type: 'Tổng số' },
    { month: item.month, value: item.resolved_tickets, type: 'Đã giải quyết' },
    { month: item.month, value: item.processed_tickets, type: 'Đã xử lý' },
  ]);

  const config = {
    data: transformedData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    point: {
      size: 4,
      shape: 'circle',
    },
    lineStyle: {
      lineWidth: 3,
    },
    legend: {
      position: 'top' as const,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Số lượng ticket',
      },
    },
    tooltip: {
      shared: true,
      showCrosshairs: true,
    },
    color: ['#1890ff', '#52c41a', '#faad14'],
  };

  return <Line {...config} height={280} />;
}

export default TicketTimeChart;
