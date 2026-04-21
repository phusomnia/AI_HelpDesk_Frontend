import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TicketRecord } from "../types";
import { TicketStatusTag } from "./TicketStatusTag";

interface TicketTableProps {
  tickets: TicketRecord[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
  onViewTicket: (ticket: TicketRecord) => void;
}

export const TicketTable = ({
  tickets,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewTicket,
}: TicketTableProps) => {
  const columns: ColumnsType<TicketRecord> = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Tiêu đề",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: string) => <TicketStatusTag status={value} />,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: unknown, record: TicketRecord) => (
        <Button type="link" onClick={() => onViewTicket(record)}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      loading={loading}
      dataSource={tickets}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} tickets`,
      }}
    />
  );
};
