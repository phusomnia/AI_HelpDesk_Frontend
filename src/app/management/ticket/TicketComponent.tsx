import React, { useEffect, useRef, useState } from 'react';
import { defaultParams, PUBLIC_API_BASE_URL } from "@/constants/constant.ts";
import { queryClient, useMutation, useQuery } from "@/lib/ReactQuery";
import {
  Input,
  Select,
  Table,
  Modal,
  Button,
  Form,
  DatePicker,
} from 'antd';
import { departmentColumns, ticketColumns } from './columns.tsx';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useCreateTicket, useDeleteTicket, useEditTicket, useTickets } from './useTickets.ts';
import { useDepartments } from './useDeparments.ts';
import { ManagementLayout } from '@/layouts/ManagementLayout.tsx';

export function TicketComponent() {
  return <>
    <ManagementLayout>
      <TicketClient />
    </ManagementLayout>
  </>
}

export function TicketClient() {
  const [globalParams, setGlobalParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  const [params, setParams] = useState({
    ...defaultParams(globalParams),
    department_name: globalParams.get('department_name') || '',
    status: globalParams.get('status') || '',
    category: globalParams.get('category') || '',
    priority: globalParams.get('priority') || '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [modalLoading, setModalLoading] = useState(false);

  const { data: tickets, isLoading: isLoadingTickets, error: errorTickets } = useTickets(params);
  const deleteTicketMutation = useDeleteTicket();

  if (isLoadingTickets) return <div>Loading...</div>;
  if (errorTickets) return <div>Error: {errorTickets.message}</div>;

  const columns: any = ticketColumns({
    tickets,
    setSelectedTicket,
    setModalVisible,
    setModalType,
    deleteTicketMutation,
    setParams,
    params
  });

  const handlePageChange = (page: any, page_size: any) => {
    const filteredParams = new URLSearchParams();
    for (let [key, value] of globalParams.entries()) {
      if (key !== 'page' && key !== 'page_size') {
        filteredParams.set(key, value);
      }
    }

    filteredParams.set('page', page);
    filteredParams.set('page_size', page_size);

    window.location.search = `?${filteredParams}`;
  };

  const handleAddTicket = () => {
    setSelectedTicket(null);
    setModalType('add');
    setModalVisible(true);
  };

  const handleSearch = () => {
    const newParams = {
      ...params,
      page: 1,
      page_size: Number(globalParams.get('page_size')) || 10
    };

    setParams(newParams);

    const filteredParams = new URLSearchParams();
    Object.entries(newParams).forEach(([key, val]) => {
      if (val) filteredParams.set(key, val.toString());
    });
    window.location.search = `?${filteredParams}`;
  };

  return (
    <>
      <div className='w-full'>
        <Button type="primary" onClick={handleAddTicket}>
          Thêm mới Ticket
        </Button>
        <div className=''>
          <Input
            placeholder="Tìm kiếm danh mục..."
            defaultValue={params.category || ''}
            onChange={(e) => setParams({ ...params, category: e.target.value })}
          />
          <Select
            id="department-select"
            allowClear
            placeholder="Phòng ban"
            defaultValue={params.department_name || null}
            onChange={(value) => setParams({ ...params, department_name: value })}
            options={[
              { value: 'Ki_thuat', label: 'Phòng kỹ thuật' },
              { value: 'Marketing', label: 'Phòng marketing' },
            ]}
          />
          <Select
            placeholder="Trạng thái"
            allowClear
            defaultValue={params.status || null}
            onChange={(value) => setParams({ ...params, status: value })}
            options={[
              { value: 'OPEN', label: 'Mở' },
              { value: 'CLOSED', label: 'Đóng' },
              { value: 'IN_PROGRESS', label: 'Đang xử lý' },
            ]}
          />
          <Select
            placeholder="Mức độ ưu tiên"
            allowClear
            defaultValue={params.priority || null}
            onChange={(value) => setParams({ ...params, priority: value })}
            options={[
              { value: 'LOW', label: 'Thấp' },
              { value: 'MEDIUM', label: 'Trung bình' },
              { value: 'HIGH', label: 'Cao' },
              { value: 'URGENT', label: 'Khẩn cấp' },
            ]}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              handleSearch();
            }}
          >
            Tìm kiếm
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={tickets?.data.content}
          rowKey="id"
          pagination={{
            current: tickets?.data.page_number,
            pageSize: tickets?.data.page_size,
            total: tickets?.data.total_elements,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showQuickJumper: true,
            showTotal: (total: any, range: any) =>
              `${range[0]}-${range[1]} trong ${total} mục`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          loading={isLoadingTickets}
        />

        <TicketModal
          type={modalType}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          selectedTicket={selectedTicket}
          loading={modalLoading}
        />
      </div>
    </>
  )
}

function TicketModal(props: any): any {
  const [form] = Form.useForm();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [currentAttachments, setCurrentAttachments] = useState<any[]>([]);
  // file
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createTicketMutation = useCreateTicket();
  const editTicketMutation = useEditTicket();
  //
  const { data: departments, isLoading: isLoadingDepartments, error: errorDepartments } = useDepartments();

  useEffect(() => {
    if (props.selectedTicket) {
      form.setFieldsValue({
        subject: props.selectedTicket.subject,
        category: props.selectedTicket.category,
        priority: props.selectedTicket.priority,
        description: props.selectedTicket.description,
        due_date: props.selectedTicket.due_date ? dayjs(props.selectedTicket.due_date) : null,
        department_id: props.selectedTicket.dept_id,
      });
      console.log(dayjs(props.selectedTicket.due_date))

      if (props.selectedTicket) {
        const attachments = JSON.parse(props.selectedTicket.attachment_url);
        setCurrentAttachments(attachments);
      } else {
        setCurrentAttachments([]);
      }

      setSelectedDepartmentId(props.selectedTicket.dept_id);
    } else {
      form.resetFields();
      setSelectedDepartmentId(null);
      setCurrentAttachments([]);
    }
  }, [props.selectedTicket, form]);

  if (isLoadingDepartments) return <div>Loading...</div>;
  if (errorDepartments) return <div>Error: {errorDepartments.message}</div>;

  console.log(departments)

  const columns: any = departmentColumns();

  const getModalProps = (type: string) => {
    switch (type) {
      case 'add':
        return {
          title: 'Thêm mới ticket',
          button: 'Thêm'
        }
      case 'view':
        return {
          title: 'Chi tiet Ticket'
        }
      case 'edit':
        return {
          title: 'Chỉnh sửa ticket',
          button: 'Cập nhật'
        }
    }
  }

  //
  // CRUD handle
  //
  const handleSubmit = async () => {
    try {
      let values = await form.validateFields();

      if (values.due_date) {
        values.due_date = values.due_date.format('YYYY-MM-DD HH:mm:ss');
      }

      if (props.type === 'add') {

        const payload_raw = { ...values, dept_id: selectedDepartmentId }
        console.log(payload_raw)

        const payload = new FormData();
        payload.append("ticket", JSON.stringify(payload_raw))
        selectedFiles.forEach((file) => {
          payload.append(`attachments`, file);
        });

        console.log(Object.fromEntries(payload));

        await createTicketMutation.mutateAsync(payload)
      }
      if (props.type === 'edit') {
        const payload_raw = { ...props.selectedTicket, ...values, attachment_url: JSON.stringify(currentAttachments) }

        console.log(payload_raw)

        const payload = new FormData();
        payload.append("ticket", JSON.stringify(payload_raw))
        selectedFiles.forEach((file) => {
          payload.append(`attachments`, file);
        });

        await editTicketMutation.mutateAsync(
          { id: props.selectedTicket.id, ticketData: payload },
          {
            onSuccess: () => {
              props.onCancel();
            }
          }
        )
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };


  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    console.log(files)

    files.forEach(file => {
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   setFilePreviews(prev => [...prev, e.target?.result as string]);
      // };
      // reader.readAsDataURL(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setFilePreviews(prev => [...prev, url]);
      }
    });

    setSelectedFiles(prev => [...prev, ...files]);
    console.log(selectedFiles, filePreviews)
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input
    }
  };

  const removeCurrentAttachment = (attachmentName: string) => {
    console.log('Remove current attachment:', attachmentName);
    const updatedAttachments = currentAttachments.filter(
      (item: any) => item.url.split('/').pop() !== attachmentName
    );
    setCurrentAttachments(updatedAttachments);
  };

  const renderExistingAttachments = () => {
    return (
      <div>
        {currentAttachments.map((item: any, index: number) => (
          <div key={index} className="attachment-item">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url.split('_').pop() || `File ${index + 1}`}
            </a>
            <button
              onClick={() => removeCurrentAttachment(item.url.split('/').pop())}
            >
              x
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <Modal
        title={getModalProps(props.type)?.title}
        open={props.visible}
        onCancel={props.onCancel}
        footer={[
          <Button key="cancel" onClick={props.onCancel}>
            Hủy
          </Button>,
          (props.type !== "view") && (
            <Button key="submit" type="primary" loading={props.loading} onClick={handleSubmit}>
              {getModalProps(props.type)?.button}
            </Button>
          )
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            priority: 'LOW',
            status: 'OPEN'
          }}
        >
          <Form.Item
            name="subject"
            label="Tiêu đề"
          // rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề ticket" />
          </Form.Item>
          {/*  */}
          <Form.Item
            name="category"
            label="Danh mục"
          // rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục"
              options={[
                {
                  label: 'Mức độ ưu tiên',
                  options: [
                    { label: 'Thấp', value: 'LOW' },
                    { label: 'Trung bình', value: 'MEDIUM' },
                    { label: 'Cao', value: 'HIGH' },
                    { label: 'Khẩn cấp', value: 'URGENT' },
                  ],
                },
              ]}
            >
            </Select>
          </Form.Item>

          {/* Priority */}
          <Form.Item
            name="priority"
            label="Mức độ ưu tiên"
          // rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
          >
            <Select placeholder="Chọn mức độ ưu tiên"
              options={[
                {
                  label: 'Mức độ ưu tiên',
                  options: [
                    { label: 'Thấp', value: 'LOW' },
                    { label: 'Trung bình', value: 'MEDIUM' },
                    { label: 'Cao', value: 'HIGH' },
                    { label: 'Khẩn cấp', value: 'URGENT' },
                  ],
                },
              ]}
            >
            </Select>
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label="Mô tả"
          // rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
          </Form.Item>

          {/* --- Due date --- */}
          <Form.Item
            name="due_date"
            label="Ngày hết hạn"
          // rules={[{ required: true, message: 'Vui long' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < dayjs().startOf('day')
              }
              placeholder="Chọn ngày và giờ"
            />
          </Form.Item>

          {/* --- Deparments --- */}
          <Form.Item label="Chọn phòng ban">
            <Table
              columns={columns}
              dataSource={departments?.data.content}
              rowKey="id"
              size="small"
              pagination={false}
              rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedDepartmentId ? [selectedDepartmentId] : [],
                onChange: (selectedRowKeys: React.Key[]) => {
                  const selectedId = selectedRowKeys[0] as string;
                  setSelectedDepartmentId(selectedId);
                  form.setFieldsValue({ department_id: selectedId });
                  console.log('Selected department ID:', selectedId);
                }
              }}
              loading={isLoadingDepartments}
            />
          </Form.Item>

          {/* FILE */}
          {props.type === 'edit' && (props.selectedTicket?.attachment_url) && (
            <div className="existing-attachments">
              {renderExistingAttachments()}
            </div>
          )}
          <div className='attachment'>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleSelectedFile}
              multiple
              accept="*"
              title="Chọn file để tải lên"
              className="sr-only"
            />
            <Button
              onChange={handleSelectedFile}
              onClick={() => {
                fileInputRef.current?.click()
                // console.log(filePreviews)
              }}
              type="dashed"
              block
            >
              Chọn file đính kèm
            </Button>
          </div>
          <div className='flex'>
            {filePreviews.length > 0 && (
              <div className="flex gap-2 p-2 overflow-x-auto">
                {filePreviews.map((file: any, idx: number) => (
                  <div key={idx} className="relative flex-shrink-0">
                    <img
                      className="w-10 h-10 object-cover rounded"
                      src={file}
                      alt=""
                    />
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
            {selectedFiles
              .filter(file => !file.type.startsWith("image/"))
              .map((file, index) => (
                <div key={index} className="relative flex-shrink-0 pt-2">
                  <div
                    className='w-20'
                    key={index}>
                    <div className='line-clamp-2 w-20 h-10 object-cover rounded border'>
                      {file.name}
                    </div>
                    <button
                      type='button'
                      onClick={() => removeFile(index)}
                      className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            {/* prview file: {filePreviews.length}
              selected file: {selectedFiles.length} */}
          </div>

        </Form>
      </Modal>
    </>
  )
}
