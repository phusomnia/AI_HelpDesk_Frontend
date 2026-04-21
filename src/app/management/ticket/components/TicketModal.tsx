import { useEffect } from 'react';
import { Modal, Button, Form, Input, Select, DatePicker } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { MODAL_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS, type ModalType } from '../constants/ticketConstants';
import type { TicketRecord } from '../types';
import { useTicketForm } from '../hooks';
import { useDepartments } from '../useDeparments';
import { DepartmentSelector } from './DepartmentSelector';

interface TicketModalProps {
  type: ModalType;
  visible: boolean;
  selectedTicket: TicketRecord | null | undefined;
  onCancel: () => void;
}

export const TicketModal = ({ type, visible, selectedTicket, onCancel }: TicketModalProps) => {
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();

  const {
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
    isSubmitting,
  } = useTicketForm(onCancel);

  useEffect(() => {
    if (selectedTicket) {
      form.setFieldsValue({
        subject: selectedTicket.subject,
        category: selectedTicket.category,
        priority: selectedTicket.priority,
        description: selectedTicket.description,
        due_date: selectedTicket.due_date ? dayjs(selectedTicket.due_date) : null,
        department_id: selectedTicket.dept_id,
      });

      setSelectedDepartmentId(selectedTicket.dept_id || null);
    } else {
      form.resetFields();
      setSelectedDepartmentId(null);
    }
  }, [selectedTicket, form]);

  const handleSubmit = async () => {
    if (type === MODAL_TYPES.ADD) {
      await handleSubmitCreate();
    } else if (type === MODAL_TYPES.EDIT && selectedTicket) {
      await handleSubmitEdit(selectedTicket.id, selectedTicket);
    }
  };

  const getModalProps = (modalType: ModalType) => {
    switch (modalType) {
      case MODAL_TYPES.ADD:
        return {
          title: 'Thêm mới ticket',
          button: 'Thêm',
        };
      case MODAL_TYPES.VIEW:
        return {
          title: 'Chi tiết Ticket',
        };
      case MODAL_TYPES.EDIT:
        return {
          title: 'Chỉnh sửa ticket',
          button: 'Cập nhật',
        };
    }
  };

  const modalProps = getModalProps(type) || { title: '', button: '' };

  return (
    <Modal
      title={modalProps.title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        type !== MODAL_TYPES.VIEW && (
          <Button key="submit" type="primary" loading={isSubmitting} onClick={handleSubmit}>
            {modalProps.button}
          </Button>
        ),
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priority: 'LOW',
          status: 'OPEN',
        }}
      >
        <Form.Item name="subject" label="Tiêu đề">
          <Input placeholder="Nhập tiêu đề ticket" readOnly={type === MODAL_TYPES.VIEW} />
        </Form.Item>

        <Form.Item name="category" label="Danh mục">
          <Input placeholder="Nhập danh mục" readOnly={type === MODAL_TYPES.VIEW} />
        </Form.Item>

        {type === MODAL_TYPES.EDIT && (
          <Form.Item name="status" label="Trạng thái">
            <Select
              placeholder="Chọn trạng thái"
              options={STATUS_OPTIONS}
            />
          </Form.Item>
        )}

        <Form.Item name="priority" label="Mức độ ưu tiên">
          <Select
            placeholder="Chọn mức độ ưu tiên"
            options={[
              {
                label: 'Mức độ ưu tiên',
                options: PRIORITY_OPTIONS,
              },
            ]}
            disabled={type === MODAL_TYPES.VIEW}
          />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết" readOnly={type === MODAL_TYPES.VIEW} />
        </Form.Item>

        <Form.Item name="due_date" label="Ngày hết hạn">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            placeholder="Chọn ngày và giờ"
            disabled={type === MODAL_TYPES.VIEW}
          />
        </Form.Item>

        {type === MODAL_TYPES.VIEW ? (
          <Form.Item label="Phòng ban">
            {departments?.data?.content?.find((d: any) => d.id === selectedTicket?.dept_id)?.name || 'N/A'}
          </Form.Item>
        ) : (
          <Form.Item label="Chọn phòng ban">
            <DepartmentSelector
              departments={departments?.data?.content || []}
              selectedDepartmentId={selectedDepartmentId}
              onSelect={setSelectedDepartmentId}
              loading={isLoadingDepartments}
            />
          </Form.Item>
        )}

        {filePreviews.length > 0 && (
          <div className="flex gap-2 p-2 overflow-x-auto">
            {filePreviews.map((file, idx) => (
              <div key={idx} className="relative flex-shrink-0">
                <img className="w-10 h-10 object-cover rounded" src={file} alt="" />
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Form>
    </Modal>
  );
};
