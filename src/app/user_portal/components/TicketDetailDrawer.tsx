import { Divider, Drawer, Form, Input, Rate, Space, Tag } from "antd";
import type { FormInstance } from "antd/es/form";
import type { TicketRecord } from "../types";
import { STATUS_COLORS } from "../constants/ticketConstants";
import { parseAttachmentUrls, getFileNameFromUrl } from "../utils/formatters";

interface TicketDetailDrawerProps {
  open: boolean;
  ticket: TicketRecord | null;
  feedbackForm: FormInstance;
  isSubmittingFeedback: boolean;
  onSubmitFeedback: () => void;
  onClose: () => void;
}

export const TicketDetailDrawer = ({
  open,
  ticket,
  feedbackForm,
  isSubmittingFeedback,
  onSubmitFeedback,
  onClose,
}: TicketDetailDrawerProps) => {
  if (!ticket) return null;

  const attachmentUrls = parseAttachmentUrls(ticket.attachment_url);

  return (
    <Drawer
      title={`Ticket #${ticket.id}`}
      open={open}
      onClose={onClose}
      width={520}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <div>
          <strong>Tiêu đề:</strong> {ticket.subject}
        </div>
        <div>
          <strong>Mô tả:</strong> {ticket.description}
        </div>
        <div>
          <strong>Trạng thái:</strong>{" "}
          <Tag color={STATUS_COLORS[ticket.status] || "default"}>{ticket.status}</Tag>
        </div>

        {attachmentUrls.length > 0 && (
          <div>
            <strong>Tệp đính kèm:</strong>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              {attachmentUrls.map((url: string, i: number) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {getFileNameFromUrl(url)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {ticket.status === "RESOLVED" && (
          <>
            <Divider />
            {ticket.satisfaction_rating ? (
              <div>
                <div>
                  <strong>Đánh giá dịch vụ:</strong>
                  <div style={{ marginTop: 8 }}>
                    <Rate value={ticket.satisfaction_rating} disabled />
                  </div>
                </div>
                {ticket.customer_feedback && (
                  <div style={{ marginTop: 12 }}>
                    <strong>Nhận xét:</strong>
                    <p style={{ marginTop: 4, color: "#666" }}>
                      {ticket.customer_feedback}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Form form={feedbackForm} layout="vertical">
                <Form.Item
                  name="satisfaction_rating"
                  label="Đánh giá dịch vụ"
                  rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá" }]}
                >
                  <Rate disabled={isSubmittingFeedback} />
                </Form.Item>
                <Form.Item name="customer_feedback" label="Nhận xét">
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập nhận xét của bạn (không bắt buộc)"
                    disabled={isSubmittingFeedback}
                  />
                </Form.Item>
                <Form.Item>
                  <button
                    type="button"
                    onClick={onSubmitFeedback}
                    disabled={isSubmittingFeedback}
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      background: isSubmittingFeedback ? "#d9d9d9" : "#1890ff",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: isSubmittingFeedback ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmittingFeedback ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </Form.Item>
              </Form>
            )}
          </>
        )}
      </Space>
    </Drawer>
  );
};
