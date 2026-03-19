import { FileTextOutlined } from "@ant-design/icons";
import { notification } from "antd";

export const AttachementHandler = {
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    selectedFiles: any,
    setSelectedFiles: any
  ) => {
    const files = e.target.files;
    if (!files) return;

    const currentFileCount = selectedFiles.length;
    const newFileCount = files.length;

    if (currentFileCount + newFileCount > 5) {
      notification.warning({
        message: 'Cảnh báo',
        description: `Chỉ được chọn tối đa 5 file`
      })
      return;
    }

    const validFiles = Array.from(files).filter(file => {
      const isDup = selectedFiles.some((exF: any) => exF.name === file.name && exF.size === file.size);

      if (isDup) return false;

      // const isValidType = file.type.startsWith("image/") || file.type === "application/pdf";
      const isValidSize = file.size <= 5 * 1024 * 1024;

      // if (!isValidType) {
      //   notification.error({
      //     message: 'Lỗi',
      //     description: 'File không hợp lệ',
      //   })
      // }

      if (!isValidSize) {
        notification.error({
          message: 'Lỗi',
          description: `File ${file.name} quá lớn. Tối đa 5MB.`
        });
      }

      return isValidSize;
    })

    setSelectedFiles((prev: any) => [...prev, ...validFiles]);
  },

  handleRemoveSelectedAttachment: (
    fileInputRef: any,
    selected_file: File,
    setSelectedFiles: (prev: any) => any
  ) => {
    setSelectedFiles((prev: any) => prev.filter((f: File) => f.name !== selected_file.name))

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  },

  renderPreviewAttachment: (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-[60px] h-[60px] object-cover rounded"
        />
      );
    } else {
      return (
        <div className="flex gap-2" >
          <div className="w-12 h-12 rounded-full bg-[#0D0D0D] flex items-center justify-center" >
            <FileTextOutlined
              style={
                {
                  fontSize: '24px',
                  color: '#F5F5F5',
                  WebkitTextStroke: '1px #000000'
                }
              }
            />
          </div>
          < div className='line-clamp-2 w-20 h-10 object-cover rounded' >
            {file.name}
          </div>
        </div>
      );
    }
  },

  handleSubmit: async (
    uploadFilesMutation: any,
    selectedFiles: any[],
    onSuccess?: () => void
  ) => {
    try {
      const payload = new FormData();
      for(let i = 0; i < selectedFiles.length; i++)
      {
        payload.append(`files`, selectedFiles[i])
      }

      await uploadFilesMutation.mutateAsync(payload, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        }
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }
}