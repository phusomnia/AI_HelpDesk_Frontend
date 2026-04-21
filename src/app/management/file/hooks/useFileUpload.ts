import { useRef, useState } from 'react';
import { Form } from 'antd';
import { useUploadFiles } from '../useFile';

export const useFileUploadForm = (onSuccess?: () => void) => {
  const [form] = Form.useForm();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFilesMutation = useUploadFiles();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== file));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (onCancel: () => void) => {
    if (selectedFiles.length === 0) return;

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      await uploadFilesMutation.mutateAsync(formData, {
        onSuccess: () => {
          form.resetFields();
          setSelectedFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          if (onSuccess) onSuccess();
          onCancel();
        },
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    form,
    selectedFiles,
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
    resetForm,
    isSubmitting: uploadFilesMutation.isPending,
  };
};
