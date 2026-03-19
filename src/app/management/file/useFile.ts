import { queryClient, useMutation, useQuery } from "@/lib/ReactQuery";
import { PUBLIC_API_BASE_URL, STORAGE_TYPE } from "@/constants/constant";
import { notification } from "antd";

//
// 
//
async function fetchFiles(params: any) {
  console.log(params);

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });

  const response = await fetch(`${PUBLIC_API_BASE_URL}/storage/files?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
  return response.json();
}

//
// 
//
async function uploadAttachment(attachment_data: FormData) {
  console.log(attachment_data)
  const response = await fetch(`${PUBLIC_API_BASE_URL}/storage/files/upload`, {
    method: 'POST',
    body: attachment_data,
  });
  if (!response.ok) throw new Error("Lỗi khi upload file");
  return response.json();
}

async function deleteFile(props: any) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/storage/files/${props.id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error("Lỗi khi xoa file");
  return response.json();
}

//
//
//
export function useAttachments(params: any) {
  return useQuery(
    {
      queryKey: ["files"],
      queryFn: () => fetchFiles(params),
    },
    queryClient
  )
}

export function useUploadFiles() {
  return useMutation({
    mutationFn: uploadAttachment,
    onSuccess: (data: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      notification.success({
        description: data.message,
      });
      if (context?.onSuccess) {
        context.onSuccess();
      }
    },
    onError: (error: any) => {
      console.log(error.message)
      notification.error({
        description: error.message
      });
    },
  }, queryClient);
}

export function useDeleteFile() {
  return useMutation({
    mutationFn: deleteFile,
    onSuccess: (data: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      console.log(data)

      if (context?.onSuccess) {
        context.onSuccess();
      }
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi',
        description: error.message,
      });
    },
  }, queryClient);
}


