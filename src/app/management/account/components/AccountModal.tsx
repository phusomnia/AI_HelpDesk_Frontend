import React, { useState, useCallback } from 'react';
import { Input, Select, Table, Modal, Button, Form, Popconfirm, Space } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import type { Account, Department, CreateAccountRequest, UpdateAccountRequest } from '../types';
import { MODAL_WIDTH, ROLE_OPTIONS } from '../constants/accountConstants';
import { useCreateAccount, useUpdateAccount, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '../hooks';
import { useDepartments } from '../../ticket/useDeparments';
import { logger } from '@/utils/logger';

interface AccountModalProps {
  type: 'add' | 'edit';
  visible: boolean;
  onCancel: () => void;
  selectedAccount: Account | null;
}

export function AccountModal(props: AccountModalProps) {
  const [form] = Form.useForm();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string>('CUSTOMER');

  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [editingDeptName, setEditingDeptName] = useState<string>('');
  const [isAddingDept, setIsAddingDept] = useState<boolean>(false);
  const [newDeptName, setNewDeptName] = useState<string>('');

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const { data: departments, isLoading: isLoadingDepartments, refetch: refetchDepartments } = useDepartments();

  const createDeptMutation = useCreateDepartment();
  const updateDeptMutation = useUpdateDepartment();
  const deleteDeptMutation = useDeleteDepartment();

  const handleRoleChange = useCallback((value: string) => {
    setCurrentRole(value);
    if (value === 'CUSTOMER' || value === 'ADMIN') {
      setSelectedDepartmentId(null);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (props.type === 'add') {
        const data: CreateAccountRequest = {
          username: values.username,
          password: values.password,
          email: values.email,
          role: values.role,
          department_id: selectedDepartmentId || undefined,
        };

        logger.info(data);

        await createAccountMutation.mutateAsync(data, {
          onSuccess: () => props.onCancel(),
        });
      }

      if (props.type === 'edit' && props.selectedAccount) {
        const data: UpdateAccountRequest = {
          username: values.username,
          email: values.email,
          role: values.role,
          department_id: selectedDepartmentId || undefined,
        };

        if (values.password) {
          data.password = values.password;
        }

        await updateAccountMutation.mutateAsync(
          { id: props.selectedAccount.id, data },
          { onSuccess: () => props.onCancel() }
        );
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAddDept = async () => {
    if (!newDeptName.trim()) return;

    await createDeptMutation.mutateAsync(
      { name: newDeptName.trim() },
      {
        onSuccess: () => {
          setIsAddingDept(false);
          setNewDeptName('');
          refetchDepartments();
        },
      }
    );
  };

  const handleUpdateDept = async (id: string) => {
    if (!editingDeptName.trim()) {
      setEditingDeptId(null);
      return;
    }

    await updateDeptMutation.mutateAsync(
      { id, data: { name: editingDeptName.trim() } },
      {
        onSuccess: () => {
          setEditingDeptId(null);
          setEditingDeptName('');
          refetchDepartments();
        },
      }
    );
  };

  const handleDeleteDept = async (id: string) => {
    await deleteDeptMutation.mutateAsync(id, {
      onSuccess: () => {
        if (selectedDepartmentId === id) {
          setSelectedDepartmentId(null);
        }
        refetchDepartments();
      },
    });
  };

  const startEditingDept = (dept: Department) => {
    setEditingDeptId(dept.id);
    setEditingDeptName(dept.name);
  };

  React.useEffect(() => {
    if (props.selectedAccount) {
      form.setFieldsValue({
        username: props.selectedAccount.username,
        email: props.selectedAccount.email,
        role: props.selectedAccount.role,
      });
      setSelectedDepartmentId(props.selectedAccount.department_id || null);
      setCurrentRole(props.selectedAccount.role);
    } else {
      form.resetFields();
      setSelectedDepartmentId(null);
      setCurrentRole('CUSTOMER');
    }
    setEditingDeptId(null);
    setIsAddingDept(false);
    setNewDeptName('');
  }, [props.selectedAccount, form, props.visible]);

  const departmentColumns = [
    {
      title: 'Chọn',
      key: 'select',
      width: 60,
      render: (_: any, record: Department) => (
        <input
          type="radio"
          name="department"
          checked={selectedDepartmentId === record.id}
          onChange={() => setSelectedDepartmentId(record.id)}
          disabled={currentRole === 'CUSTOMER' || currentRole === 'ADMIN'}
        />
      ),
    },
    {
      title: 'Tên phòng ban',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Department) => {
        if (editingDeptId === record.id) {
          return (
            <Input
              size="small"
              value={editingDeptName}
              onChange={(e) => setEditingDeptName(e.target.value)}
              onPressEnter={() => handleUpdateDept(record.id)}
              onBlur={() => handleUpdateDept(record.id)}
              autoFocus
            />
          );
        }
        return (
          <span
            onClick={() => currentRole !== 'CUSTOMER' && currentRole !== 'ADMIN' && startEditingDept(record)}
            style={{ cursor: currentRole !== 'CUSTOMER' && currentRole !== 'ADMIN' ? 'pointer' : 'not-allowed' }}
            className={currentRole !== 'CUSTOMER' && currentRole !== 'ADMIN' ? 'hover:text-blue-600' : ''}
          >
            {name}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: (_: any, record: Department) => (
        <Popconfirm
          title="Xác nhận xóa"
          description={`Xóa phòng ban "${record.name}"?`}
          onConfirm={() => handleDeleteDept(record.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          disabled={currentRole === 'CUSTOMER' || currentRole === 'ADMIN'}
        >
          <Button type="text" size="small" danger icon={<CloseOutlined />} disabled={currentRole === 'CUSTOMER' || currentRole === 'ADMIN'} />
        </Popconfirm>
      ),
    },
  ];

  const deptList = departments?.data?.content || departments?.data || [];

  return (
    <Modal
      title={props.type === 'add' ? 'Thêm tài khoản mới' : 'Chỉnh sửa tài khoản'}
      open={props.visible}
      onCancel={props.onCancel}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={props.onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={createAccountMutation.isPending || updateAccountMutation.isPending}
          onClick={handleSubmit}
        >
          {props.type === 'add' ? 'Thêm' : 'Cập nhật'}
        </Button>,
      ]}
      width={MODAL_WIDTH}
    >
      <Form form={form} layout="vertical" initialValues={{ role: 'CUSTOMER' }}>
        <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
          <Input placeholder="Nhập tên đăng nhập" disabled={props.type === 'edit'} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: props.type === 'add', message: 'Vui lòng nhập mật khẩu!' }]}
          extra={props.type === 'edit' ? 'Để trống nếu không muốn thay đổi mật khẩu' : undefined}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
          <Select placeholder="Chọn vai trò" onChange={handleRoleChange} options={ROLE_OPTIONS} />
        </Form.Item>

        <Form.Item label="Phòng ban">
          <div className="space-y-2">
            {!isAddingDept ? (
              <Button
                type="dashed"
                onClick={() => setIsAddingDept(true)}
                icon={<PlusOutlined />}
                block
                disabled={currentRole === 'CUSTOMER' || currentRole === 'ADMIN'}
              >
                Thêm phòng ban
              </Button>
            ) : (
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="Nhập tên phòng ban"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  onPressEnter={handleAddDept}
                  autoFocus
                />
                <Button type="primary" onClick={handleAddDept}>
                  Thêm
                </Button>
                <Button onClick={() => { setIsAddingDept(false); setNewDeptName(''); }}>
                  Hủy
                </Button>
              </Space.Compact>
            )}

            {isLoadingDepartments ? (
              <div>Đang tải...</div>
            ) : (
              <Table
                columns={departmentColumns}
                dataSource={deptList}
                rowKey="id"
                size="small"
                pagination={false}
                scroll={{ y: 200 }}
                locale={{ emptyText: 'Chưa có phòng ban nào' }}
              />
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
