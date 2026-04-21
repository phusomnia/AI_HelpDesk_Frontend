import { useEffect } from 'react';
import { Button, Form, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useAttachmentStore } from '@/constants/constant';
import { AttachementHandler } from '../handler';
import { useFileUploadForm } from '../hooks';

interface AttachmentModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const AttachmentModal = ({ visible, onCancel }: AttachmentModalProps) => {
  const { labels } = useAttachmentStore();

  const {
    form,
    selectedFiles,
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useFileUploadForm();

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible, resetForm]);

  return (
    <Modal
      title={labels.upload}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={() => handleSubmit(onCancel)}
        >
          Upload
        </Button>,
      ]}
    >
      <Form form={form}>
        <Form.Item name="file" label="File" rules={[{ required: true, message: 'Please upload a file' }]}>
          <div className="attachment">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e)}
              multiple
              accept="*"
              title="Chọn file để tải lên"
              className="sr-only"
            />
            <Button
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              chọn file đính kèm
            </Button>
            <div className="preview-file flex gap-2">
              {selectedFiles.map((file: File, index) => (
                <div
                  key={index}
                  className="relative flex p-2 gap-2 items-center justify-center"
                >
                  {AttachementHandler.renderPreviewAttachment(file)}
                  <button
                    type="button"
                    onClick={() => {
                      AttachementHandler.handleRemoveSelectedAttachment(
                        fileInputRef,
                        file,
                        (setFiles: any) => {
                          const idx = selectedFiles.indexOf(file);
                          if (idx > -1) {
                            handleRemoveFile(file);
                          }
                        }
                      );
                    }}
                    className="absolute -top-[0px] -right-[0px] bg-[#6F6F6F] text-white rounded-full w-5 h-5 text-xs"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
