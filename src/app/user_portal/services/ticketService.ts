import type { TicketFormData, FeedbackFormData } from "../types";
import { useCreateUserTicket, useSubmitTicketFeedback } from "../useUserPortalApi";

export const useTicketService = () => {
  const createMutation = useCreateUserTicket();
  const feedbackMutation = useSubmitTicketFeedback();

  const createTicket = async (
    formData: FormData,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      await createMutation.mutateAsync(formData);
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error);
      }
      return { success: false, error };
    }
  };

  const submitFeedback = async (
    ticketId: string,
    feedback: FeedbackFormData,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      await feedbackMutation.mutateAsync({
        ticket_id: ticketId,
        ...feedback,
      });
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error);
      }
      return { success: false, error };
    }
  };

  return {
    createTicket,
    submitFeedback,
    isCreating: createMutation.isPending,
    isSubmittingFeedback: feedbackMutation.isPending,
  };
};
