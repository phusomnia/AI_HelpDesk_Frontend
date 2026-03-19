import { queryClient, useMutation, useQuery } from "@/lib/ReactQuery";
import { PUBLIC_API_BASE_URL } from "@/constants/constant";
import { notification } from "antd";

// GET
async function fetchTickets(params: any) {
    console.log(params);

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });

  const response = await fetch(
    `${PUBLIC_API_BASE_URL}/tickets?${queryParams.toString()}`
  );
  if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
  return response.json();
}
// POST
async function createTicket(ticketData: FormData) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/tickets/form`, {
    method: 'POST',
    body: ticketData,
  });
  if (!response.ok) throw new Error("Lỗi khi tạo ticket");
  return response.json();
}
// EDIT
async function editTicket(props: any) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/tickets/form/${props.id}`, {
    method: 'PUT',
    body: props.ticketData,
  });
  if (!response.ok) throw new Error("Lỗi khi tạo ticket");
  return response.json();
}
// DELETE
async function deleteTicket(props: any) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/tickets/${props.id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error("Lỗi khi tạo ticket");
  return response.json();
}

// 
export function useTickets(params: any) {
  return useQuery(
    {
      queryKey: ["tickets"],
      queryFn: () => fetchTickets(params),
    },
    queryClient
  )
}
//
export function useCreateTicket() {
  return useMutation({
    mutationFn: createTicket,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      console.log(data)
      notification.success({
        message: 'Thành công',
        description: 'Ticket đã được tạo thành công!',
      });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo ticket',
      });
    },
  }, queryClient);
}
//
export function useEditTicket() {
  return useMutation({
    mutationFn: editTicket,
    onSuccess: (data: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      console.log(data)
      notification.success({
        description: data.message,
      });

      if (context?.onSuccess) {
        context.onSuccess();
      }
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo ticket',
      });
    },
  }, queryClient);
}
//
export function useDeleteTicket() {
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: (data: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      console.log(data)

      if (context?.onSuccess) {
        context.onSuccess();
      }
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo ticket',
      });
    },
  }, queryClient);
}