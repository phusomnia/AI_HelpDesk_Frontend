import { Card, Statistic, Row, Col, Badge } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  InboxOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useTicketStatusStats, useTicketPriorityStats, useTicketTimeStats } from '../hooks';
import { TicketStatusChart, TicketPriorityChart, TicketTimeChart } from '.';

export const DashboardStats = () => {
  const { data: statusStats, isLoading: statusLoading } = useTicketStatusStats();
  const { data: priorityStats, isLoading: priorityLoading } = useTicketPriorityStats();
  const { data: timeStats, isLoading: timeLoading } = useTicketTimeStats();

  const totalTickets = statusStats?.reduce((sum, item) => sum + item.count, 0) || 0;
  const resolvedTickets = statusStats?.find((s) => s.status === 'RESOLVED')?.count || 0;
  const closedTickets = statusStats?.find((s) => s.status === 'CLOSED')?.count || 0;
  const openTickets = statusStats?.find((s) => s.status === 'OPEN')?.count || 0;
  const inProgressTickets = statusStats?.find((s) => s.status === 'IN_PROGRESS')?.count || 0;

  const urgentTickets = priorityStats?.find((p) => p.priority === 'URGENT')?.count || 0;
  const highPriorityTickets = priorityStats?.find((p) => p.priority === 'HIGH')?.count || 0;

  const lastUpdated = new Date().toLocaleString('vi-VN');
  const anyLoading = statusLoading || priorityLoading || timeLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center gap-2 text-sm text-gray-500">
        <SyncOutlined spin={anyLoading} />
        <span>Cập nhật: {lastUpdated}</span>
        <Badge status="processing" text="Real-time" />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="bg-blue-50">
            <Statistic
              title="Tổng Ticket"
              value={totalTickets}
              prefix={<InboxOutlined />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="bg-green-50">
            <Statistic
              title="Đã Giải Quyết"
              value={resolvedTickets}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="bg-gray-50">
            <Statistic
              title="Không Giải Quyết"
              value={closedTickets}
              prefix={<CloseCircleOutlined />}
              styles={{ content: { color: '#8c8c8c' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="bg-yellow-50">
            <Statistic
              title="Đang Xử Lý"
              value={inProgressTickets + openTickets}
              prefix={<ClockCircleOutlined />}
              styles={{ content: { color: '#faad14' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="bg-red-50">
            <Statistic
              title="Ưu Tiên Cao"
              value={urgentTickets + highPriorityTickets}
              prefix={<ExclamationCircleOutlined />}
              styles={{ content: { color: '#ff4d4f' } }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân Bổ Trạng Thái Ticket" variant="outlined" className="shadow-sm">
            <TicketStatusChart data={statusStats} loading={statusLoading} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân Bổ Mức Độ Ưu Tiên" variant="outlined" className="shadow-sm">
            <TicketPriorityChart data={priorityStats} loading={priorityLoading} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Xu Hướng Ticket Theo Thời Gian" variant="outlined" className="shadow-sm">
            <TicketTimeChart data={timeStats} loading={timeLoading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStats;
