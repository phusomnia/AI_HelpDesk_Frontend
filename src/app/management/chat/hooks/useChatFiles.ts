import { useState, useCallback } from 'react';
import { message } from 'antd';
import { MAX_FILE_SIZE } from '../constants/chatConstants';

export const useChatFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    setFiles((prevFiles) => {
      const existingKeys = new Set(prevFiles.map((file: File) => `${file.name}_${file.size}_${file.lastModified}`));
      const newFiles: File[] = [];

      selected.forEach((file) => {
        const key = `${file.name}_${file.size}_${file.lastModified}`;

        if (file.size > MAX_FILE_SIZE) {
          message.error(`File "${file.name}" vượt quá 5MB`);
          return;
        }

        if (existingKeys.has(key)) {
          return;
        }

        existingKeys.add(key);
        newFiles.push(file);

        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setPreviews((prev) => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });

      return [...prevFiles, ...newFiles];
    });

    e.target.value = '';
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const resetFiles = useCallback(() => {
    setFiles([]);
    setPreviews([]);
  }, []);

  return {
    files,
    previews,
    handleFile,
    removeFile,
    resetFiles,
  };
};
