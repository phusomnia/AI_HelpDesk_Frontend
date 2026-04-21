import { Pie } from '@ant-design/charts';
import { Spin } from 'antd';
import type { TicketStatusStats } from '../types';

interface TicketStatusChartProps {
  data: TicketStatusStats[] | undefined;
  loading: boolean;
}

export const TicketStatusChart = ({ data, loading }: TicketStatusChartProps) => {
  if (loading || !data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const config = {
    data,
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    tooltip: {
      showMarkers: true,
      fields: ['status', 'count', 'percentage'],
    },
    legend: {
      position: 'bottom' as const,
    },
  };

  return <Pie {...config} height={280} />;
};

export default TicketStatusChart;
