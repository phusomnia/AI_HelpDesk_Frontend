import { Button, Drawer, Form, Input, Space, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { FormInstance } from "antd/es/form";
import { MAX_SUBJECT_LENGTH } from "../constants/ticketConstants";

interface CreateTicketDrawerProps {
  open: boolean;
  form: FormInstance;
  files: UploadFile[];
  setFiles: (files: UploadFile[]) => void;
  isSubmitting: boolean;
  onCreate: () => void;
  onClose: () => void;
}

export const CreateTicketDrawer = ({
  open,
  form,
  files,
  setFiles,
  isSubmitting,
  onCreate,
  onClose,
}: CreateTicketDrawerProps) => {
  return (
    <Drawer
      title="Tạo ticket"
      open={open}
      onClose={onClose}
      width={520}
      extra={
        <Space>
          <Button onClick={onClose}>Huỷ</Button>
          <Button type="primary" loading={isSubmitting} onClick={onCreate}>
            Tạo
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="subject" 
          label="Tiêu đề" 
          rules={[{ required: true, message: "Nhập tiêu đề" }]}
        >
          <Input maxLength={MAX_SUBJECT_LENGTH} showCount />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Tệp đính kèm">
          <Upload
            multiple
            beforeUpload={() => false}
            fileList={files}
            onChange={({ fileList }) => setFiles(fileList)}
          >
            <Button>Chọn file</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
