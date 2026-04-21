import { useState } from "react";
import { Form, message } from "antd";
import type { TicketRecord, FeedbackFormData } from "../types";
import { useSubmitTicketFeedback } from "../useUserPortalApi";

export const useTicketDetail = (onClose?: () => void) => {
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const [feedbackForm] = Form.useForm();
  const submitFeedbackMutation = useSubmitTicketFeedback();

  const openTicket = (ticket: TicketRecord) => {
    setSelectedTicket(ticket);
  };

  const closeTicket = () => {
    setSelectedTicket(null);
    feedbackForm.resetFields();
    if (onClose) {
      onClose();
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedTicket) return;

    try {
      const values = await feedbackForm.validateFields();
      const feedbackPayload: FeedbackFormData = {
        satisfaction_rating: values.satisfaction_rating,
        customer_feedback: values.customer_feedback,
      };

      await submitFeedbackMutation.mutateAsync({
        ticket_id: selectedTicket.id,
        ...feedbackPayload,
      });

      message.success("Gửi đánh giá thành công");
      feedbackForm.resetFields();
      closeTicket();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  return {
    selectedTicket,
    feedbackForm,
    openTicket,
    closeTicket,
    handleSubmitFeedback,
    isSubmittingFeedback: submitFeedbackMutation.isPending,
  };
};
