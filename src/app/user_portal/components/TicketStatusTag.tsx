import { Tag } from "antd";
import { STATUS_COLORS, STATUS_LABELS } from "../constants/ticketConstants";

interface TicketStatusTagProps {
  status: string;
}

export const TicketStatusTag = ({ status }: TicketStatusTagProps) => {
  return (
    <Tag color={STATUS_COLORS[status] || "default"}>
      {STATUS_LABELS[status] || status}
    </Tag>
  );
};
