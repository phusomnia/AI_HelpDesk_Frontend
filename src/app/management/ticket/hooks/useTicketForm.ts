import { useRef, useState } from 'react';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { logger } from '@/utils/logger';
import { useCreateTicket, useEditTicket } from '../useTickets';
import type { CreateTicketRequest } from '../types';

export const useTicketForm = (onSuccess?: () => void) => {
  const [form] = Form.useForm();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createTicketMutation = useCreateTicket();
  const editTicketMutation = useEditTicket();

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreviews((prev) => [...prev, url]);
      }
    });

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitCreate = async () => {
    try {
      const values = await form.validateFields();

      let due_date = null;
      if (values.due_date && typeof values.due_date.format === 'function') {
        due_date = values.due_date.format('YYYY-MM-DDTHH:mm:ss');
      }

      const createTicketRequest: CreateTicketRequest = {
        subject: values.subject,
        description: values.description,
        category: values.category,
        priority: values.priority,
        dept_id: selectedDepartmentId || undefined,
        customer_id: values.customer_id,
        due_date,
      };

      logger.info(createTicketRequest);

      const payload = new FormData();
      payload.append('ticket', JSON.stringify(createTicketRequest));
      selectedFiles.forEach((file) => {
        payload.append('attachments', file);
      });

      await createTicketMutation.mutateAsync(payload, {
        onSuccess: () => {
          form.resetFields();
          setSelectedDepartmentId(null);
          setSelectedFiles([]);
          setFilePreviews([]);
          if (onSuccess) onSuccess();
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSubmitEdit = async (ticketId: string, selectedTicket: any) => {
    try {
      const values = await form.validateFields();

      let due_date = null;
      if (values.due_date && typeof values.due_date.format === 'function') {
        due_date = values.due_date.format('YYYY-MM-DDTHH:mm:ss');
      }

      const payload = {
        ...values,
        ...selectedTicket,
        dept_id: selectedDepartmentId || undefined,
        attachment_url: null,
        due_date,
      };
      delete payload.id;

      await editTicketMutation.mutateAsync(
        { id: ticketId, editTicketRequest: payload },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
          },
        }
      );
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setSelectedDepartmentId(null);
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  return {
    form,
    selectedDepartmentId,
    setSelectedDepartmentId,
    selectedFiles,
    filePreviews,
    fileInputRef,
    handleSelectedFile,
    removeFile,
    handleSubmitCreate,
    handleSubmitEdit,
    resetForm,
    isSubmitting: createTicketMutation.isPending || editTicketMutation.isPending,
  };
};
