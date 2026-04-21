import type { CreateTicketRequest, EditTicketRequest } from '../types';
import { useCreateTicket, useEditTicket } from '../useTickets';

export const useTicketService = () => {
  const createMutation = useCreateTicket();
  const editMutation = useEditTicket();

  const createTicket = async (
    formData: FormData,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      await createMutation.mutateAsync(formData, { onSuccess });
      return { success: true };
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error);
      }
      return { success: false, error };
    }
  };

  const editTicket = async (
    id: string,
    data: EditTicketRequest,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      await editMutation.mutateAsync({ id, editTicketRequest: data }, { onSuccess });
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
    editTicket,
    isCreating: createMutation.isPending,
    isEditing: editMutation.isPending,
  };
};
