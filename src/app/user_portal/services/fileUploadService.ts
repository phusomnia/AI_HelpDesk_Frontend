import type { UploadFile } from "antd/es/upload/interface";
import type { TicketFormData } from "../types";

export const prepareTicketFormData = (
  ticketData: TicketFormData,
  files: UploadFile[]
): FormData => {
  const formData = new FormData();
  
  formData.append("ticket", JSON.stringify(ticketData));
  
  files.forEach((file) => {
    if (file.originFileObj) {
      formData.append("attachments", file.originFileObj);
    }
  });

  return formData;
};

export const validateFiles = (files: UploadFile[]): { valid: boolean; error?: string } => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  for (const file of files) {
    if (file.originFileObj) {
      if (file.originFileObj.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          error: `File ${file.name} quá kích thước (tối đa 10MB)`,
        };
      }

      if (!ALLOWED_TYPES.includes(file.originFileObj.type)) {
        return {
          valid: false,
          error: `File ${file.name} không được phép`,
        };
      }
    }
  }

  return { valid: true };
};
