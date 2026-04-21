import { Select, Space } from "antd";
import { STATUS_OPTIONS } from "../constants/ticketConstants";

interface TicketFiltersProps {
  status: string | undefined;
  onStatusChange: (status: string | undefined) => void;
}

export const TicketFilters = ({ status, onStatusChange }: TicketFiltersProps) => {
  return (
    <Space wrap style={{ marginBottom: 12 }}>
      <Select
        allowClear
        placeholder="Trạng thái"
        value={status || undefined}
        onChange={onStatusChange}
        style={{ width: 180 }}
        options={STATUS_OPTIONS}
      />
    </Space>
  );
};
