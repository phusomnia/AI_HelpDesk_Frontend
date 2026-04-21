import { useState } from "react";
import { Form, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { TicketFormData } from "../types";
import { useCreateUserTicket } from "../useUserPortalApi";

export const useTicketForm = (onSuccess?: () => void) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const createMutation = useCreateUserTicket();

  const handleCreate = async (customer_id?: string) => {
    try {
      const values = await form.validateFields();
      const ticketPayload: TicketFormData = {
        subject: values.subject,
        description: values.description,
        customer_id,
      };

      const formData = new FormData();
      formData.append("ticket", JSON.stringify(ticketPayload));
      files.forEach((file) => {
        if (file.originFileObj) {
          formData.append("attachments", file.originFileObj);
        }
      });

      await createMutation.mutateAsync(formData);
      
      message.success("Tạo ticket thành công");
      form.resetFields();
      setFiles([]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  const resetForm = () => {
    form.resetFields();
    setFiles([]);
  };

  return {
    form,
    files,
    setFiles,
    handleCreate,
    resetForm,
    isSubmitting: createMutation.isPending,
  };
};
