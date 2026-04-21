import { useMutation } from "@/lib/ReactQuery";
import { queryClient } from "@/lib/ReactQuery";
import { ChatService } from "../services/chatService";
import { logger } from "@/utils/logger";

const chatService = new ChatService();

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));
  const res = await fetch(chatService.STORAGE_URL.UPLOAD_FILES, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Lỗi upload file");
  let data = await res.json();
  logger.info('[uploadFiles] Upload success:', data);
  return data;
}

export function useFileUpload() {
  return useMutation({
    mutationFn: (files: File[]) => uploadFiles(files)
  }, queryClient);
}
