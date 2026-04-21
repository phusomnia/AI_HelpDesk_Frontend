import { Column } from '@ant-design/charts';
import { Spin } from 'antd';
import type { TicketPriorityStats } from '../types';

interface TicketPriorityChartProps {
  data: TicketPriorityStats[] | undefined;
  loading: boolean;
}

export function TicketPriorityChart({ data, loading }: TicketPriorityChartProps) {
  if (loading || !data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const config = {
    data,
    xField: 'priority',
    yField: 'count',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      title: {
        text: 'Số lượng',
      },
    },
    tooltip: {
      fields: ['priority', 'count', 'percentage'],
    },
    color: '#722ed1',
  };

  return <Column {...config} height={280} />;
}

export default TicketPriorityChart;
